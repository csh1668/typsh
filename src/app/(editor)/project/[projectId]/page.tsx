import { notFound } from "next/navigation";
import { getFiles } from "@/actions/files";
import { getProjectById } from "@/actions/projects";
import { FileTree } from "@/components/editor/file-tree/file-tree";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;

  // Verify project exists and user has access
  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  const files = await getFiles(projectId);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-64 h-full shrink-0">
        <FileTree projectId={projectId} files={files} />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center bg-background p-8">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground">
            {project.description || "설명이 없습니다."}
          </p>
          <div className="p-4 rounded-lg border border-dashed border-border bg-muted/30">
            <p className="text-sm">
              왼쪽 파일 트리에서 파일을 관리할 수 있습니다. 에디터와 프리뷰
              기능은 다음 단계에서 구현될 예정입니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
