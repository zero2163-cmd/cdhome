import Link from 'next/link'
import { logout } from '@/app/admin/actions'

// Shown on the public board only while an admin is signed in.
export default function AdminStrip({ returnTo }: { returnTo: string }) {
  return (
    <div className="admin-strip" role="status">
      <span>
        <b>관리자 모드</b> · 게시글을 쓰고, 수정하고, 삭제할 수 있습니다.
      </span>
      <span className="admin-strip-links">
        <Link href="/admin">관리자 목록</Link>
        <form action={logout}>
          <input type="hidden" name="returnTo" value={returnTo} />
          <button type="submit">로그아웃</button>
        </form>
      </span>
    </div>
  )
}
