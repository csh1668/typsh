import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProjectsPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">프로젝트</h1>
          <p className="text-muted-foreground">
            Typst 문서를 만들고 협업하세요
          </p>
        </div>
        <Button disabled>새 프로젝트 만들기</Button>
      </div>

      <Card className="flex flex-col items-center justify-center py-16">
        <CardHeader className="text-center">
          <CardTitle>프로젝트가 없습니다</CardTitle>
          <CardDescription>
            첫 번째 프로젝트를 만들어 Typst 문서 작성을 시작하세요.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
