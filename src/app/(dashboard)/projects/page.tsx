import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            프로젝트
          </h1>
          <p className="text-sm text-muted-foreground">
            Typst 문서를 만들고 실시간으로 협업하세요.
          </p>
        </div>
        <Button disabled size="sm" className="gap-2">
          <PlusIcon />
          새 프로젝트
        </Button>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/30 py-24">
        <div className="flex flex-col items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/50">
            <DocumentIcon />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <h2 className="text-sm font-medium text-foreground">
              아직 프로젝트가 없습니다
            </h2>
            <p className="max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
              첫 번째 프로젝트를 만들어 Typst 문서 작성을 시작하세요.
            </p>
          </div>
          <Button disabled size="sm" variant="outline" className="gap-2 mt-2">
            <PlusIcon />
            프로젝트 만들기
          </Button>
        </div>
      </div>

      {/* Info cards row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <InfoCard
          title="실시간 협업"
          description="팀원과 동시에 같은 문서를 편집하세요. 커서 위치와 변경 사항이 즉시 동기화됩니다."
        />
        <InfoCard
          title="브라우저 컴파일"
          description="별도 설치 없이 브라우저에서 Typst를 컴파일하고 실시간 프리뷰를 확인하세요."
        />
        <InfoCard
          title="프로젝트 공유"
          description="링크 하나로 팀원을 초대하고 편집자, 뷰어 권한을 유연하게 관리하세요."
        />
      </div>
    </div>
  );
}

function InfoCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card/40 p-5">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M7 1v12M1 7h12" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-foreground"
      aria-hidden="true"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}
