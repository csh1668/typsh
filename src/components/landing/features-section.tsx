export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {"기능"}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl text-balance font-sans">
            {"문서 작성에 필요한 모든 것"}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<CollaborationIcon />}
            title="실시간 협업"
            description="여러 사용자가 동시에 같은 문서를 편집하고, 실시간 커서와 선택 영역을 공유합니다."
          />
          <FeatureCard
            icon={<WasmIcon />}
            title="브라우저 내 컴파일"
            description="WASM 기반 Typst 컴파일러가 브라우저에서 직접 실행되어 서버 없이 즉시 프리뷰를 제공합니다."
          />
          <FeatureCard
            icon={<EditorIcon />}
            title="전문 코드 에디터"
            description="CodeMirror 6 기반 에디터로 구문 강조, 자동 완성, 파일 트리를 제공합니다."
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <FeatureCard
            icon={<ShareIcon />}
            title="프로젝트 공유 & 권한"
            description="팀원을 초대하고 owner, editor, viewer 3단계 권한으로 프로젝트 접근을 관리하세요."
          />
          <FeatureCard
            icon={<ExportIcon />}
            title="PDF 내보내기"
            description="작성한 문서를 한 번의 클릭으로 고품질 PDF로 다운로드하세요."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-colors hover:bg-card/80">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-foreground">
        {icon}
      </div>
      <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function CollaborationIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function WasmIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9h6v6H9z" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </svg>
  );
}

function EditorIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function ExportIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}
