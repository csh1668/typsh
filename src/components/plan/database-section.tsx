interface SchemaTable {
  name: string;
  note?: string;
  fields: { name: string; detail: string }[];
}

const tables: SchemaTable[] = [
  {
    name: "projects",
    fields: [
      { name: "id, name, description", detail: "" },
      { name: "ownerId", detail: "→ users.id" },
      { name: "mainFile", detail: '기본: "main.typ"' },
      { name: "createdAt, updatedAt", detail: "" },
    ],
  },
  {
    name: "project_members",
    fields: [
      { name: "projectId", detail: "→ projects.id" },
      { name: "userId", detail: "→ users.id" },
      { name: "role", detail: '"owner" | "editor" | "viewer"' },
      { name: "joinedAt", detail: "" },
    ],
  },
  {
    name: "files",
    fields: [
      { name: "id, projectId", detail: "→ projects.id" },
      { name: "path", detail: '예: "main.typ", "chapters/intro.typ"' },
      { name: "blobUrl", detail: "Vercel Blob URL" },
      { name: "type", detail: '"typst" | "image" | "font" | "data" | "other"' },
      { name: "size", detail: "" },
      { name: "createdAt, updatedAt", detail: "" },
    ],
  },
];

const authTables = ["users", "accounts", "sessions", "verification_tokens"];

export function DatabaseSection() {
  return (
    <section>
      <SectionHeader title="Database Schema" />
      <div className="flex flex-col gap-4">
        {/* Auth.js tables pill row */}
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Auth.js Tables
          </p>
          <div className="flex flex-wrap gap-2">
            {authTables.map((t) => (
              <span
                key={t}
                className="rounded-md bg-muted px-3 py-1.5 font-mono text-xs text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Main tables */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {tables.map((table) => (
            <div
              key={table.name}
              className="flex flex-col rounded-lg border border-border bg-card"
            >
              <div className="border-b border-border px-4 py-3">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {table.name}
                </span>
              </div>
              <div className="flex flex-col gap-0 p-1">
                {table.fields.map((field, i) => (
                  <div
                    key={i}
                    className="flex items-baseline gap-2 rounded px-3 py-1.5 text-xs even:bg-muted/40"
                  >
                    <span className="font-mono font-medium text-foreground">
                      {field.name}
                    </span>
                    {field.detail && (
                      <span className="text-muted-foreground">
                        {field.detail}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
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
