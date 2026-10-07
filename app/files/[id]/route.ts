import fs from 'node:fs/promises'
import path from 'node:path'
import { connection } from 'next/server'
import { UPLOAD_DIR } from '@/lib/db'
import { getFile } from '@/lib/posts'

// Serves uploaded files: images inline (for the post body), everything else as a download.
export async function GET(_request: Request, ctx: RouteContext<'/files/[id]'>) {
  await connection()
  const { id } = await ctx.params
  const file = /^[A-Za-z0-9-]+$/.test(id) ? getFile(id) : undefined
  if (!file) return new Response('파일을 찾을 수 없습니다.', { status: 404 })

  const data = await fs.readFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, path.basename(file.stored_name))).catch(() => null)
  if (!data) return new Response('파일을 찾을 수 없습니다.', { status: 404 })

  const inline = file.mime.startsWith('image/')
  const encoded = encodeURIComponent(file.original_name)
  return new Response(new Uint8Array(data), {
    headers: {
      'Content-Type': file.mime,
      'Content-Length': String(data.length),
      'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encoded}`,
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
