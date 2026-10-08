import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { Suspense } from 'react'
import PostForm from '@/components/admin/PostForm'
import RequireAdmin from '@/components/RequireAdmin'
import { CATEGORIES, getAttachments, getPost } from '@/lib/posts'
import { safeReturnTo } from '@/lib/return-to'
import { updatePost } from '../../../actions'

export const metadata: Metadata = { title: '게시글 수정', robots: { index: false } }

export default function EditPostPage(props: PageProps<'/admin/posts/[id]/edit'>) {
  return (
    <main>
      <div className="wrap page-head">
        <span className="label">Admin</span>
        <h1>게시글 수정</h1>
      </div>
      <div className="wrap page-body">
        <Suspense fallback={<p className="empty">불러오는 중입니다.</p>}>
          <RequireAdmin>
            <EditForm params={props.params} searchParams={props.searchParams} />
          </RequireAdmin>
        </Suspense>
      </div>
    </main>
  )
}

async function EditForm({ params, searchParams }: Pick<PageProps<'/admin/posts/[id]/edit'>, 'params' | 'searchParams'>) {
  await connection()
  const { id } = await params
  const returnTo = safeReturnTo((await searchParams).returnTo) ?? undefined
  const post = /^\d+$/.test(id) ? getPost(Number(id)) : undefined
  if (!post) notFound()
  const attachments = getAttachments(post.id).map((f) => ({ id: f.id, name: f.original_name, size: f.size }))
  return (
    <PostForm
      action={updatePost.bind(null, post.id)}
      categories={CATEGORIES}
      submitLabel="수정 내용 저장"
      returnTo={returnTo}
      initial={{ title: post.title, category: post.category, content: post.content, pinned: !!post.pinned, attachments }}
    />
  )
}
