// Dates are stored as ISO strings (UTC) and shown in Korea time.
const KST = 9 * 60 * 60 * 1000

export function formatDate(iso: string) {
  const d = new Date(new Date(iso).getTime() + KST)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}.${p(d.getUTCMonth() + 1)}.${p(d.getUTCDate())}`
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(1)} MB`
}
