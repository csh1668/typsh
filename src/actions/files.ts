"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { projectMembers } from "@/db/schema";
import { storage } from "@/lib/storage";
import {
  extractFilePath,
  getStorageKey,
  sanitizePath,
} from "@/lib/storage/utils";
import type { FileItem } from "@/lib/tree-utils";
import { getFileType } from "@/lib/tree-utils";
import { checkAuth } from "./auth";

async function checkProjectPermission(
  projectId: string,
  minRole: "owner" | "editor" | "viewer" = "viewer",
) {
  const userId = await checkAuth();

  const [member] = await db
    .select()
    .from(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId),
      ),
    );

  if (!member) {
    throw new Error("Project not found or no access");
  }

  const roleOrder = { owner: 3, editor: 2, viewer: 1 };
  if (roleOrder[member.role] < roleOrder[minRole]) {
    throw new Error("Permission denied");
  }

  return userId;
}

export async function getFiles(projectId: string): Promise<FileItem[]> {
  await checkProjectPermission(projectId);

  const prefix = `projects/${projectId}/`;
  const objects = await storage.listObjects(prefix);

  return objects.map((obj) => ({
    path: extractFilePath(obj.key, projectId),
    type: getFileType(obj.key),
    size: obj.size,
    lastModified: obj.lastModified,
  }));
}

export async function getFileContent(
  projectId: string,
  filePath: string,
): Promise<string> {
  await checkProjectPermission(projectId);

  const key = getStorageKey(projectId, filePath);
  return await storage.getObject(key);
}

export async function createFile(
  projectId: string,
  path: string,
  _type: "typst" | "image" | "font" | "data" | "other" = "typst",
  content: string = "",
) {
  await checkProjectPermission(projectId, "editor");

  const key = getStorageKey(projectId, path);
  await storage.putObject(key, content);

  revalidatePath(`/project/${projectId}`);
}

export async function uploadFile(
  projectId: string,
  path: string,
  formData: FormData,
) {
  await checkProjectPermission(projectId, "editor");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const key = getStorageKey(projectId, path);
  await storage.putObject(key, file);

  revalidatePath(`/project/${projectId}`);
}

export async function deleteFile(projectId: string, filePath: string) {
  await checkProjectPermission(projectId, "editor");

  const key = getStorageKey(projectId, filePath);
  await storage.deleteObject(key);

  revalidatePath(`/project/${projectId}`);
}

export async function deleteFolder(projectId: string, folderPath: string) {
  await checkProjectPermission(projectId, "editor");

  const safePath = sanitizePath(folderPath);
  const prefix = `projects/${projectId}/${safePath}/`;
  const objects = await storage.listObjects(prefix);

  if (objects.length > 0) {
    await storage.deleteObjects(objects.map((obj) => obj.key));
  }

  revalidatePath(`/project/${projectId}`);
}

export async function renameFile(
  projectId: string,
  oldPath: string,
  newPath: string,
) {
  await checkProjectPermission(projectId, "editor");

  if (oldPath === newPath) return;

  const sourceKey = getStorageKey(projectId, oldPath);
  const destKey = getStorageKey(projectId, newPath);

  await storage.copyObject(sourceKey, destKey);
  await storage.deleteObject(sourceKey);

  revalidatePath(`/project/${projectId}`);
}

export async function renameFolder(
  projectId: string,
  oldPath: string,
  newPath: string,
) {
  await checkProjectPermission(projectId, "editor");

  if (oldPath === newPath) return;

  const safeOldPath = sanitizePath(oldPath);
  const safeNewPath = sanitizePath(newPath);
  const prefix = `projects/${projectId}/${safeOldPath}/`;
  const objects = await storage.listObjects(prefix);

  if (objects.length === 0) return;

  // Copy all objects to new prefix
  for (const obj of objects) {
    const relativePath = obj.key.slice(prefix.length);
    const destKey = `projects/${projectId}/${safeNewPath}/${relativePath}`;
    await storage.copyObject(obj.key, destKey);
  }

  // Delete all old objects
  await storage.deleteObjects(objects.map((obj) => obj.key));

  revalidatePath(`/project/${projectId}`);
}

export async function updateFileContent(
  projectId: string,
  filePath: string,
  content: string,
) {
  await checkProjectPermission(projectId, "editor");

  const key = getStorageKey(projectId, filePath);
  await storage.putObject(key, content);
}
