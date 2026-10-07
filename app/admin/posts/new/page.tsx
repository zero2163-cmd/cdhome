import type { Metadata } from 'next'
import { Suspense } from 'react'
import PostForm from '@/components/admin/PostForm'
import RequireAdmin from '@/components/RequireAdmin'
import { CATEGORIES } from '@/lib/posts'
import { createPost } from '../../actions'

export const metadata: Metadata = { title: '새 글 쓰기', robots: { index: false } }

export default function NewPostPage() {
  return (
    <main>
      <div className="wrap page-head">
        <span className="label">Admin</span>
        <h1>새 글 쓰기</h1>
      </div>
      <div className="wrap page-body">
        <Suspense fallback={<p className="empty">불러오는 중입니다.</p>}>
          <RequireAdmin>
            <PostForm
              action={createPost}
              categories={CATEGORIES}
              submitLabel="게시하기"
              initial={{ title: '', category: CATEGORIES[0], content: '', pinned: false, attachments: [] }}
            />
          </RequireAdmin>
        </Suspense>
      </div>
    </main>
  )
}
