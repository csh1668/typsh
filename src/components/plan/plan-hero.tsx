export function PlanHero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-card">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-accent)_0%,transparent_60%)] opacity-40" />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Project Plan
        </div>
        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Typsh
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Collaborative Typst Document Editor
        </p>
        <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground/80">
          {
            "Overleaf의 Typst 버전. 브라우저에서 Typst 문서를 작성하고 실시간으로 협업할 수 있는 웹 서비스."
          }
        </p>
      </div>
    </section>
  );
}
