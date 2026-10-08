'use server'

import fs from 'node:fs/promises'
import path from 'node:path'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { checkPassword, endSession, isAdmin, startSession } from '@/lib/auth'
import { db, UPLOAD_DIR } from '@/lib/db'
import { isCategory } from '@/lib/posts'
import { safeReturnTo } from '@/lib/return-to'
import { cleanContent, inlineFileIds } from '@/lib/sanitize'

export type FormState = { error?: string } | undefined

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get('password') ?? '')
  if (!checkPassword(password)) return { error: '비밀번호가 맞지 않습니다. 다시 입력해 주세요.' }
  await startSession()
  redirect(safeReturnTo(formData.get('returnTo')) ?? '/admin')
}

export async function logout(formData: FormData) {
  await endSession()
  redirect(safeReturnTo(formData.get('returnTo')) ?? '/admin/login')
}

// Edits started from the public board return there; edits from the admin list return to the list.
const fromBoard = (formData: FormData) => safeReturnTo(formData.get('returnTo'))?.startsWith('/ir') ?? false

async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin/login')
}

function readPost(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const category = formData.get('category')
  const content = cleanContent(String(formData.get('content') ?? ''))
  const pinned = formData.get('pinned') === 'on' ? 1 : 0
  let attachments: string[] = []
  try {
    attachments = JSON.parse(String(formData.get('attachments') ?? '[]'))
  } catch {}
  if (!title) return { error: '제목을 입력해 주세요.' } as const
  if (title.length > 200) return { error: '제목은 200자 이내로 입력해 주세요.' } as const
  if (!isCategory(category)) return { error: '분류를 선택해 주세요.' } as const
  if (!content.replace(/<[^>]*>/g, '').trim() && !content.includes('<img')) {
    return { error: '본문을 입력해 주세요.' } as const
  }
  return { title, category, content, pinned, attachments: attachments.filter((v) => typeof v === 'string') } as const
}

// Point the given uploads at this post; uploads dropped from the form are detached.
function linkFiles(postId: number, attachmentIds: string[], content: string) {
  const ids = [...new Set([...attachmentIds, ...inlineFileIds(content)])]
  db.prepare('UPDATE files SET post_id = NULL WHERE post_id = ?').run(postId)
  const link = db.prepare('UPDATE files SET post_id = ? WHERE id = ? AND (post_id IS NULL OR post_id = ?)')
  for (const id of ids) link.run(postId, id, postId)
}

export async function createPost(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const p = readPost(formData)
  if ('error' in p) return { error: p.error }
  const now = new Date().toISOString()
  const res = db
    .prepare(
      'INSERT INTO posts (category, title, content, pinned, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
    )
    .run(p.category, p.title, p.content, p.pinned, now, now)
  const newId = Number(res.lastInsertRowid)
  linkFiles(newId, p.attachments, p.content)
  revalidatePath('/', 'layout')
  redirect(fromBoard(formData) ? `/ir/${newId}` : '/admin?saved=1')
}

export async function updatePost(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const p = readPost(formData)
  if ('error' in p) return { error: p.error }
  const res = db
    .prepare('UPDATE posts SET category = ?, title = ?, content = ?, pinned = ?, updated_at = ? WHERE id = ?')
    .run(p.category, p.title, p.content, p.pinned, new Date().toISOString(), id)
  if (res.changes === 0) return { error: '게시글을 찾을 수 없습니다. 이미 삭제되었을 수 있습니다.' }
  linkFiles(id, p.attachments, p.content)
  revalidatePath('/', 'layout')
  redirect(fromBoard(formData) ? `/ir/${id}` : '/admin?saved=1')
}

export async function deletePost(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const files = db.prepare('SELECT stored_name FROM files WHERE post_id = ?').all(id) as { stored_name: string }[]
  db.prepare('DELETE FROM files WHERE post_id = ?').run(id)
  db.prepare('DELETE FROM posts WHERE id = ?').run(id)
  await Promise.all(files.map((f) => fs.rm(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, path.basename(f.stored_name)), { force: true })))
  revalidatePath('/', 'layout')
  redirect(fromBoard(formData) ? '/ir' : '/admin?deleted=1')
}
