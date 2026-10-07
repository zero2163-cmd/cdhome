import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { isAdmin } from '@/lib/auth'
import { db, UPLOAD_DIR } from '@/lib/db'
import { ALLOWED_EXT, IMAGE_EXT, MAX_UPLOAD_BYTES, MIME_BY_EXT, extOf, type UploadedFile } from '@/lib/uploads'

// Upload goes through a Route Handler rather than a Server Action so files aren't capped by the action body limit.
// The file is stored unlinked (post_id NULL) and attached when the post is saved.
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: '로그인이 만료되었습니다. 다시 로그인해 주세요.' }, { status: 401 })
  }

  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: '업로드할 파일을 선택해 주세요.' }, { status: 400 })
  }
  const ext = extOf(file.name)
  if (!ALLOWED_EXT.includes(ext)) {
    return Response.json(
      { error: `${file.name}: 올릴 수 없는 형식입니다. 가능한 형식: ${ALLOWED_EXT.join(', ')}` },
      { status: 400 },
    )
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return Response.json({ error: `${file.name}: 파일이 20MB를 넘습니다.` }, { status: 413 })
  }
  const asImage = form?.get('kind') === 'image'
  if (asImage && !IMAGE_EXT.includes(ext)) {
    return Response.json({ error: '본문에는 이미지(png, jpg, gif, webp)만 넣을 수 있습니다.' }, { status: 400 })
  }

  const id = randomUUID()
  const storedName = `${id}.${ext}`
  await fs.writeFile(path.join(/*turbopackIgnore: true*/ UPLOAD_DIR, storedName), Buffer.from(await file.arrayBuffer()))
  db.prepare(
    `INSERT INTO files (id, post_id, original_name, stored_name, mime, size, is_attachment, created_at)
     VALUES (?, NULL, ?, ?, ?, ?, ?, ?)`,
  ).run(id, file.name, storedName, MIME_BY_EXT[ext], file.size, asImage ? 0 : 1, new Date().toISOString())

  const body: UploadedFile = { id, url: `/files/${id}`, name: file.name, size: file.size, isImage: IMAGE_EXT.includes(ext) }
  return Response.json(body)
}
