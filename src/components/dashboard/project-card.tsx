"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";

import { deleteProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string | null;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    role: "owner" | "editor" | "viewer" | null;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const handleDelete = async () => {
    if (confirm("정말로 이 프로젝트를 삭제하시겠습니까?")) {
      try {
        await deleteProject(project.id);
      } catch (error) {
        alert(error instanceof Error ? error.message : "삭제에 실패했습니다.");
      }
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all hover:border-primary/50 hover:bg-muted/30">
      <Link href={`/project/${project.id}`} className="absolute inset-0 z-0">
        <span className="sr-only">프로젝트 열기</span>
      </Link>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
              {project.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-xs">
              {project.description || "설명이 없습니다."}
            </CardDescription>
          </div>
          <div className="z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link
                    href={`/project/${project.id}`}
                    className="flex w-full items-center"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    열기
                  </Link>
                </DropdownMenuItem>
                {project.role === "owner" && (
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    삭제
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="flex items-center justify-between pt-0 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="capitalize">{project.role}</span>
          <span>•</span>
          <span>
            {formatDistanceToNow(project.updatedAt, {
              addSuffix: true,
              locale: ko,
            })}{" "}
            수정됨
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
