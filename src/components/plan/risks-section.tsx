import { cn } from "@/lib/utils";

interface Risk {
  risk: string;
  severity: "높음" | "중간" | "낮음";
  mitigation: string;
}

const risks: Risk[] = [
  {
    risk: "codemirror-lang-typst 불안정 (v0.4.0, 실험적)",
    severity: "높음",
    mitigation: "Fallback: StreamLanguage 기반 간단한 토크나이저",
  },
  {
    risk: "Typst WASM 7.62MB 초기 로딩",
    severity: "중간",
    mitigation: "CDN + Service Worker 캐싱 + 프로그레스바",
  },
  {
    risk: "COEP/COOP 헤더가 OAuth 방해",
    severity: "높음",
    mitigation: "에디터 라우트에만 헤더 적용",
  },
  {
    risk: "Vercel Blob URL 공개 접근",
    severity: "중간",
    mitigation: "랜덤 접미사 사용, DB를 통해서만 URL 노출",
  },
  {
    risk: "Neon 콜드 스타트 500ms-2s",
    severity: "낮음",
    mitigation: "로딩 인디케이터 표시",
  },
  {
    risk: "Y.Doc 시딩 레이스 컨디션",
    severity: "중간",
    mitigation: "Y.Map 플래그로 시딩 조정",
  },
  {
    risk: "Liveblocks 무료: 월 500 active rooms",
    severity: "낮음",
    mitigation: "출시 후 필요시 업그레이드",
  },
];

const severityConfig = {
  높음: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    dot: "bg-red-500",
  },
  중간: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    dot: "bg-amber-500",
  },
  낮음: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    dot: "bg-emerald-500",
  },
} as const;

export function RisksSection() {
  return (
    <section>
      <SectionHeader title="Key Risks & Mitigations" />
      <div className="flex flex-col gap-2">
        {risks.map((risk, i) => {
          const config = severityConfig[risk.severity];
          return (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-start sm:gap-4"
            >
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
                    config.bg,
                    config.text
                  )}
                >
                  <span
                    className={cn("h-1.5 w-1.5 rounded-full", config.dot)}
                  />
                  {risk.severity}
                </span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-sm text-foreground">{risk.risk}</span>
                <span className="text-xs text-muted-foreground">
                  {"대응: "}
                  {risk.mitigation}
                </span>
              </div>
            </div>
          );
        })}
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
