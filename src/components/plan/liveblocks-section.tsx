export function LiveblocksSection() {
  return (
    <section>
      <SectionHeader title="Liveblocks Room Structure" />
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-4">
          <span className="font-mono text-sm text-foreground">
            {'Room: "project:{projectId}"'}
          </span>
          <span className="ml-2 text-xs text-muted-foreground">
            {"(프로젝트당 1개 룸)"}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <RoomBlock
            title="Y.Doc"
            items={[
              { key: 'Y.Map("files")', desc: "파일 메타데이터 동기화" },
              { key: 'Y.Text("file:{fileId}")', desc: "파일별 협업 텍스트" },
              { key: 'Y.Map("meta")', desc: "시딩 상태 등" },
            ]}
          />
          <RoomBlock
            title="Presence"
            items={[
              { key: "activeFile", desc: "string | null" },
              { key: "cursor", desc: "{ line, col } | null" },
            ]}
          />
          <RoomBlock
            title="Awareness"
            items={[{ key: "cursor", desc: "위치/색상" }]}
          />
        </div>
      </div>
    </section>
  );
}

function RoomBlock({
  title,
  items,
}: {
  title: string;
  items: { key: string; desc: string }[];
}) {
  return (
    <div className="rounded-md border border-border/60 bg-muted/50 p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <div key={item.key} className="flex flex-col">
            <span className="font-mono text-[11px] font-medium text-foreground">
              {item.key}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {item.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
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
