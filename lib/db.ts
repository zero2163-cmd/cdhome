import 'server-only'
import { DatabaseSync } from 'node:sqlite'
import fs from 'node:fs'
import path from 'node:path'

// Everything the site stores lives under ./storage: the SQLite file and uploaded files.
export const STORAGE_DIR = path.join(/*turbopackIgnore: true*/ process.cwd(), 'storage')
export const UPLOAD_DIR = path.join(STORAGE_DIR, 'uploads')
const DB_PATH = path.join(STORAGE_DIR, 'cardong.db')

declare global {
  // Reuse one connection across dev hot reloads.
  var __cardongDb: DatabaseSync | undefined
}

function open(): DatabaseSync {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
  const db = new DatabaseSync(DB_PATH)
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS posts (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      category   TEXT    NOT NULL,
      title      TEXT    NOT NULL,
      content    TEXT    NOT NULL DEFAULT '',
      pinned     INTEGER NOT NULL DEFAULT 0,
      views      INTEGER NOT NULL DEFAULT 0,
      created_at TEXT    NOT NULL,
      updated_at TEXT    NOT NULL
    );
    CREATE INDEX IF NOT EXISTS posts_created ON posts(created_at DESC);

    CREATE TABLE IF NOT EXISTS files (
      id            TEXT    PRIMARY KEY,
      post_id       INTEGER REFERENCES posts(id) ON DELETE SET NULL,
      original_name TEXT    NOT NULL,
      stored_name   TEXT    NOT NULL,
      mime          TEXT    NOT NULL,
      size          INTEGER NOT NULL,
      is_attachment INTEGER NOT NULL DEFAULT 1,
      created_at    TEXT    NOT NULL
    );
    CREATE INDEX IF NOT EXISTS files_post ON files(post_id);
  `)
  seed(db)
  return db
}

// First run only: a few clearly marked example posts so the board isn't empty.
function seed(db: DatabaseSync) {
  const row = db.prepare('SELECT COUNT(*) AS n FROM posts').get() as { n: number }
  if (row.n > 0) return
  const insert = db.prepare(
    'INSERT INTO posts (category, title, content, pinned, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
  )
  const note = '<p><em>예시 게시물입니다. 관리자 페이지에서 수정하거나 삭제할 수 있습니다.</em></p>'
  const samples: [string, string, string, number, string][] = [
    ['공고', '전자공고 시행 안내', `${note}<p>당사의 공고는 회사 홈페이지에 게재합니다.</p>`, 0, '2025-01-06T01:00:00.000Z'],
    [
      '주주총회',
      '제11기 정기주주총회 소집통지',
      `${note}<p>상법 제363조 및 당사 정관에 의거하여 제11기 정기주주총회를 아래와 같이 소집하오니 참석하여 주시기 바랍니다.</p><h3>1. 일시</h3><p>2026년 3월 27일(금) 오전 10시</p><h3>2. 장소</h3><p>당사 본사 대회의실</p><h3>3. 회의 목적사항</h3><ol><li><p>제11기 재무제표 승인의 건</p></li><li><p>이사 보수한도 승인의 건</p></li></ol>`,
      0,
      '2026-03-11T01:00:00.000Z',
    ],
    ['공시', '2026년 상반기 재무제표 공시', `${note}<p>상세 내용은 첨부 파일을 확인하여 주시기 바랍니다.</p>`, 0, '2026-08-28T01:00:00.000Z'],
  ]
  for (const [category, title, content, pinned, at] of samples) insert.run(category, title, content, pinned, at, at)
}

export const db: DatabaseSync = globalThis.__cardongDb ?? (globalThis.__cardongDb = open())
