import type { Metadata } from 'next'
import LoginForm from './LoginForm'
import { authConfigured } from '@/lib/auth'

export const metadata: Metadata = { title: '관리자 로그인', robots: { index: false } }

export default function LoginPage() {
  return (
    <main className="wrap">
      <div className="login-card">
        <span className="label">Admin</span>
        <h1>IR 게시판 관리자</h1>
        {authConfigured() ? (
          <LoginForm />
        ) : (
          <p className="notice err">
            관리자 비밀번호가 설정되지 않았습니다. 프로젝트 폴더의 .env.local 파일에 ADMIN_PASSWORD와 SESSION_SECRET을
            입력한 뒤 서버를 다시 시작해 주세요.
          </p>
        )}
      </div>
    </main>
  )
}
