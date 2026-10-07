import { ALLOWED_EXT, MAX_UPLOAD_BYTES, extOf, type UploadedFile } from '@/lib/uploads'

// Client-side checks mirror the server's so people get the message before the upload starts.
export async function uploadFile(file: File, kind: 'image' | 'attachment'): Promise<UploadedFile> {
  if (!ALLOWED_EXT.includes(extOf(file.name))) {
    throw new Error(`${file.name}: 올릴 수 없는 형식입니다. 가능한 형식: ${ALLOWED_EXT.join(', ')}`)
  }
  if (file.size > MAX_UPLOAD_BYTES) throw new Error(`${file.name}: 파일이 20MB를 넘습니다.`)
  const body = new FormData()
  body.append('file', file)
  body.append('kind', kind)
  const res = await fetch('/api/upload', { method: 'POST', body })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? `${file.name}: 업로드하지 못했습니다. 잠시 후 다시 시도해 주세요.`)
  return data as UploadedFile
}
