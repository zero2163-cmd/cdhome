// Shared by the upload route and the client form, so keep it free of server-only imports.
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024 // 20 MB per file

export const IMAGE_EXT = ['png', 'jpg', 'jpeg', 'gif', 'webp']
export const DOC_EXT = ['pdf', 'hwp', 'hwpx', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'txt', 'csv']
export const ALLOWED_EXT = [...IMAGE_EXT, ...DOC_EXT]

export const MIME_BY_EXT: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  pdf: 'application/pdf',
  hwp: 'application/x-hwp',
  hwpx: 'application/hwp+zip',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  zip: 'application/zip',
  txt: 'text/plain; charset=utf-8',
  csv: 'text/csv; charset=utf-8',
}

export const extOf = (name: string) => name.split('.').pop()?.toLowerCase() ?? ''

export type UploadedFile = { id: string; url: string; name: string; size: number; isImage: boolean }
