import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import LoginForm from './LoginForm'
import { authConfigured } from '@/lib/auth'
import { safeReturnTo } from '@/lib/return-to'

export const metadata: Metadata = { title: '관리자 로그인', robots: { index: false } }

export default function LoginPage(props: PageProps<'/admin/login'>) {
  return (
    <main className="wrap">
      <div className="login-card">
        <span className="label">Admin</span>
        <h1>IR 게시판 관리자</h1>
        <p style={{ color: 'var(--muted)', fontSize: 15 }}>
          로그인하면 IR · 공시 게시판에서 글을 쓰고, 게시글을 수정하거나 삭제할 수 있습니다.
        </p>
        {authConfigured() ? (
          <Suspense fallback={<LoginForm />}>
            <LoginWithReturn searchParams={props.searchParams} />
          </Suspense>
        ) : (
          <p className="notice err">
            관리자 비밀번호가 설정되지 않았습니다. 프로젝트 폴더의 .env.local 파일에 ADMIN_PASSWORD와 SESSION_SECRET을
            입력한 뒤 서버를 다시 시작해 주세요.
          </p>
        )}
        <Link href="/ir" style={{ fontSize: 14, color: 'var(--muted)' }}>
          ← IR · 공시 게시판으로
        </Link>
      </div>
    </main>
  )
}

async function LoginWithReturn({ searchParams }: Pick<PageProps<'/admin/login'>, 'searchParams'>) {
  const returnTo = safeReturnTo((await searchParams).returnTo) ?? undefined
  return <LoginForm returnTo={returnTo} />
}
