import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { isAdmin } from '@/lib/auth'

// Checks the session at request time (the expiry check reads the clock); render inside <Suspense>.
export default async function RequireAdmin({ children }: { children: React.ReactNode }) {
  await connection()
  if (!(await isAdmin())) redirect('/admin/login')
  return <>{children}</>
}
