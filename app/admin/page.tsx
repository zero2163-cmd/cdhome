import type { Metadata } from 'next'
import Link from 'next/link'
import { connection } from 'next/server'
import { Suspense } from 'react'
import { CategoryChip } from '@/components/PostRows'
import RequireAdmin from '@/components/RequireAdmin'
import { formatDate } from '@/lib/format'
import { listPosts } from '@/lib/posts'
import { deletePost, logout } from './actions'
import DeleteButton from './DeleteButton'

export const metadata: Metadata = { title: '게시글 관리', robots: { index: false } }

export default function AdminPage(props: PageProps<'/admin'>) {
  return (
    <main>
      <div className="wrap page-head">
        <span className="label">Admin</span>
        <h1>게시글 관리</h1>
      </div>
      <div className="wrap page-body">
        <Suspense fallback={<p className="empty">불러오는 중입니다.</p>}>
          <RequireAdmin>
            <Dashboard searchParams={props.searchParams} />
          </RequireAdmin>
        </Suspense>
      </div>
    </main>
  )
}

async function Dashboard({ searchParams }: Pick<PageProps<'/admin'>, 'searchParams'>) {
  await connection()
  const sp = await searchParams
  const page = Math.max(1, Number(sp.page) || 1)
  const { rows, pages, total } = listPosts({ page, pageSize: 20 })

  return (
    <>
      <div className="admin-bar">
        <span className="who">전체 {total}건</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <form action={logout}>
            <button className="pill ghost sm" type="submit">
              로그아웃
            </button>
          </form>
          <Link className="pill sm" href="/admin/posts/new">
            새 글 쓰기
          </Link>
        </div>
      </div>
      {sp.saved && <p className="notice ok">게시글을 저장했습니다.</p>}
      {sp.deleted && <p className="notice ok">게시글을 삭제했습니다.</p>}
      <div className="board scroll-x">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>번호</th>
              <th style={{ width: 110 }}>분류</th>
              <th>제목</th>
              <th style={{ width: 70 }}>첨부</th>
              <th style={{ width: 70 }}>조회</th>
              <th style={{ width: 110 }}>등록일</th>
              <th style={{ width: 210 }} aria-label="관리" />
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="empty">
                  아직 게시글이 없습니다. 오른쪽 위 ‘새 글 쓰기’로 첫 글을 등록해 보세요.
                </td>
              </tr>
            )}
            {rows.map((p) => (
              <tr key={p.id}>
                <td className="num">{p.id}</td>
                <td>
                  <CategoryChip category={p.category} />
                </td>
                <td>
                  {p.pinned ? <b style={{ color: 'var(--brand)', marginRight: 6, fontSize: 12.5 }}>공지</b> : null}
                  <Link href={`/ir/${p.id}`}>{p.title}</Link>
                </td>
                <td className="num">{p.file_count}</td>
                <td className="num">{p.views}</td>
                <td className="num">{formatDate(p.created_at)}</td>
                <td>
                  <div className="acts">
                    <Link className="pill ghost sm" href={`/admin/posts/${p.id}/edit`}>
                      수정
                    </Link>
                    <DeleteButton id={p.id} title={p.title} action={deletePost} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <nav className="pager" aria-label="페이지">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link key={n} href={n === 1 ? '/admin' : `/admin?page=${n}`} aria-current={n === page ? 'page' : undefined}>
              {n}
            </Link>
          ))}
        </nav>
      )}
    </>
  )
}
