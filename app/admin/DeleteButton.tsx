'use client'

import { useState } from 'react'

// Two-step delete so a stray click can't remove a post.
export default function DeleteButton({
  id,
  title,
  action,
}: {
  id: number
  title: string
  action: (formData: FormData) => Promise<void>
}) {
  const [confirming, setConfirming] = useState(false)
  if (!confirming) {
    return (
      <button className="pill danger sm" type="button" onClick={() => setConfirming(true)}>
        삭제
      </button>
    )
  }
  return (
    <form action={action} style={{ display: 'flex', gap: 6 }}>
      <input type="hidden" name="id" value={id} />
      <button className="pill danger sm" type="submit" aria-label={`‘${title}’ 삭제 확인`}>
        삭제 확인
      </button>
      <button className="pill ghost sm" type="button" onClick={() => setConfirming(false)}>
        취소
      </button>
    </form>
  )
}
