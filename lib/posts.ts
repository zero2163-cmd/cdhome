import 'server-only'
import { db } from './db'


export type Post = {
  id: number
  title: string
  content: string
  pinned: number
  views: number
  created_at: string
  updated_at: string
}
export type PostSummary = Omit<Post, 'content'> & { file_count: number; is_new: number }
export type FileRow = {
  id: string
  post_id: number | null
  original_name: string
  stored_name: string
  mime: string
  size: number
  is_attachment: number
  created_at: string
}

export const PAGE_SIZE = 10

export function listPosts(opts: { q?: string; page?: number; pageSize?: number }) {
  const where: string[] = []
  const args: (string | number)[] = []
  if (opts.q) {
    where.push('p.title LIKE ?')
    args.push(`%${opts.q}%`)
  }
  const w = where.length ? `WHERE ${where.join(' AND ')}` : ''
  const size = opts.pageSize ?? PAGE_SIZE
  const page = Math.max(1, opts.page ?? 1)
  const total = (db.prepare(`SELECT COUNT(*) AS n FROM posts p ${w}`).get(...args) as { n: number }).n
  const rows = db
    .prepare(
      `SELECT p.id, p.title, p.pinned, p.views, p.created_at, p.updated_at,
              (SELECT COUNT(*) FROM files f WHERE f.post_id = p.id AND f.is_attachment = 1) AS file_count,
              (julianday('now') - julianday(p.created_at) < 14) AS is_new
         FROM posts p ${w}
        ORDER BY p.pinned DESC, p.created_at DESC
        LIMIT ? OFFSET ?`,
    )
    .all(...args, size, (page - 1) * size) as unknown as PostSummary[]
  return { rows, total, page, pages: Math.max(1, Math.ceil(total / size)) }
}

export function getPost(id: number) {
  return db.prepare('SELECT * FROM posts WHERE id = ?').get(id) as Post | undefined
}

export function incrementViews(id: number) {
  db.prepare('UPDATE posts SET views = views + 1 WHERE id = ?').run(id)
}

export function getAttachments(postId: number) {
  return db
    .prepare('SELECT * FROM files WHERE post_id = ? AND is_attachment = 1 ORDER BY created_at')
    .all(postId) as unknown as FileRow[]
}

export function getFile(id: string) {
  return db.prepare('SELECT * FROM files WHERE id = ?').get(id) as FileRow | undefined
}

// Neighbours in the public list order, for the previous/next links on a detail page.
export function getNeighbours(post: Post) {
  const newer = db
    .prepare('SELECT id, title FROM posts WHERE created_at > ? ORDER BY created_at ASC LIMIT 1')
    .get(post.created_at) as { id: number; title: string } | undefined
  const older = db
    .prepare('SELECT id, title FROM posts WHERE created_at < ? ORDER BY created_at DESC LIMIT 1')
    .get(post.created_at) as { id: number; title: string } | undefined
  return { newer, older }
}

export function latestPost() {
  return db.prepare('SELECT id, title, created_at FROM posts ORDER BY created_at DESC LIMIT 1').get() as
    | { id: number; title: string; created_at: string }
    | undefined
}
