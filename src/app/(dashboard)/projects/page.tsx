import { FileText, Plus, Share2, Zap } from "lucide-react";
import { getProjects } from "@/actions/projects";
import { CreateProjectDialog } from "@/components/dashboard/create-project-dialog";
import { ProjectCard } from "@/components/dashboard/project-card";
import { Button } from "@/components/ui/button";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            프로젝트
          </h1>
          <p className="text-sm text-muted-foreground">
            Typst 문서를 만들고 실시간으로 협업하세요.
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {/* Project Grid / Empty State */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/30 py-24">
          <div className="flex flex-col items-center gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/50">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <h2 className="text-sm font-medium text-foreground">
                아직 프로젝트가 없습니다
              </h2>
              <p className="max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
                첫 번째 프로젝트를 만들어 Typst 문서 작성을 시작하세요.
              </p>
            </div>
            <CreateProjectDialog>
              <Button size="sm" variant="outline" className="gap-2 mt-2">
                <Plus className="h-4 w-4" />
                프로젝트 만들기
              </Button>
            </CreateProjectDialog>
          </div>
        </div>
      )}

      {/* Info cards row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <InfoCard
          icon={<Share2 className="h-4 w-4" />}
          title="실시간 협업"
          description="팀원과 동시에 같은 문서를 편집하세요. 커서 위치와 변경 사항이 즉시 동기화됩니다."
        />
        <InfoCard
          icon={<Zap className="h-4 w-4" />}
          title="브라우저 컴파일"
          description="별도 설치 없이 브라우저에서 Typst를 컴파일하고 실시간 프리뷰를 확인하세요."
        />
        <InfoCard
          icon={<FileText className="h-4 w-4" />}
          title="프로젝트 공유"
          description="링크 하나로 팀원을 초대하고 편집자, 뷰어 권한을 유연하게 관리하세요."
        />
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card/40 p-5">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
