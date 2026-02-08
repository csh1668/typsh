"use client";

import {
  ChevronDown,
  ChevronRight,
  Database,
  Edit2,
  File,
  FilePlus,
  FileText,
  Folder,
  FolderPlus,
  Type as FontIcon,
  Image as ImageIcon,
  MoreVertical,
  Trash2,
  Upload,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  createFile,
  deleteFile,
  deleteFolder,
  renameFile,
  renameFolder,
  uploadFile,
} from "@/actions/files";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  buildFileTree,
  type FileItem,
  type TreeFolder,
  type TreeNode,
} from "@/lib/tree-utils";
import { cn } from "@/lib/utils";

interface FileTreeProps {
  projectId: string;
  files: FileItem[];
  activeFileId?: string;
  onFileSelect?: (file: FileItem) => void;
}

type OperationType =
  | "create_file"
  | "create_folder"
  | "rename_file"
  | "rename_folder"
  | "delete_file"
  | "delete_folder";

interface OperationState {
  type: OperationType;
  target?: FileItem | TreeFolder; // For rename/delete
  parentPath?: string; // For create
  isOpen: boolean;
}

export function FileTree({
  projectId,
  files,
  activeFileId,
  onFileSelect,
}: FileTreeProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
  const [operation, setOperation] = useState<OperationState>({
    type: "create_file",
    isOpen: false,
  });
  const [inputValue, setInputValue] = useState("");

  const tree = useMemo(() => buildFileTree(files), [files]);

  const toggleFolder = (path: string) => {
    const next = new Set(openFolders);
    if (next.has(path)) {
      next.delete(path);
    } else {
      next.add(path);
    }
    setOpenFolders(next);
  };

  const openOperation = (
    type: OperationType,
    target?: FileItem | TreeFolder,
    parentPath?: string,
  ) => {
    setOperation({ type, target, parentPath, isOpen: true });
    if (type === "rename_file" && target && "path" in target) {
      setInputValue(target.path); // Full path for file rename, but usually we just want the name. Let's handle logic below.
    } else if (type === "rename_folder" && target) {
      setInputValue(target.path);
    } else {
      setInputValue("");
    }
  };

  const handleOperationSubmit = async () => {
    try {
      switch (operation.type) {
        case "create_file": {
          const name = inputValue.trim();
          if (!name) return;
          const fullPath = operation.parentPath
            ? `${operation.parentPath}/${name}`
            : name;
          await createFile(
            projectId,
            fullPath,
            name.endsWith(".typ") ? "typst" : "other",
          );
          toast.success(`파일 '${name}'이(가) 생성되었습니다.`);
          break;
        }
        case "create_folder": {
          const name = inputValue.trim();
          if (!name) return;
          const fullPath = operation.parentPath
            ? `${operation.parentPath}/${name}/.gitkeep`
            : `${name}/.gitkeep`;
          await createFile(projectId, fullPath, "other", "");
          toast.success(`폴더 '${name}'이(가) 생성되었습니다.`);
          break;
        }
        case "rename_file": {
          if (!operation.target || !("blobUrl" in operation.target)) return;
          const file = operation.target as FileItem;
          const newName = inputValue.trim();
          if (!newName || newName === file.path) return;
          await renameFile(projectId, file.id, newName);
          toast.success("파일 이름이 변경되었습니다.");
          break;
        }
        case "rename_folder": {
          if (!operation.target || "blobUrl" in operation.target) return;
          const folder = operation.target as TreeFolder;
          const newName = inputValue.trim();
          if (!newName || newName === folder.path) return;
          // renameFolder action is needed in files.ts
          await renameFolder(projectId, folder.path, newName);
          toast.success("폴더 이름이 변경되었습니다.");
          break;
        }
        case "delete_file": {
          if (!operation.target || !("blobUrl" in operation.target)) return;
          const file = operation.target as FileItem;
          await deleteFile(projectId, file.id);
          toast.success("파일이 삭제되었습니다.");
          break;
        }
        case "delete_folder": {
          if (!operation.target || "blobUrl" in operation.target) return;
          const folder = operation.target as TreeFolder;
          await deleteFolder(projectId, folder.path);
          toast.success("폴더가 삭제되었습니다.");
          break;
        }
      }
      setOperation((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "작업을 완료할 수 없습니다.",
      );
    }
  };

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    parentPath?: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("파일 업로드 중...");
    const fullPath = parentPath ? `${parentPath}/${file.name}` : file.name;
    const formData = new FormData();
    formData.append("file", file);

    try {
      await uploadFile(projectId, fullPath, formData);
      toast.success("업로드가 완료되었습니다.", { id: toastId });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "업로드에 실패했습니다.",
        { id: toastId },
      );
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const renderNode = (node: TreeNode, depth = 0) => {
    const isFolder = "children" in node;
    const isOpen = openFolders.has(node.path);

    if (isFolder) {
      return (
        <div key={node.path}>
          <div
            className={cn(
              "group flex items-center justify-between gap-2 rounded-md text-sm transition-colors text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            <button
              type="button"
              className="flex flex-1 items-center gap-2 overflow-hidden py-1.5 text-left"
              onClick={() => toggleFolder(node.path)}
            >
              {isOpen ? (
                <ChevronDown className="h-4 w-4 shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0" />
              )}
              <Folder className="h-4 w-4 shrink-0 text-amber-500/80" />
              <span className="truncate">{node.name}</span>
            </button>

            <div className="px-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      openOperation("create_file", undefined, node.path)
                    }
                  >
                    <FilePlus className="mr-2 h-4 w-4" />새 파일
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      openOperation("create_folder", undefined, node.path)
                    }
                  >
                    <FolderPlus className="mr-2 h-4 w-4" />새 폴더
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <label className="flex items-center w-full px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground">
                      <Upload className="mr-2 h-4 w-4" />
                      업로드
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleUpload(e, node.path)}
                        disabled={isUploading}
                      />
                    </label>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openOperation("rename_folder", node)}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    이름 변경
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openOperation("delete_folder", node)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    폴더 삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {isOpen && (
            <div className="mt-0.5">
              {node.children.map((child) => renderNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // Skip .gitkeep files from being displayed
    if (node.name === ".gitkeep") return null;

    const file = node.file;
    const isActive = activeFileId === file.id;

    return (
      <div
        key={file.id}
        className={cn(
          "group flex items-center justify-between gap-2 rounded-md text-sm transition-colors",
          isActive
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        <button
          type="button"
          className="flex flex-1 items-center gap-2 overflow-hidden py-1.5 text-left"
          onClick={() => onFileSelect?.(file)}
        >
          <FileIcon type={file.type} className="h-4 w-4 shrink-0" />
          <span className="truncate">{node.name}</span>
        </button>

        <div className="px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => openOperation("rename_file", file)}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                이름 변경
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openOperation("delete_file", file)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col h-full bg-muted/20 border-r border-border">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Files
          </h2>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => openOperation("create_file")}
              title="새 파일"
            >
              <FilePlus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => openOperation("create_folder")}
              title="새 폴더"
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
            <label className="cursor-pointer">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted transition-colors",
                  isUploading && "opacity-50 cursor-not-allowed",
                )}
                title="파일 업로드"
              >
                <Upload className="h-4 w-4" />
              </div>
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleUpload(e)}
                disabled={isUploading}
              />
            </label>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {files.length === 0 ? (
            <p className="text-xs text-center text-muted-foreground py-10">
              파일이 없습니다.
            </p>
          ) : (
            <div className="space-y-0.5">
              {tree.map((node) => renderNode(node))}
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={operation.isOpen}
        onOpenChange={(open) =>
          setOperation((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {operation.type === "create_file" && "새 파일 만들기"}
              {operation.type === "create_folder" && "새 폴더 만들기"}
              {operation.type === "rename_file" && "파일 이름 변경"}
              {operation.type === "rename_folder" && "폴더 이름 변경"}
              {operation.type === "delete_file" && "파일 삭제"}
              {operation.type === "delete_folder" && "폴더 삭제"}
            </DialogTitle>
            <DialogDescription>
              {operation.type === "delete_file" &&
                "이 파일을 삭제하시겠습니까? 삭제된 파일은 복구할 수 없습니다."}
              {operation.type === "delete_folder" &&
                "이 폴더와 하위 모든 파일을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."}
            </DialogDescription>
          </DialogHeader>

          {!operation.type.startsWith("delete") && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  {operation.type.includes("folder")
                    ? "폴더 이름"
                    : "파일 이름"}
                </Label>
                <Input
                  id="name"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    operation.type.includes("folder")
                      ? "폴더 이름"
                      : "example.typ"
                  }
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleOperationSubmit();
                  }}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setOperation((prev) => ({ ...prev, isOpen: false }))
              }
            >
              취소
            </Button>
            <Button
              variant={
                operation.type.startsWith("delete") ? "destructive" : "default"
              }
              onClick={handleOperationSubmit}
            >
              {operation.type.startsWith("delete") ? "삭제" : "확인"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FileIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case "typst":
      return <FileText className={className} />;
    case "image":
      return <ImageIcon className={className} />;
    case "font":
      return <FontIcon className={className} />;
    case "data":
      return <Database className={className} />;
    default:
      return <File className={className} />;
  }
}
