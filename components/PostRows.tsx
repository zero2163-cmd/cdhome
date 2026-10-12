import Link from 'next/link'
import { formatDate } from '@/lib/format'
import type { PostSummary } from '@/lib/posts'

export default function PostRows({ rows, emptyText }: { rows: PostSummary[]; emptyText: string }) {
  if (rows.length === 0) return <p className="empty">{emptyText}</p>
  return (
    <ul className="rows">
      {rows.map((p) => (
        <li key={p.id}>
          <Link href={`/notice/${p.id}`}>
            <span className="t">
              {p.pinned ? <span className="pin">공지</span> : null}
              {p.title}
              {/* is_new: posted within 14 days, computed in SQL (lib/posts.ts) */}
              {p.is_new ? <span className="new" aria-label="새 글" /> : null}
              {p.file_count > 0 && <small>첨부 {p.file_count}건</small>}
            </span>
            <span className="d">{formatDate(p.created_at)}</span>
            <span className="go" aria-hidden="true">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
