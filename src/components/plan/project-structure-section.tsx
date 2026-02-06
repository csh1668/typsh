interface TreeNode {
  name: string;
  type: "dir" | "file";
  comment?: string;
  children?: TreeNode[];
}

const tree: TreeNode[] = [
  {
    name: "src/",
    type: "dir",
    children: [
      {
        name: "app/",
        type: "dir",
        children: [
          { name: "(auth)/login/page.tsx", type: "file", comment: "로그인 페이지" },
          { name: "(dashboard)/projects/page.tsx", type: "file", comment: "프로젝트 목록" },
          { name: "(editor)/project/[projectId]/page.tsx", type: "file", comment: "에디터" },
          {
            name: "api/",
            type: "dir",
            children: [
              { name: "auth/[...nextauth]/route.ts", type: "file" },
              { name: "liveblocks-auth/route.ts", type: "file" },
              { name: "projects/...", type: "file" },
              { name: "upload/route.ts", type: "file" },
            ],
          },
        ],
      },
      { name: "auth.ts", type: "file", comment: "Auth.js 설정" },
      {
        name: "db/",
        type: "dir",
        children: [
          { name: "index.ts", type: "file", comment: "Drizzle 클라이언트" },
          { name: "schema.ts", type: "file", comment: "전체 스키마" },
        ],
      },
      {
        name: "lib/",
        type: "dir",
        children: [
          { name: "auth-helpers.ts", type: "file" },
          { name: "blob.ts", type: "file" },
          { name: "permissions.ts", type: "file" },
        ],
      },
      {
        name: "hooks/",
        type: "dir",
        children: [
          { name: "use-typst-compiler.ts", type: "file", comment: "WASM 컴파일러 관리" },
          { name: "use-debounced-compile.ts", type: "file" },
        ],
      },
      {
        name: "components/",
        type: "dir",
        children: [
          {
            name: "editor/",
            type: "dir",
            children: [
              { name: "editor-layout.tsx", type: "file", comment: "3-pane 레이아웃" },
              { name: "code-editor/collaborative-editor.tsx", type: "file", comment: "CM6 + Yjs" },
              { name: "file-tree/file-tree.tsx", type: "file" },
              { name: "preview/typst-preview.tsx", type: "file", comment: "SVG/Canvas 프리뷰" },
              { name: "collaboration/room-provider.tsx", type: "file" },
              { name: "collaboration/active-users.tsx", type: "file" },
              { name: "share/share-dialog.tsx", type: "file" },
            ],
          },
          { name: "dashboard/", type: "dir" },
          { name: "ui/ (shadcn/ui)", type: "dir" },
        ],
      },
    ],
  },
];

function TreeNodeRow({
  node,
  depth,
}: {
  node: TreeNode;
  depth: number;
}) {
  return (
    <>
      <div
        className="flex items-center gap-1.5 py-0.5"
        style={{ paddingLeft: `${depth * 16}px` }}
      >
        {node.type === "dir" ? (
          <svg
            className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        ) : (
          <svg
            className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}
        <span
          className={`font-mono text-xs ${node.type === "dir" ? "font-semibold text-foreground" : "text-muted-foreground"}`}
        >
          {node.name}
        </span>
        {node.comment && (
          <span className="text-[10px] text-muted-foreground/50">
            {"// "}
            {node.comment}
          </span>
        )}
      </div>
      {node.children?.map((child) => (
        <TreeNodeRow key={child.name} node={child} depth={depth + 1} />
      ))}
    </>
  );
}

export function ProjectStructureSection() {
  return (
    <section>
      <SectionHeader title="Project Structure" />
      <div className="overflow-x-auto rounded-lg border border-border bg-card p-4">
        <div className="flex flex-col">
          {tree.map((node) => (
            <TreeNodeRow key={node.name} node={node} depth={0} />
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {
          "환경 변수 관리: lib/env/에 publicEnv.ts와 serverEnv.ts를 만들고 serverEnv.ts에는 server-only 라이브러리를 사용하여 서버 사이드에서만 사용되는 것을 보장. zod를 이용한 안정성 보장"
        }
      </p>
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
