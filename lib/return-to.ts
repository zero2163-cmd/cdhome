// Where to send someone after login or a post change. Only on-site board/admin paths are allowed,
// so a crafted link can't bounce an admin to another site.
export function safeReturnTo(value: unknown): string | null {
  return typeof value === 'string' && /^\/(ir(\/\d+)?|admin)$/.test(value) ? value : null
}
