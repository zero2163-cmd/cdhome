import Link from 'next/link'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { Suspense } from 'react'
import DeleteButton from '@/app/admin/DeleteButton'
import { deletePost } from '@/app/admin/actions'
import AdminStrip from '@/components/AdminStrip'
import { CategoryChip } from '@/components/PostRows'
import { isAdmin } from '@/lib/auth'
import { formatBytes, formatDate } from '@/lib/format'
import { getAttachments, getNeighbours, getPost, incrementViews } from '@/lib/posts'

export default function PostPage(props: PageProps<'/ir/[id]'>) {
  return (
    <main>
      <div className="wrap page-head" style={{ paddingBottom: 24 }}>
        <nav className="crumbs" aria-label="위치">
          <Link href="/">홈</Link>
          <span>/</span>
          <Link href="/ir">IR · 공시</Link>
        </nav>
      </div>
      <div className="wrap page-body">
        <Suspense fallback={<div className="article"><p className="empty">게시글을 불러오는 중입니다.</p></div>}>
          <Article params={props.params} />
        </Suspense>
      </div>
    </main>
  )
}

async function Article({ params }: Pick<PageProps<'/ir/[id]'>, 'params'>) {
  await connection()
  const { id } = await params
  const post = /^\d+$/.test(id) ? getPost(Number(id)) : undefined
  if (!post) notFound()
  incrementViews(post.id)
  const files = getAttachments(post.id)
  const { newer, older } = getNeighbours(post)
  const admin = await isAdmin()

  return (
    <>
      {admin && <AdminStrip returnTo={`/ir/${post.id}`} />}
      <article className="article">
        <header className="hd">
          <CategoryChip category={post.category} />
          <h1>{post.title}</h1>
          <div className="meta">
            <span>등록일 {formatDate(post.created_at)}</span>
            {post.updated_at !== post.created_at && <span>수정일 {formatDate(post.updated_at)}</span>}
            <span>조회 {post.views + 1}</span>
          </div>
        </header>

        {/* Sanitized on save (lib/sanitize.ts), so it is safe to render as HTML. */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />

        {files.length > 0 && (
          <section className="files" aria-label="첨부파일">
            <h2>첨부파일 {files.length}</h2>
            {files.map((f) => (
              <a key={f.id} href={`/files/${f.id}`} download={f.original_name}>
                <b style={{ fontWeight: 500 }}>{f.original_name}</b>
                <span>{formatBytes(f.size)} · 내려받기</span>
              </a>
            ))}
          </section>
        )}

        <nav className="post-nav" aria-label="이전 글, 다음 글">
          {older ? (
            <Link href={`/ir/${older.id}`}>
              <small>이전 글</small>
              <b>{older.title}</b>
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link className="next" href={`/ir/${newer.id}`}>
              <small>다음 글</small>
              <b>{newer.title}</b>
            </Link>
          ) : (
            <span />
          )}
        </nav>
        <div className="actions">
          <Link className="pill ghost" href="/ir">
            ← 목록으로
          </Link>
          {admin && (
            <div className="owner-actions">
              <Link className="pill ghost" href={`/admin/posts/${post.id}/edit?returnTo=/ir/${post.id}`}>
                수정
              </Link>
              <DeleteButton id={post.id} title={post.title} action={deletePost} returnTo="/ir" />
            </div>
          )}
        </div>
      </article>
    </>
  )
}
