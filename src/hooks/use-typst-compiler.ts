"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  WorkerRequest,
  WorkerResponse,
} from "@/workers/typst-compiler.worker";

export type CompilerStatus = "loading" | "ready" | "compiling" | "error";

export function useTypstCompiler() {
  const workerRef = useRef<Worker | null>(null);
  const [status, setStatus] = useState<CompilerStatus>("loading");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const prevPdfUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/typst-compiler.worker.ts", import.meta.url),
    );
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const msg = e.data;

      switch (msg.type) {
        case "init-done":
          setStatus("ready");
          setError(null);
          break;
        case "init-error":
          setStatus("error");
          setError(`Failed to initialize compiler: ${msg.error}`);
          break;
        case "compile-done": {
          // Revoke previous PDF URL to avoid memory leak
          if (prevPdfUrlRef.current) {
            URL.revokeObjectURL(prevPdfUrlRef.current);
          }
          const blob = new Blob([msg.pdf], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          prevPdfUrlRef.current = url;
          setPdfUrl(url);
          setError(null);
          setDiagnostics([]);
          setStatus("ready");
          break;
        }
        case "compile-error":
          setError(msg.error);
          setDiagnostics(msg.diagnostics ?? []);
          setStatus("ready");
          break;
      }
    };

    worker.postMessage({ type: "init" } satisfies WorkerRequest);

    return () => {
      worker.terminate();
      workerRef.current = null;
      if (prevPdfUrlRef.current) {
        URL.revokeObjectURL(prevPdfUrlRef.current);
      }
    };
  }, []);

  const compile = useCallback(
    (files: Record<string, string>, mainFilePath: string) => {
      if (!workerRef.current) return;
      setStatus("compiling");
      workerRef.current.postMessage({
        type: "compile",
        files,
        mainFilePath,
      } satisfies WorkerRequest);
    },
    [],
  );

  return { status, pdfUrl, error, diagnostics, compile };
}
