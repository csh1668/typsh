import { notFound } from "next/navigation";
import { getFiles } from "@/actions/files";
import { getProjectById } from "@/actions/projects";
import { EditorLayout } from "@/components/editor/editor-layout";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;

  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  const files = await getFiles(projectId);

  return (
    <EditorLayout
      projectId={projectId}
      projectName={project.name}
      mainFile={project.mainFile}
      files={files}
    />
  );
}
