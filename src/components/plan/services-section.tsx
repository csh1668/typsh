const services = [
  { name: "Vercel", desc: "호스팅 + Blob Storage + Marketplace" },
  { name: "Neon", desc: "Postgres (Vercel Marketplace 통해 연결)" },
  {
    name: "Liveblocks",
    desc: "실시간 협업 인프라 (무료: 500 rooms/월)",
  },
  { name: "Google Cloud Console", desc: "OAuth 클라이언트 ID" },
  { name: "GitHub", desc: "OAuth App 등록" },
] as const;

const devNotes = [
  "pnpm 사용",
  "파일이 300줄 이상이면 분리 검토",
  "함수가 50줄 이상이면 분리 검토",
  "중복 코드는 공통 함수/컴포넌트로 추출",
  "불필요한 리렌더링, 중복 API 호출 최적화",
  "Race condition 방지 (비동기 처리 시 상태 동기화 주의)",
  "Server Action은 app/ 안이 아니라 actions/로의 분리를 검토",
  "코드 작성/수정 후 반드시 pnpm format && pnpm lint로 검증",
  "개발 중 애매한 점이 있다면 반드시 질의 후 개발",
];

export function ServicesSection() {
  return (
    <section>
      <SectionHeader title="External Services & Dev Notes" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Services */}
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Required Services
          </p>
          <div className="flex flex-col gap-2">
            {services.map((s, i) => (
              <div key={s.name} className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted font-mono text-[10px] font-bold text-muted-foreground">
                  {i + 1}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {s.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {s.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dev Notes */}
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {"개발 유의사항"}
          </p>
          <ul className="flex flex-col gap-1.5">
            {devNotes.map((note, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                {note}
              </li>
            ))}
          </ul>
        </div>
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
