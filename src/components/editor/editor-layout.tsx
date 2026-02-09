"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";
import { getFileContent } from "@/actions/files";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useDebouncedCompile } from "@/hooks/use-debounced-compile";
import { useTypstCompiler } from "@/hooks/use-typst-compiler";
import type { FileItem } from "@/lib/tree-utils";
import { CodeEditor, type CodeEditorHandle } from "./code-editor/code-editor";
import { FileTree } from "./file-tree/file-tree";
import { TypstPreview } from "./preview/typst-preview";

interface EditorLayoutProps {
  projectId: string;
  projectName: string;
  mainFile: string;
  files: FileItem[];
}

export function EditorLayout({
  projectId,
  projectName,
  mainFile,
  files,
}: EditorLayoutProps) {
  const editorRef = useRef<CodeEditorHandle>(null);
  const [activeFile, setActiveFile] = useState<FileItem | null>(null);
  // Cache file contents to avoid re-fetching on file switch
  const contentCacheRef = useRef<Record<string, string>>({});
  const [editorContent, setEditorContent] = useState("");
  // Suppress onChange during programmatic setContent (file switching)
  const suppressChangeRef = useRef(false);

  const { status, pdfUrl, error, diagnostics, compile } = useTypstCompiler();
  const { updateFile, setFiles } = useDebouncedCompile({
    compile,
    mainFilePath: mainFile,
  });
  const { markDirty, flush } = useAutoSave({
    projectId,
    filePath: activeFile?.path ?? null,
  });

  // Track whether initial load has happened
  const initialLoadDoneRef = useRef(false);

  // Load all .typ files when compiler becomes ready
  useEffect(() => {
    if (initialLoadDoneRef.current) return;
    if (status !== "ready") return;

    initialLoadDoneRef.current = true;
    let cancelled = false;

    async function loadTypFiles() {
      const typFiles = files.filter((f) => f.type === "typst");
      const fileMap: Record<string, string> = {};

      await Promise.all(
        typFiles.map(async (f) => {
          try {
            const text = await getFileContent(projectId, f.path);
            fileMap[f.path] = text;
            contentCacheRef.current[f.path] = text;
          } catch (err) {
            console.error(`Failed to load file ${f.path}:`, err);
          }
        }),
      );

      if (cancelled) return;

      setFiles(fileMap);

      // Auto-select main file
      const main = files.find((f) => f.path === mainFile);
      if (main && fileMap[main.path] !== undefined) {
        setActiveFile(main);
        setEditorContent(fileMap[main.path]);
      }
    }

    loadTypFiles();

    return () => {
      cancelled = true;
    };
  }, [status, files, mainFile, setFiles, projectId]);

  const handleFileSelect = useCallback(
    async (file: FileItem) => {
      if (activeFile?.path === file.path) return;

      // Save current file before switching
      await flush();

      // Save current editor content to cache
      if (activeFile && editorRef.current) {
        contentCacheRef.current[activeFile.path] =
          editorRef.current.getContent();
      }

      setActiveFile(file);

      // Load content from cache or fetch (suppress onChange to avoid stale closure)
      suppressChangeRef.current = true;
      try {
        if (contentCacheRef.current[file.path] !== undefined) {
          const content = contentCacheRef.current[file.path];
          setEditorContent(content);
          editorRef.current?.setContent(content);
        } else {
          try {
            const text = await getFileContent(projectId, file.path);
            contentCacheRef.current[file.path] = text;
            setEditorContent(text);
            editorRef.current?.setContent(text);
          } catch (err) {
            console.error("Failed to load file:", err);
            setEditorContent("");
            editorRef.current?.setContent("");
          }
        }
      } finally {
        suppressChangeRef.current = false;
      }
    },
    [activeFile, flush, projectId],
  );

  const handleEditorChange = useCallback(
    (content: string) => {
      if (!activeFile || suppressChangeRef.current) return;

      setEditorContent(content);
      contentCacheRef.current[activeFile.path] = content;

      // Update auto-save
      markDirty(content);

      // Update compiler file map (only for .typ files)
      if (activeFile.type === "typst") {
        updateFile(activeFile.path, content);
      }
    },
    [activeFile, markDirty, updateFile],
  );

  return (
    <div className="h-screen w-full">
      <Group orientation="horizontal">
        {/* File Tree Panel */}
        <Panel defaultSize="15%" minSize="10%" maxSize="30%">
          <FileTree
            projectId={projectId}
            files={files}
            activeFilePath={activeFile?.path}
            onFileSelect={handleFileSelect}
          />
        </Panel>

        <Separator className="w-1 bg-border hover:bg-primary/50 transition-colors" />

        {/* Editor Panel */}
        <Panel defaultSize="45%" minSize="20%">
          <div className="flex h-full flex-col">
            {/* Editor Header */}
            <div className="flex items-center border-b border-border px-4 py-2">
              <span className="text-sm text-muted-foreground">
                {activeFile?.path ?? "파일을 선택하세요"}
              </span>
            </div>
            {/* Editor */}
            <div className="flex-1 overflow-hidden">
              {activeFile ? (
                <CodeEditor
                  ref={editorRef}
                  initialContent={editorContent}
                  onChange={handleEditorChange}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    왼쪽 파일 트리에서 파일을 선택하세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Panel>

        <Separator className="w-1 bg-border hover:bg-primary/50 transition-colors" />

        {/* Preview Panel */}
        <Panel defaultSize="40%" minSize="20%">
          <TypstPreview
            pdfUrl={pdfUrl}
            status={status}
            error={error}
            diagnostics={diagnostics}
            projectName={projectName}
          />
        </Panel>
      </Group>
    </div>
  );
}
