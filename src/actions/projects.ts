"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { projectMembers, projects } from "@/db/schema";
import { storage } from "@/lib/storage";
import { checkAuth } from "./auth";

export async function getProjects() {
  const userId = await checkAuth();

  // Get projects where the user is a member
  const userProjects = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      ownerId: projects.ownerId,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      role: projectMembers.role,
    })
    .from(projects)
    .innerJoin(projectMembers, eq(projects.id, projectMembers.projectId))
    .where(eq(projectMembers.userId, userId))
    .orderBy(desc(projects.updatedAt));

  return userProjects;
}

export async function createProject(formData: {
  name: string;
  description?: string;
}) {
  const userId = await checkAuth();

  const result = await db.transaction(async (tx) => {
    const [newProject] = await tx
      .insert(projects)
      .values({
        name: formData.name,
        description: formData.description,
        ownerId: userId,
      })
      .returning();

    await tx.insert(projectMembers).values({
      projectId: newProject.id,
      userId: userId,
      role: "owner",
    });

    return newProject;
  });

  revalidatePath("/projects");
  return result;
}

export async function deleteProject(projectId: string) {
  const userId = await checkAuth();

  // Check if user is owner
  const [member] = await db
    .select()
    .from(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId),
        eq(projectMembers.role, "owner"),
      ),
    );

  if (!member) {
    throw new Error("Only owners can delete projects");
  }

  // Delete all files from R2
  const prefix = `projects/${projectId}/`;
  const objects = await storage.listObjects(prefix);
  if (objects.length > 0) {
    await storage.deleteObjects(objects.map((obj) => obj.key));
  }

  // Delete the project (cascade will handle projectMembers)
  await db.delete(projects).where(eq(projects.id, projectId));

  revalidatePath("/projects");
}

export async function updateProject(
  projectId: string,
  data: { name?: string; description?: string },
) {
  const userId = await checkAuth();

  // Check if user is editor or owner
  const [member] = await db
    .select()
    .from(projectMembers)
    .where(
      and(
        eq(projectMembers.projectId, projectId),
        eq(projectMembers.userId, userId),
      ),
    );

  if (!member || member.role === "viewer") {
    throw new Error("You don't have permission to update this project");
  }

  await db
    .update(projects)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, projectId));

  revalidatePath("/projects");
  revalidatePath(`/project/${projectId}`);
}

export async function getProjectById(projectId: string) {
  const userId = await checkAuth();

  const [project] = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      ownerId: projects.ownerId,
      mainFile: projects.mainFile,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      role: projectMembers.role,
    })
    .from(projects)
    .innerJoin(projectMembers, eq(projects.id, projectMembers.projectId))
    .where(and(eq(projects.id, projectId), eq(projectMembers.userId, userId)));

  return project;
}
