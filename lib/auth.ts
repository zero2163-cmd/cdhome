import 'server-only'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

// Single shared admin password (ADMIN_PASSWORD) and a signed session cookie (SESSION_SECRET).
// Good enough for one IR team; swap for real accounts if several people need separate logins.
const COOKIE = 'cardong_admin'
const MAX_AGE = 60 * 60 * 8 // 8 hours

export function authConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.SESSION_SECRET)
}

function sign(value: string) {
  return createHmac('sha256', process.env.SESSION_SECRET!).update(value).digest('base64url')
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}

export function checkPassword(input: string) {
  if (!authConfigured()) return false
  return safeEqual(sign(input), sign(process.env.ADMIN_PASSWORD!))
}

export async function startSession() {
  const exp = String(Date.now() + MAX_AGE * 1000)
  ;(await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export async function endSession() {
  ;(await cookies()).delete(COOKIE)
}

export function isValidToken(token: string | undefined) {
  if (!token || !authConfigured()) return false
  const [exp, sig] = token.split('.')
  if (!exp || !sig || !safeEqual(sig, sign(exp))) return false
  return Number(exp) > Date.now()
}

export async function isAdmin() {
  return isValidToken((await cookies()).get(COOKIE)?.value)
}
