"use server";

import { and, asc, eq, like, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { files, projectMembers } from "@/db/schema";
import { storage } from "@/lib/storage";
import { generateStorageKey } from "@/lib/storage/utils";
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

export async function getFiles(projectId: string) {
  await checkProjectPermission(projectId);

  return await db
    .select()
    .from(files)
    .where(eq(files.projectId, projectId))
    .orderBy(asc(files.path));
}

export async function createFile(
  projectId: string,
  path: string,
  type: "typst" | "image" | "font" | "data" | "other" = "typst",
  content: string = "",
) {
  await checkProjectPermission(projectId, "editor");

  let blobUrl = null;
  // Allow creating empty files for text-based types
  if (type === "typst" || type === "data" || type === "other") {
    const storageKey = generateStorageKey(projectId, path);
    blobUrl = await storage.upload(storageKey, content);
  }

  try {
    const [newFile] = await db
      .insert(files)
      .values({
        projectId,
        path, // Logical path (e.g., "chapters/intro.typ")
        type,
        blobUrl,
        size: content.length,
      })
      .returning();

    revalidatePath(`/project/${projectId}`);
    return newFile;
  } catch (error) {
    if (blobUrl) {
      await storage.delete(blobUrl);
    }
    throw error;
  }
}

export async function uploadFile(
  projectId: string,
  path: string,
  formData: FormData,
) {
  await checkProjectPermission(projectId, "editor");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const storageKey = generateStorageKey(projectId, path);
  const url = await storage.upload(storageKey, file);

  try {
    const [newFile] = await db
      .insert(files)
      .values({
        projectId,
        path, // Logical path
        type: getFileType(path),
        blobUrl: url,
        size: file.size,
      })
      .returning();

    revalidatePath(`/project/${projectId}`);
    return newFile;
  } catch (error) {
    await storage.delete(url);
    throw error;
  }
}

export async function deleteFile(projectId: string, fileId: string) {
  await checkProjectPermission(projectId, "editor");

  const [deletedFile] = await db.transaction(async (tx) => {
    const [file] = await tx
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.projectId, projectId)));

    if (!file) throw new Error("File not found");

    await tx.delete(files).where(eq(files.id, fileId));
    return [file];
  });

  if (deletedFile?.blobUrl) {
    await storage.delete(deletedFile.blobUrl);
  }

  revalidatePath(`/project/${projectId}`);
}

export async function deleteFolder(projectId: string, folderPath: string) {
  await checkProjectPermission(projectId, "editor");

  // Escape special characters for LIKE query
  // Postgres uses backslash as default escape character
  const escapedPath = folderPath.replace(/[%_]/g, "\\$&");

  const filesToDelete = await db.transaction(async (tx) => {
    // Find all files that are inside this folder or its subfolders
    const targets = await tx
      .select()
      .from(files)
      .where(
        and(
          eq(files.projectId, projectId),
          or(
            like(files.path, `${escapedPath}/%`),
            eq(files.path, folderPath), // In case the folder itself is represented by a file (like .gitkeep)
          ),
        ),
      );

    if (targets.length > 0) {
      // Delete from database
      await tx
        .delete(files)
        .where(
          and(
            eq(files.projectId, projectId),
            or(
              like(files.path, `${escapedPath}/%`),
              eq(files.path, folderPath),
            ),
          ),
        );
    }
    return targets;
  });

  if (filesToDelete.length === 0) return;

  // Delete from storage
  const blobUrls = filesToDelete
    .map((f) => f.blobUrl)
    .filter((url): url is string => !!url);

  if (blobUrls.length > 0) {
    await Promise.all(blobUrls.map((url) => storage.delete(url)));
  }

  revalidatePath(`/project/${projectId}`);
}

export async function renameFile(
  projectId: string,
  fileId: string,
  newPath: string,
) {
  await checkProjectPermission(projectId, "editor");

  await db
    .update(files)
    .set({
      path: newPath,
      updatedAt: new Date(),
    })
    .where(and(eq(files.id, fileId), eq(files.projectId, projectId)));

  revalidatePath(`/project/${projectId}`);
}

export async function renameFolder(
  projectId: string,
  oldPath: string,
  newPath: string,
) {
  await checkProjectPermission(projectId, "editor");

  const escapedOldPath = oldPath.replace(/[%_]/g, "\\$&");

  await db.transaction(async (tx) => {
    const projectFiles = await tx
      .select()
      .from(files)
      .where(
        and(
          eq(files.projectId, projectId),
          or(like(files.path, `${escapedOldPath}/%`), eq(files.path, oldPath)),
        ),
      );

    for (const file of projectFiles) {
      const newFilePath =
        file.path === oldPath
          ? newPath
          : file.path.replace(new RegExp(`^${oldPath}/`), `${newPath}/`);

      if (newFilePath !== file.path) {
        await tx
          .update(files)
          .set({
            path: newFilePath,
            updatedAt: new Date(),
          })
          .where(eq(files.id, file.id));
      }
    }
  });

  revalidatePath(`/project/${projectId}`);
}

function getFileType(
  path: string,
): "typst" | "image" | "font" | "data" | "other" {
  const ext = path.split(".").pop()?.toLowerCase();
  if (ext === "typ") return "typst";
  if (["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(ext || ""))
    return "image";
  if (["ttf", "otf", "woff", "woff2"].includes(ext || "")) return "font";
  if (["json", "csv", "yaml", "yml"].includes(ext || "")) return "data";
  return "other";
}
