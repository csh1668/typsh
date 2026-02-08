import "server-only";
import { randomUUID } from "node:crypto";
import path from "node:path";

export function sanitizePath(fileName: string): string {
  // 경로 탐색 공격 방지: 파일 이름만 추출
  const basename = path.basename(fileName);
  // 안전한 문자로 변환
  return basename.replace(/[^a-zA-Z0-9.-]/g, "_");
}

export function generateStorageKey(
  projectId: string,
  fileName: string,
): string {
  const safeName = sanitizePath(fileName);
  const uniqueId = randomUUID();
  // 프로젝트별 격리 및 고유성 보장
  return `projects/${projectId}/${uniqueId}-${safeName}`;
}
