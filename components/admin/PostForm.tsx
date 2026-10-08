'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import type { FormState } from '@/app/admin/actions'
import { formatBytes } from '@/lib/format'
import { ALLOWED_EXT } from '@/lib/uploads'
import Editor from './Editor'
import { uploadFile } from './upload'

type Attachment = { id: string; name: string; size: number }
type Pending = { key: string; name: string }

export type PostFormValues = {
  title: string
  category: string
  content: string
  pinned: boolean
  attachments: Attachment[]
}

export default function PostForm({
  action,
  initial,
  categories,
  submitLabel,
  returnTo,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>
  initial: PostFormValues
  categories: readonly string[]
  submitLabel: string
  /** Page to come back to after saving or cancelling (board, post, or admin list). */
  returnTo?: string
}) {
  const [state, formAction, saving] = useActionState(action, undefined)
  const [files, setFiles] = useState<Attachment[]>(initial.attachments)
  const [pending, setPending] = useState<Pending[]>([])
  const [uploadError, setUploadError] = useState('')
  const [over, setOver] = useState(false)

  async function addFiles(list: FileList | null) {
    if (!list?.length) return
    setUploadError('')
    await Promise.all(
      [...list].map(async (f) => {
        const key = `${f.name}-${f.size}-${Math.random()}`
        setPending((p) => [...p, { key, name: f.name }])
        try {
          const up = await uploadFile(f, 'attachment')
          setFiles((cur) => [...cur, { id: up.id, name: up.name, size: up.size }])
        } catch (e) {
          setUploadError((e as Error).message)
        } finally {
          setPending((p) => p.filter((x) => x.key !== key))
        }
      }),
    )
  }

  return (
    <form className="form" action={formAction}>
      {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
      {state?.error && (
        <p className="notice err" role="alert">
          {state.error}
        </p>
      )}
      <div className="row-2">
        <label className="field">
          <span>분류</span>
          <select className="select" name="category" defaultValue={initial.category} required>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>제목</span>
          <input className="input" name="title" defaultValue={initial.title} maxLength={200} required placeholder="예: 제12기 정기주주총회 소집공고" />
        </label>
      </div>
      <label className="check">
        <input type="checkbox" name="pinned" defaultChecked={initial.pinned} /> 목록 맨 위에 공지로 고정
      </label>

      <div className="field">
        <span>본문</span>
        <Editor initialHTML={initial.content} onError={setUploadError} />
      </div>

      <div className="field">
        <span>첨부파일</span>
        <div
          className={`dropzone${over ? ' over' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setOver(true)
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setOver(false)
            addFiles(e.dataTransfer.files)
          }}
        >
          <p>파일을 여기로 끌어다 놓거나 아래 버튼으로 선택하세요.</p>
          <label className="pill ghost sm" style={{ cursor: 'pointer' }}>
            파일 선택
            <input type="file" multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
          </label>
          <small>파일당 20MB까지 · {ALLOWED_EXT.join(', ')}</small>
        </div>
        {uploadError && (
          <p className="notice err" role="alert">
            {uploadError}
          </p>
        )}
        {(files.length > 0 || pending.length > 0) && (
          <ul className="att-list">
            {files.map((f) => (
              <li key={f.id}>
                <div>
                  {f.name} <span>{formatBytes(f.size)}</span>
                </div>
                <button type="button" onClick={() => setFiles((cur) => cur.filter((x) => x.id !== f.id))}>
                  빼기
                </button>
              </li>
            ))}
            {pending.map((p) => (
              <li key={p.key} className="busy">
                {p.name} <span>업로드 중…</span>
              </li>
            ))}
          </ul>
        )}
        <input type="hidden" name="attachments" value={JSON.stringify(files.map((f) => f.id))} />
      </div>

      <div className="form-actions">
        <Link className="pill ghost" href={returnTo ?? '/admin'}>
          취소
        </Link>
        <button className="pill" type="submit" disabled={saving || pending.length > 0}>
          {saving ? '저장 중…' : pending.length > 0 ? '업로드 기다리는 중…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
