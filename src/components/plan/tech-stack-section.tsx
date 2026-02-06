const techStack = [
  { area: "Framework", tech: "Next.js 16 (App Router)" },
  { area: "Editor", tech: "CodeMirror 6 + codemirror-lang-typst" },
  {
    area: "Collaboration",
    tech: "Liveblocks + @liveblocks/yjs + Yjs",
  },
  { area: "Typst Compilation", tech: "@myriaddreamin/typst.ts (WASM)" },
  { area: "Auth", tech: "next-auth (Google + GitHub OAuth)" },
  { area: "Database", tech: "Neon Postgres (Vercel Marketplace)" },
  { area: "ORM", tech: "Drizzle ORM" },
  { area: "File Storage", tech: "Vercel Blob" },
  { area: "Styling", tech: "Tailwind CSS v4 + shadcn/ui" },
  { area: "Deployment", tech: "Vercel Serverless" },
] as const;

export function TechStackSection() {
  return (
    <section>
      <SectionHeader title="Tech Stack" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {techStack.map((item) => (
          <div
            key={item.area}
            className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-xs font-semibold text-muted-foreground">
              {item.area.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">
                {item.area}
              </span>
              <span className="truncate font-mono text-xs text-muted-foreground">
                {item.tech}
              </span>
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
