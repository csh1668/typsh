interface Phase {
  number: number;
  title: string;
  items: string[];
  result: string;
}

const phases: Phase[] = [
  {
    number: 1,
    title: "프로젝트 기초 설정",
    items: [
      "Next.js 16 프로젝트 생성 (App Router, TypeScript, Tailwind)",
      "Drizzle ORM + Neon Postgres 연결 및 스키마 정의",
      "Auth.js v5 설정 (Google + GitHub OAuth)",
      "shadcn/ui 초기화 및 기본 레이아웃",
    ],
    result: "OAuth 로그인 후 빈 대시보드 표시",
  },
  {
    number: 2,
    title: "프로젝트/파일 관리",
    items: [
      "Project CRUD API (생성/조회/수정/삭제)",
      "File 관리 API + Vercel Blob 연동",
      "대시보드 UI (프로젝트 목록, 생성 다이얼로그)",
      "파일 트리 UI 컴포넌트",
    ],
    result: "프로젝트 생성, 파일 추가/삭제/이름변경, 이미지 업로드",
  },
  {
    number: 3,
    title: "CodeMirror 에디터",
    items: [
      "CodeMirror 6 래퍼 컴포넌트",
      "codemirror-lang-typst로 Typst 구문 강조",
      "3-pane 에디터 레이아웃 (파일트리 | 에디터 | 프리뷰)",
      "파일 콘텐츠 로드/저장 (Blob 직접 연동)",
    ],
    result: "구문 강조된 Typst 편집, 자동저장",
  },
  {
    number: 4,
    title: "Typst WASM 컴파일 + 라이브 프리뷰",
    items: [
      "@myriaddreamin/typst.ts WASM 컴파일러 초기화",
      "Shadow Filesystem으로 멀티 파일 지원",
      "디바운스 컴파일 (400ms) + SVG 프리뷰",
      "컴파일 에러 표시 / PDF 다운로드",
    ],
    result: "실시간 프리뷰, PDF 내보내기",
  },
  {
    number: 5,
    title: "실시간 협업",
    items: [
      "Liveblocks 설정 + 인증 엔드포인트",
      "파일별 Y.Text + yCollab로 동시 편집",
      "협업 커서 및 접속자 표시",
      "Y.Doc ↔ Vercel Blob 동기화 (시딩 + 주기적 저장)",
    ],
    result: "다수 사용자 동시 편집, 실시간 커서",
  },
  {
    number: 6,
    title: "프로젝트 공유 및 권한",
    items: [
      "멤버 초대 API (이메일로 검색, 역할 지정)",
      "공유 다이얼로그 UI",
      "3단계 권한 (owner/editor/viewer) 적용",
    ],
    result: "프로젝트 공유, 뷰어 읽기 전용 모드",
  },
  {
    number: 7,
    title: "마무리 및 배포",
    items: [
      "에러 바운더리, 로딩 상태",
      "키보드 단축키 / 반응형 디자인",
      "WASM/폰트 캐싱 최적화",
      "Vercel 배포 설정 / 보안 강화",
    ],
    result: "프로덕션 배포 완료",
  },
];

export function PhasesSection() {
  return (
    <section>
      <SectionHeader title="Implementation Phases" />
      <div className="relative flex flex-col gap-0">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-0 hidden h-full w-px bg-border sm:block" />

        {phases.map((phase) => (
          <div key={phase.number} className="group relative flex gap-4 pb-8 last:pb-0">
            {/* Timeline dot */}
            <div className="relative z-10 hidden shrink-0 sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card font-mono text-sm font-bold text-foreground transition-colors group-hover:border-foreground/30 group-hover:bg-accent">
                {phase.number}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 rounded-lg border border-border bg-card p-5 transition-colors group-hover:border-foreground/10">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted font-mono text-xs font-bold text-muted-foreground sm:hidden">
                  {phase.number}
                </span>
                <h3 className="text-sm font-semibold text-foreground">
                  Phase {phase.number}: {phase.title}
                </h3>
              </div>
              <ul className="mb-3 flex flex-col gap-1.5">
                {phase.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="rounded-md bg-muted/60 px-3 py-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {"결과물: "}
                </span>
                <span className="text-xs text-foreground">{phase.result}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
