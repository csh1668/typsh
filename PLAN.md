# Typsh - Collaborative Typst Document Editor

> Overleaf의 Typst 버전. 브라우저에서 Typst 문서를 작성하고 실시간으로 협업할 수 있는 웹 서비스.

## Tech Stack

| 영역 | 기술 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Editor | CodeMirror 6 + `codemirror-lang-typst` |
| Collaboration | Liveblocks + `@liveblocks/yjs` + Yjs + `y-codemirror.next` |
| Typst Compilation | `@myriaddreamin/typst.ts` (Browser WASM) |
| Auth | next-auth (Google + GitHub OAuth) |
| Database | Neon Postgres (Vercel Marketplace) |
| ORM | Drizzle ORM |
| File Storage | Vercel Blob |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Deployment | Vercel Serverless |

## Architecture Overview

```
Browser
├── CodeMirror 6 (에디터)
│   └── y-codemirror.next (Yjs ↔ CodeMirror 바인딩)
├── Liveblocks Client (실시간 동기화)
│   └── @liveblocks/yjs (Yjs Provider)
├── Typst WASM Compiler (브라우저 내 컴파일)
│   ├── Shadow Filesystem (가상 파일시스템)
│   └── SVG/PDF 출력
└── Next.js App Router (라우팅, SSR)

Server (Vercel Serverless)
├── next-js (인증)
├── Drizzle ORM → Neon Postgres (메타데이터)
├── Vercel Blob (파일 저장)
└── Liveblocks Auth Endpoint (협업 권한)
```

## Database Schema

```
users (Auth.js)          accounts (Auth.js)
sessions (Auth.js)       verification_tokens (Auth.js)

projects
├── id, name, description
├── ownerId → users.id
├── mainFile (기본: "main.typ")
└── createdAt, updatedAt

project_members
├── projectId → projects.id
├── userId → users.id
├── role: "owner" | "editor" | "viewer"
└── joinedAt

files
├── id, projectId → projects.id
├── path (예: "main.typ", "chapters/intro.typ")
├── blobUrl (Vercel Blob URL)
├── type: "typst" | "image" | "font" | "data" | "other"
├── size
└── createdAt, updatedAt
```

## Liveblocks Room Structure

```
Room: "project:{projectId}" (프로젝트당 1개 룸)
├── Y.Doc
│   ├── Y.Map("files")          # 파일 메타데이터 동기화
│   ├── Y.Text("file:{fileId}") # 파일별 협업 텍스트 (파일 ID로 키잉)
│   └── Y.Map("meta")           # 시딩 상태 등
├── Presence (사용자별)
│   ├── activeFile: string | null
│   └── cursor: { line, col } | null
└── Awareness (커서 위치/색상)
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/page.tsx          # 로그인 페이지
│   ├── (dashboard)/projects/page.tsx  # 프로젝트 목록
│   ├── (editor)/project/[projectId]/page.tsx  # 에디터
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── liveblocks-auth/route.ts
│       ├── projects/...
│       └── upload/route.ts
├── auth.ts                    # Auth.js 설정
├── db/
│   ├── index.ts               # Drizzle 클라이언트
│   └── schema.ts              # 전체 스키마
├── lib/
│   ├── auth-helpers.ts
│   ├── blob.ts
│   └── permissions.ts
├── hooks/
│   ├── use-typst-compiler.ts  # WASM 컴파일러 관리
│   └── use-debounced-compile.ts
└── components/
    ├── editor/
    │   ├── editor-layout.tsx          # 3-pane 레이아웃
    │   ├── code-editor/
    │   │   └── collaborative-editor.tsx  # CM6 + Yjs + Liveblocks
    │   ├── file-tree/
    │   │   └── file-tree.tsx
    │   ├── preview/
    │   │   └── typst-preview.tsx      # SVG/Canvas 프리뷰
    │   ├── collaboration/
    │   │   ├── room-provider.tsx
    │   │   └── active-users.tsx
    │   └── share/
    │       └── share-dialog.tsx
    ├── dashboard/
    └── ui/ (shadcn/ui)
```

환경 변수 관리: lib/env/에 publicEnv.ts와 serverEnv.ts를 만들고 serverEnv.ts에는 server-only 라이브러리를 사용하여 서버 사이드에서만 사용되는 것을 보장. zod를 이용한 안정성 보장


## Implementation Phases

### Phase 1: 프로젝트 기초 설정
- Next.js 16 프로젝트 생성 (App Router, TypeScript, Tailwind)
- Drizzle ORM + Neon Postgres 연결 및 스키마 정의
- Auth.js v5 설정 (Google + GitHub OAuth)
- shadcn/ui 초기화 및 기본 레이아웃
- **결과물**: OAuth 로그인 후 빈 대시보드 표시

### Phase 2: 프로젝트/파일 관리
- Project CRUD API (생성/조회/수정/삭제)
- File 관리 API + Vercel Blob 연동
- 대시보드 UI (프로젝트 목록, 생성 다이얼로그)
- 파일 트리 UI 컴포넌트
- **결과물**: 프로젝트 생성, 파일 업로드/추가/삭제/이름변경

### Phase 3: CodeMirror 에디터
- CodeMirror 6 래퍼 컴포넌트
- `codemirror-lang-typst`로 Typst 구문 강조
- 3-pane 에디터 레이아웃 (파일트리 | 에디터 | 프리뷰)
- 파일 콘텐츠 로드/저장 (Blob 직접 연동)
- **결과물**: 구문 강조된 Typst 편집, 자동저장

### Phase 4: Typst WASM 컴파일 + 라이브 프리뷰
- `@myriaddreamin/typst.ts` WASM 컴파일러 초기화
- Shadow Filesystem으로 멀티 파일 지원
- 디바운스 컴파일 (400ms) + SVG 프리뷰
- 컴파일 에러 표시
- PDF 다운로드
- **결과물**: 실시간 프리뷰, PDF 내보내기

### Phase 5: 실시간 협업
- Liveblocks 설정 + 인증 엔드포인트
- 파일별 Y.Text + yCollab로 동시 편집
- 협업 커서 및 접속자 표시
- Y.Doc ↔ Vercel Blob 동기화 (시딩 + 주기적 저장)
- **결과물**: 다수 사용자 동시 편집, 실시간 커서

### Phase 6: 프로젝트 공유 및 권한
- 멤버 초대 API (이메일로 검색, 역할 지정)
- 공유 다이얼로그 UI
- 3단계 권한 (owner/editor/viewer) 적용
- **결과물**: 프로젝트 공유, 뷰어 읽기 전용 모드

### Phase 7: 마무리 및 배포
- 에러 바운더리, 로딩 상태
- 키보드 단축키
- 반응형 디자인
- WASM/폰트 캐싱 최적화
- Vercel 배포 설정
- 보안 강화 (Blob URL 난독화, Rate Limiting)

### Phase 8: 추가 기능 개발
- AI 어시스턴트 (Claude/Gemini/ChatGPT API Key를 프로젝트에 owner가 직접 설정 후 사용): 파일 생성/수정/삭제 가능

## Key Risks & Mitigations

| 리스크 | 심각도 | 대응 |
|--------|--------|------|
| `codemirror-lang-typst` 불안정 (v0.4.0, 실험적) | 높음 | Fallback: StreamLanguage 기반 간단한 토크나이저 |
| Typst WASM 7.62MB 초기 로딩 | 중간 | CDN + Service Worker 캐싱 + 프로그레스바 |
| COEP/COOP 헤더가 OAuth 방해 | 높음 | 에디터 라우트에만 헤더 적용 |
| Vercel Blob URL 공개 접근 | 중간 | 랜덤 접미사 사용, DB를 통해서만 URL 노출 |
| Neon 콜드 스타트 500ms-2s | 낮음 | 로딩 인디케이터 표시 |
| Y.Doc 시딩 레이스 컨디션 | 중간 | Y.Map 플래그로 시딩 조정 |
| Liveblocks 무료: 월 500 active rooms | 낮음 | 출시 후 필요시 업그레이드 |

## External Services Required

1. **Vercel** - 호스팅 + Blob Storage + Marketplace
2. **Neon** - Postgres (Vercel Marketplace 통해 연결)
3. **Liveblocks** - 실시간 협업 인프라 (무료: 500 rooms/월)
4. **Google Cloud Console** - OAuth 클라이언트 ID
5. **GitHub** - OAuth App 등록

## 개발 유의사항

- pnpm 사용
- 파일이 300줄 이상이면 분리 검토
- 함수가 50줄 이상이면 분리 검토
- 중복 코드는 공통 함수/컴포넌트로 추출
- 불필요한 리렌더링, 중복 API 호출 최적화
- Race condition 방지 (비동기 처리 시 상태 동기화 주의)
- Server Action은 app/ 안이 아니라 actions/ 로의 분리를 검토한다.
- 코드 작성/수정 후 반드시 pnpm format && pnpm lint로 검증
- 개발 중 애매한 점이 있다면 반드시 질의 후 개발