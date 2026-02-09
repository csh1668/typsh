"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { updateFileContent } from "@/actions/files";

interface UseAutoSaveOptions {
  projectId: string;
  filePath: string | null;
  debounceMs?: number;
}

export function useAutoSave({
  projectId,
  filePath,
  debounceMs = 2000,
}: UseAutoSaveOptions) {
  const [isSaving, setIsSaving] = useState(false);

  const pendingContentRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savingRef = useRef(false);
  const filePathRef = useRef(filePath);

  // Track the current filePath
  filePathRef.current = filePath;

  const flush = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const content = pendingContentRef.current;
    const currentFilePath = filePathRef.current;

    if (content === null || !currentFilePath || savingRef.current) return;

    pendingContentRef.current = null;

    savingRef.current = true;
    setIsSaving(true);

    try {
      await updateFileContent(projectId, currentFilePath, content);
    } catch (error) {
      console.error("Auto-save failed:", error);
      // Restore pending content so it can be retried
      if (pendingContentRef.current === null) {
        pendingContentRef.current = content;
      }
    } finally {
      savingRef.current = false;
      setIsSaving(false);
    }
  }, [projectId]);

  const markDirty = useCallback(
    (content: string) => {
      pendingContentRef.current = content;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        flush();
      }, debounceMs);
    },
    [debounceMs, flush],
  );

  // Save on visibility change (tab switch / minimize)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flush();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [flush]);

  // Save on unmount or file switch
  useEffect(() => {
    return () => {
      // Synchronously clear timer and attempt save
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      // Fire and forget - component is unmounting
      const content = pendingContentRef.current;
      const currentFilePath = filePathRef.current;
      if (content !== null && currentFilePath) {
        pendingContentRef.current = null;
        updateFileContent(projectId, currentFilePath, content).catch(
          console.error,
        );
      }
    };
  }, [projectId]);

  return { markDirty, flush, isSaving };
}
