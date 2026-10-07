# 카동 CARDONG 홈페이지

모회사 카동의 회사 홈페이지와 IR · 공시 게시판입니다. 디자인은 시안 B(https://claude.ai/artifact/RVUmo51sQcSbwTU7RJVeDX)를 옮겼습니다.

- Next.js 16 (App Router, Cache Components)
- SQLite: Node.js 내장 `node:sqlite` 사용. 별도 DB 서버나 설치가 필요 없습니다.
- 에디터: TipTap
- 파일: 서버 디스크(`storage/uploads`)에 저장

## 처음 실행하기

Node.js 24 이상이 필요합니다(`node -v`로 확인).

```bash
npm install
cp .env.example .env.local   # 이미 .env.local이 있으면 건너뜁니다
# .env.local을 열어 ADMIN_PASSWORD와 SESSION_SECRET을 채웁니다
npm run dev                  # http://localhost:3000
```

`SESSION_SECRET`은 아래 명령으로 만든 값을 넣으면 됩니다.

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

처음 실행하면 `storage/cardong.db`가 자동으로 만들어지고 예시 게시글 3개가 들어갑니다. 예시 글은 관리자 화면에서 지우면 됩니다.

운영 서버에서는 `npm run build` 후 `npm run start`로 실행합니다.

## 화면

| 주소 | 내용 |
|---|---|
| `/` | 회사 홈. IR 영역에 최신 게시글 5개와 최근 주주총회 공고가 자동으로 표시됩니다. |
| `/ir` | IR · 공시 게시판. 분류(주주총회·공시·공고), 제목 검색, 페이지 이동 |
| `/ir/[번호]` | 게시글 상세. 첨부파일 내려받기, 이전 글/다음 글 |
| `/admin` | 관리자: 게시글 목록, 수정, 삭제 (로그인 필요) |
| `/admin/posts/new` | 새 글 쓰기 |

## 글쓰기 기능

- 에디터 서식: 제목, 소제목, 굵게, 기울임, 밑줄, 취소선, 글머리·번호 목록, 인용, 구분선, 정렬, 링크, 실행 취소
- 본문 이미지: 툴바의 ‘이미지’ 버튼, 붙여넣기, 끌어다 놓기 (png, jpg, gif, webp)
- 첨부파일: 끌어다 놓거나 선택. 파일당 20MB, 허용 형식은 `lib/uploads.ts`에서 바꿉니다.
- ‘공지로 고정’을 체크하면 목록 맨 위에 표시됩니다.

## 보안

- 관리자 로그인은 비밀번호 하나(`ADMIN_PASSWORD`)를 IR 담당자가 함께 쓰는 방식입니다. 담당자별 계정이 필요해지면 로그인 방식을 바꿔야 합니다.
- 로그인 세션은 서명된 쿠키로 8시간 유지됩니다.
- 글 저장 시 본문 HTML에서 스크립트, 이벤트 속성, 외부 이미지 등을 제거합니다(`lib/sanitize.ts`).
- 업로드는 로그인한 관리자만 가능하며, 형식과 크기를 서버에서 다시 검사합니다.

## 데이터와 백업

모든 데이터는 `storage/` 폴더 하나에 있습니다.

```
storage/
  cardong.db        게시글, 첨부파일 정보
  uploads/          업로드한 파일 원본
```

백업은 이 폴더를 통째로 복사하면 됩니다. `storage/`는 git에 올라가지 않습니다.

## 배포할 때 주의할 점

SQLite와 업로드 파일을 서버 디스크에 저장하므로, **디스크가 유지되는 서버**에 배포해야 합니다.

- 가능: 일반 VPS/클라우드 서버(AWS Lightsail·EC2, 네이버 클라우드, 카페24 서버호스팅 등), Docker + 볼륨, Railway·Fly.io 등 영구 볼륨을 붙일 수 있는 서비스
- 그대로는 불가: Vercel, Netlify 같은 서버리스 호스팅. 요청마다 디스크가 초기화되어 글과 파일이 사라집니다. 이 경우 DB와 파일 저장소를 외부 서비스로 바꿔야 합니다.

서버 한 대에서 실행하는 것을 전제로 합니다. 여러 대로 늘리면 각 서버가 서로 다른 `storage/`를 갖게 됩니다.
