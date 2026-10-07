'use client'

import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { EditorContent, useEditor, useEditorState, type Editor as TiptapEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extensions'
import { useRef, useState } from 'react'
import { uploadFile } from './upload'

// Rich-text editor for IR posts. Output HTML is mirrored into a hidden input named "content";
// the server sanitizes it again on save.
export default function Editor({ initialHTML, onError }: { initialHTML: string; onError: (msg: string) => void }) {
  const [html, setHtml] = useState(initialHTML)
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, defaultProtocol: 'https' },
      }),
      Image.configure({ inline: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: '본문을 입력하세요. 이미지는 툴바의 ‘이미지’ 버튼이나 붙여넣기로 넣을 수 있습니다.' }),
    ],
    content: initialHTML,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: {
      // Pasted or dropped image files are uploaded and inserted.
      handlePaste: (_view, event) => insertImageFiles(event.clipboardData?.files),
      handleDrop: (_view, event) => insertImageFiles((event as DragEvent).dataTransfer?.files),
    },
  })

  function insertImageFiles(list: FileList | null | undefined) {
    const images = [...(list ?? [])].filter((f) => f.type.startsWith('image/'))
    if (!images.length || !editor) return false
    images.forEach(async (f) => {
      try {
        const up = await uploadFile(f, 'image')
        editor.chain().focus().setImage({ src: up.url, alt: up.name }).run()
      } catch (e) {
        onError((e as Error).message)
      }
    })
    return true
  }

  return (
    <div className="editor">
      {editor && <Toolbar editor={editor} onImages={insertImageFiles} />}
      <EditorContent editor={editor} />
      <input type="hidden" name="content" value={html} />
    </div>
  )
}

type ButtonProps = { on?: boolean; label: string; title: string; run: () => void; disabled?: boolean }

function B({ on, label, title, run, disabled }: ButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={on ?? undefined}
      title={title}
      aria-label={title}
      // Keep the editor's selection: without this the click blurs the editor before the command runs.
      onMouseDown={(e) => e.preventDefault()}
      onClick={run}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

function Toolbar({ editor, onImages }: { editor: TiptapEditor; onImages: (f: FileList | null) => boolean }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      link: e.isActive('link'),
      left: e.isActive({ textAlign: 'left' }),
      center: e.isActive({ textAlign: 'center' }),
      right: e.isActive({ textAlign: 'right' }),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })
  const c = () => editor.chain().focus()

  function setLink() {
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('링크 주소를 입력하세요. 비워 두면 링크를 지웁니다.', prev ?? 'https://')
    if (url === null) return
    if (url.trim() === '' || url === 'https://') c().extendMarkRange('link').unsetLink().run()
    else c().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  return (
    <div className="toolbar" role="toolbar" aria-label="서식">
      <B on={s.h2} label="제목" title="큰 제목" run={() => c().toggleHeading({ level: 2 }).run()} />
      <B on={s.h3} label="소제목" title="작은 제목" run={() => c().toggleHeading({ level: 3 }).run()} />
      <span className="sep" />
      <B on={s.bold} label="B" title="굵게" run={() => c().toggleBold().run()} />
      <B on={s.italic} label="I" title="기울임" run={() => c().toggleItalic().run()} />
      <B on={s.underline} label="U" title="밑줄" run={() => c().toggleUnderline().run()} />
      <B on={s.strike} label="S" title="취소선" run={() => c().toggleStrike().run()} />
      <span className="sep" />
      <B on={s.bullet} label="• 목록" title="글머리 목록" run={() => c().toggleBulletList().run()} />
      <B on={s.ordered} label="1. 목록" title="번호 목록" run={() => c().toggleOrderedList().run()} />
      <B on={s.quote} label="인용" title="인용" run={() => c().toggleBlockquote().run()} />
      <B label="구분선" title="구분선" run={() => c().setHorizontalRule().run()} />
      <span className="sep" />
      <B on={s.left} label="왼쪽" title="왼쪽 정렬" run={() => c().setTextAlign('left').run()} />
      <B on={s.center} label="가운데" title="가운데 정렬" run={() => c().setTextAlign('center').run()} />
      <B on={s.right} label="오른쪽" title="오른쪽 정렬" run={() => c().setTextAlign('right').run()} />
      <span className="sep" />
      <B on={s.link} label="링크" title="링크 넣기" run={setLink} />
      <B label="이미지" title="이미지 넣기" run={() => fileRef.current?.click()} />
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        multiple
        hidden
        onChange={(e) => {
          onImages(e.target.files)
          e.target.value = ''
        }}
      />
      <span className="sep" />
      <B label="↶" title="실행 취소" run={() => c().undo().run()} disabled={!s.canUndo} />
      <B label="↷" title="다시 실행" run={() => c().redo().run()} disabled={!s.canRedo} />
    </div>
  )
}
