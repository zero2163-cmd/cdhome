import type { Metadata } from 'next'
import Link from 'next/link'
import { connection } from 'next/server'
import { Suspense } from 'react'
import AdminStrip from '@/components/AdminStrip'
import PostRows from '@/components/PostRows'
import { isAdmin } from '@/lib/auth'
import { CATEGORIES, countByCategory, isCategory, listPosts } from '@/lib/posts'

export const metadata: Metadata = { title: 'IR · 공시' }

export default function IrPage(props: PageProps<'/ir'>) {
  return (
    <main>
      <div className="wrap page-head">
        <span className="label">Investor relations</span>
        <h1>IR · 공시</h1>
        <p>주주총회 소집 통지와 결과, 공고, 공시 자료를 게시합니다. 모든 주주께 같은 날 동일한 정보를 제공합니다.</p>
      </div>
      <div className="wrap page-body">
        <div className="board">
          <Suspense fallback={<p className="empty">게시글을 불러오는 중입니다.</p>}>
            <Board searchParams={props.searchParams} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

function href(params: { cat?: string; q?: string; page?: number }) {
  const s = new URLSearchParams()
  if (params.cat) s.set('cat', params.cat)
  if (params.q) s.set('q', params.q)
  if (params.page && params.page > 1) s.set('page', String(params.page))
  const qs = s.toString()
  return qs ? `/ir?${qs}` : '/ir'
}

async function Board({ searchParams }: Pick<PageProps<'/ir'>, 'searchParams'>) {
  await connection()
  const sp = await searchParams
  const cat = isCategory(sp.cat) ? sp.cat : undefined
  const q = typeof sp.q === 'string' ? sp.q.trim().slice(0, 100) : ''
  const page = Math.max(1, Number(sp.page) || 1)
  const counts = countByCategory()
  const { rows, pages, total } = listPosts({ category: cat, q, page })
  const admin = await isAdmin()

  return (
    <>
      {admin && <AdminStrip returnTo="/ir" />}
      <div className="tools">
        <nav className="tabs" aria-label="분류">
          {(['전체', ...CATEGORIES] as const).map((c) => {
            const active = c === '전체' ? !cat : cat === c
            return (
              <Link key={c} href={href({ cat: c === '전체' ? undefined : c, q })} aria-current={active ? 'page' : undefined}>
                {c}
                <span className="n">{counts[c] ?? 0}</span>
              </Link>
            )
          })}
        </nav>
        <div className="tools-right">
          <form className="search" action="/ir" role="search">
            {cat && <input type="hidden" name="cat" value={cat} />}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input name="q" type="search" defaultValue={q} placeholder="제목 검색" aria-label="게시글 제목 검색" />
            <button type="submit">검색</button>
          </form>
          {admin && (
            <Link className="pill sm" href="/admin/posts/new?returnTo=/ir">
              + 글쓰기
            </Link>
          )}
        </div>
      </div>
      <PostRows
        rows={rows}
        emptyText={q ? `'${q}' 검색 결과가 없습니다. 다른 단어로 검색해 보세요.` : '아직 등록된 게시글이 없습니다.'}
      />
      {pages > 1 && (
        <nav className="pager" aria-label={`페이지 (총 ${total}건)`}>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link key={n} href={href({ cat, q, page: n })} aria-current={n === page ? 'page' : undefined}>
              {n}
            </Link>
          ))}
        </nav>
      )}
    </>
  )
}
