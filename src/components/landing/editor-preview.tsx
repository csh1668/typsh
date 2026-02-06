export function EditorPreview() {
  return (
    <section id="editor" className="relative px-6 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        {/* Editor mockup */}
        <div className="overflow-hidden rounded-xl border border-border bg-card/80 shadow-2xl shadow-black/20 backdrop-blur-sm">
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-foreground/10" />
              <div className="h-3 w-3 rounded-full bg-foreground/10" />
              <div className="h-3 w-3 rounded-full bg-foreground/10" />
            </div>
            <div className="ml-4 flex items-center gap-1">
              <TabButton active>main.typ</TabButton>
              <TabButton>refs.bib</TabButton>
            </div>
          </div>

          {/* Editor content - 3 pane */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr]">
            {/* File tree */}
            <div className="hidden border-r border-border p-3 md:block">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {"파일"}
              </p>
              <div className="flex flex-col gap-0.5">
                <FileItem icon="folder" name="figures/" indent={0} />
                <FileItem icon="image" name="logo.svg" indent={1} />
                <FileItem icon="file" name="main.typ" indent={0} active />
                <FileItem icon="file" name="template.typ" indent={0} />
                <FileItem icon="data" name="refs.bib" indent={0} />
              </div>
            </div>

            {/* Code editor */}
            <div className="border-r border-border p-4 font-mono text-xs leading-6">
              <CodeLine num={1} indent={0}>
                <Kw>{"#set"}</Kw>
                {" page(paper: "}
                <Str>{'"a4"'}</Str>
                {")"}
              </CodeLine>
              <CodeLine num={2} indent={0}>
                <Kw>{"#set"}</Kw>
                {" text(font: "}
                <Str>{'"Pretendard"'}</Str>
                {", size: 11pt)"}
              </CodeLine>
              <CodeLine num={3} indent={0}>
                {""}
              </CodeLine>
              <CodeLine num={4} indent={0}>
                <Kw>{"= "}</Kw>
                <span className="text-foreground font-semibold">
                  {"Typsh: Collaborative Typst Editor"}
                </span>
              </CodeLine>
              <CodeLine num={5} indent={0}>
                {""}
              </CodeLine>
              <CodeLine num={6} indent={0}>
                <Cmt>{"// 실시간 협업 지원"}</Cmt>
              </CodeLine>
              <CodeLine num={7} indent={0}>
                {"브라우저에서 "}
                <Kw>{"*Typst*"}</Kw>
                {" 문서를 작성하고,"}
              </CodeLine>
              <CodeLine num={8} indent={0}>
                {"팀원들과 "}
                <Kw>{"*실시간*"}</Kw>
                {"으로 협업하세요."}
              </CodeLine>
              <CodeLine num={9} indent={0}>
                {""}
              </CodeLine>
              <CodeLine num={10} indent={0}>
                <Kw>{"#figure("}</Kw>
              </CodeLine>
              <CodeLine num={11} indent={1}>
                {"image("}
                <Str>{'"figures/logo.svg"'}</Str>
                {"),"}
              </CodeLine>
              <CodeLine num={12} indent={0}>
                <Kw>{")"}</Kw>
              </CodeLine>
            </div>

            {/* Preview pane */}
            <div className="flex flex-col bg-foreground/[0.02] p-6">
              <div className="flex flex-col gap-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {"미리보기"}
                  </span>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-500">
                    {"컴파일 완료"}
                  </span>
                </div>
                <div className="rounded-md border border-border bg-card/60 p-5">
                  <h3 className="mb-3 text-sm font-bold text-foreground">
                    {"Typsh: Collaborative Typst Editor"}
                  </h3>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {"브라우저에서 "}
                    <span className="italic text-foreground/80">Typst</span>
                    {" 문서를 작성하고, 팀원들과 "}
                    <span className="italic text-foreground/80">
                      {"실시간"}
                    </span>
                    {"으로 협업하세요."}
                  </p>
                  <div className="mt-4 flex h-10 items-center justify-center rounded bg-muted/50">
                    <span className="text-[10px] text-muted-foreground">
                      {"[figures/logo.svg]"}
                    </span>
                  </div>
                </div>
              </div>
              {/* Collaboration cursors hint */}
              <div className="mt-auto flex items-center gap-2 pt-4">
                <div className="flex -space-x-1.5">
                  <div className="h-5 w-5 rounded-full border-2 border-card bg-emerald-500/80" />
                  <div className="h-5 w-5 rounded-full border-2 border-card bg-sky-500/80" />
                  <div className="h-5 w-5 rounded-full border-2 border-card bg-amber-500/80" />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {"3명이 편집 중"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TabButton({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <span
      className={`rounded-md px-2.5 py-1 text-xs font-mono ${
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground"
      }`}
    >
      {children}
    </span>
  );
}

function FileItem({
  icon,
  name,
  indent,
  active,
}: {
  icon: "folder" | "file" | "image" | "data";
  name: string;
  indent: number;
  active?: boolean;
}) {
  const icons: Record<string, string> = {
    folder: "~",
    file: "#",
    image: "*",
    data: "@",
  };
  return (
    <div
      className={`flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-mono ${
        active
          ? "bg-secondary text-foreground"
          : "text-muted-foreground"
      }`}
      style={{ paddingLeft: `${indent * 12 + 8}px` }}
    >
      <span className="text-muted-foreground/60">{icons[icon]}</span>
      {name}
    </div>
  );
}

function CodeLine({
  num,
  indent,
  children,
}: {
  num: number;
  indent: number;
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <span className="inline-block w-7 shrink-0 text-right text-muted-foreground/40 select-none">
        {num}
      </span>
      <span className="ml-4 text-muted-foreground" style={{ paddingLeft: `${indent * 16}px` }}>
        {children}
      </span>
    </div>
  );
}

function Kw({ children }: { children: React.ReactNode }) {
  return <span className="text-foreground/90">{children}</span>;
}

function Str({ children }: { children: React.ReactNode }) {
  return <span className="text-emerald-400/80">{children}</span>;
}

function Cmt({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground/50 italic">{children}</span>;
}
