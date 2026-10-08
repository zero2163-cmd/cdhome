'use client'

import { useActionState } from 'react'
import { login } from '../actions'

export default function LoginForm({ returnTo }: { returnTo?: string }) {
  const [state, action, pending] = useActionState(login, undefined)
  return (
    <form className="form" action={action}>
      {state?.error && (
        <p className="notice err" role="alert">
          {state.error}
        </p>
      )}
      {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
      <label className="field">
        <span>비밀번호</span>
        <input className="input" name="password" type="password" autoComplete="current-password" required autoFocus />
      </label>
      <button className="pill" type="submit" disabled={pending} style={{ justifySelf: 'start' }}>
        {pending ? '확인 중…' : '로그인'}
      </button>
    </form>
  )
}
