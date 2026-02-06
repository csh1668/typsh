const browserNodes = [
  {
    label: "CodeMirror 6",
    description: "에디터",
    children: ["y-codemirror.next (Yjs ↔ CodeMirror 바인딩)"],
  },
  {
    label: "Liveblocks Client",
    description: "실시간 동기화",
    children: ["@liveblocks/yjs (Yjs Provider)"],
  },
  {
    label: "Typst WASM Compiler",
    description: "브라우저 내 컴파일",
    children: ["Shadow Filesystem (가상 파일시스템)", "SVG/PDF 출력"],
  },
  {
    label: "Next.js App Router",
    description: "라우팅, SSR",
    children: [],
  },
];

const serverNodes = [
  { label: "next-auth", description: "인증" },
  { label: "Drizzle ORM → Neon Postgres", description: "메타데이터" },
  { label: "Vercel Blob", description: "파일 저장" },
  { label: "Liveblocks Auth Endpoint", description: "협업 권한" },
];

export function ArchitectureSection() {
  return (
    <section>
      <SectionHeader title="Architecture Overview" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Browser Side */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/10">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Browser</h3>
          </div>
          <div className="flex flex-col gap-3">
            {browserNodes.map((node) => (
              <div
                key={node.label}
                className="rounded-md border border-border/60 bg-muted/50 p-3"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {node.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {node.description}
                  </span>
                </div>
                {node.children.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1 border-l-2 border-border pl-3">
                    {node.children.map((child) => (
                      <span
                        key={child}
                        className="font-mono text-[11px] text-muted-foreground"
                      >
                        {child}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Server Side */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-500/10">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              Server (Vercel Serverless)
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            {serverNodes.map((node) => (
              <div
                key={node.label}
                className="rounded-md border border-border/60 bg-muted/50 p-3"
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {node.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {node.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
