"use client";

import { AlertCircle, Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CompilerStatus } from "@/hooks/use-typst-compiler";

interface TypstPreviewProps {
  pdfUrl: string | null;
  status: CompilerStatus;
  error: string | null;
  diagnostics: string[];
  projectName?: string;
}

export function TypstPreview({
  pdfUrl,
  status,
  error,
  diagnostics,
  projectName = "document",
}: TypstPreviewProps) {
  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `${projectName}.pdf`;
    a.click();
  };

  return (
    <div className="flex h-full flex-col bg-muted/20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Preview</span>
          <StatusIndicator status={status} />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleDownload}
          disabled={!pdfUrl}
          title="PDF 다운로드"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm font-medium text-destructive">컴파일 오류</p>
            <div className="max-h-64 w-full overflow-auto rounded-md bg-muted p-3">
              <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
                {error}
              </pre>
              {diagnostics.length > 0 && (
                <div className="mt-2 space-y-1">
                  {diagnostics.map((d) => (
                    <pre
                      key={d}
                      className="whitespace-pre-wrap text-xs text-muted-foreground"
                    >
                      {d}
                    </pre>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : status === "loading" ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">컴파일러 로딩 중...</p>
          </div>
        ) : pdfUrl ? (
          <iframe
            src={`${pdfUrl}#toolbar=0`}
            className="h-full w-full border-0"
            title="PDF Preview"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <FileText className="h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              .typ 파일을 선택하면 미리보기가 표시됩니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusIndicator({ status }: { status: CompilerStatus }) {
  switch (status) {
    case "loading":
      return (
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          로딩
        </span>
      );
    case "compiling":
      return (
        <span className="flex items-center gap-1 text-xs text-amber-500">
          <Loader2 className="h-3 w-3 animate-spin" />
          컴파일 중
        </span>
      );
    case "error":
      return (
        <span className="flex items-center gap-1 text-xs text-destructive">
          <AlertCircle className="h-3 w-3" />
          오류
        </span>
      );
    case "ready":
      return null;
  }
}
