export function TechSection() {
  const techItems = [
    { label: "Framework", value: "Next.js 16" },
    { label: "Editor", value: "CodeMirror 6" },
    { label: "Collaboration", value: "Liveblocks + Yjs" },
    { label: "Compiler", value: "Typst WASM" },
    { label: "Database", value: "Neon Postgres" },
    { label: "Storage", value: "Vercel Blob" },
    { label: "Auth", value: "Auth.js v5" },
    { label: "Styling", value: "Tailwind + shadcn" },
  ];

  return (
    <section id="tech" className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {"기술 스택"}
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl text-balance font-sans">
            {"모던 웹 기술로 구축"}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {techItems.map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-1 rounded-lg border border-border bg-card/40 p-4 backdrop-blur-sm"
            >
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {item.label}
              </span>
              <span className="text-sm font-semibold text-foreground font-mono">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
