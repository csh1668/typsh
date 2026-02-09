"use client";

import { useCallback, useRef } from "react";

interface UseDebouncedCompileOptions {
  compile: (files: Record<string, string>, mainFilePath: string) => void;
  mainFilePath: string;
  debounceMs?: number;
}

export function useDebouncedCompile({
  compile,
  mainFilePath,
  debounceMs = 400,
}: UseDebouncedCompileOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filesCacheRef = useRef<Record<string, string>>({});

  const updateFile = useCallback(
    (path: string, content: string) => {
      filesCacheRef.current = {
        ...filesCacheRef.current,
        [path]: content,
      };

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        compile({ ...filesCacheRef.current }, mainFilePath);
      }, debounceMs);
    },
    [compile, mainFilePath, debounceMs],
  );

  const setFiles = useCallback(
    (files: Record<string, string>) => {
      filesCacheRef.current = { ...files };
      // Trigger immediate compile when files are bulk-loaded
      compile({ ...filesCacheRef.current }, mainFilePath);
    },
    [compile, mainFilePath],
  );

  const getFiles = useCallback(() => {
    return { ...filesCacheRef.current };
  }, []);

  return { updateFile, setFiles, getFiles };
}
