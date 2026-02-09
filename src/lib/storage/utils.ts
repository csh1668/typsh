import "server-only";

/**
 * Key structure: projects/{projectId}/{filePath}
 * e.g. projects/abc123/main.typ, projects/abc123/chapters/intro.typ
 */
export function getStorageKey(projectId: string, filePath: string): string {
  const safePath = sanitizePath(filePath);
  return `projects/${projectId}/${safePath}`;
}

export function extractFilePath(key: string, projectId: string): string {
  const prefix = `projects/${projectId}/`;
  return key.slice(prefix.length);
}

export function sanitizePath(filePath: string): string {
  // Reject path traversal
  if (filePath.includes("..")) {
    throw new Error("Invalid path: path traversal not allowed");
  }
  // Remove leading slashes
  return filePath.replace(/^\/+/, "");
}
