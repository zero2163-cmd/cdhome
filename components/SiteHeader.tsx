'use client'

import Link from 'next/link'
import { useState, useSyncExternalStore } from 'react'
import Logo from './Logo'

const NAV = [
  { href: '/#about', label: '회사소개' },
  { href: '/#portfolio', label: '포트폴리오' },
  { href: '/ir', label: 'IR · 공시' },
]

// The theme lives on <html data-theme>; the inline script in layout.tsx sets it before paint.
function subscribeTheme(onChange: () => void) {
  const mo = new MutationObserver(onChange)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => mo.disconnect()
}
const readTheme = () => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light')

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const theme = useSyncExternalStore(subscribeTheme, readTheme, () => 'light')

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('cd-theme', next)
    } catch {}
  }

  return (
    <header className="top">
      <div className="wrap">
        <Link className="logo" href="/" aria-label="카동 CARDONG 홈">
          <Logo />
        </Link>
        <nav className={`main${open ? ' open' : ''}`} id="mainNav" onClick={() => setOpen(false)}>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="right">
          <button
            className="theme-btn"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? '다크 모드로 보기' : '라이트 모드로 보기'}
            title={theme === 'light' ? '다크 모드' : '라이트 모드'}
          >
            {theme === 'light' ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
              </svg>
            )}
          </button>
          <Link className="pill" href="/#contact">
            문의하기
          </Link>
          <button className="menu-btn" type="button" aria-expanded={open} aria-controls="mainNav" onClick={() => setOpen((o) => !o)}>
            메뉴
          </button>
        </div>
      </div>
    </header>
  )
}
