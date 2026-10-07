import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="site">
      <div className="wrap">
        <div>© 2026 CARDONG Co., Ltd.</div>
        <div className="links">
          <Link href="/#about">회사소개</Link>
          <Link href="/ir">IR · 공시</Link>
          <Link href="/#contact">개인정보처리방침</Link>
          <a href="https://www2.car-auction.co.kr/" target="_blank" rel="noopener noreferrer">
            카옥션 ↗
          </a>
          <Link href="/admin">관리자</Link>
        </div>
      </div>
    </footer>
  )
}
