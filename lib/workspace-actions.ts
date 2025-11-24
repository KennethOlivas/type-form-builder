"use server";

import { db } from "@/db";
import { workspace, workspaceForm } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, count } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getWorkspaces() {
    const headersList = await headers();
    const user = await auth.api.getSession({
        headers: headersList,
    });

    if (!user?.session) {
        return [];
    }

    const userId = user.user.id;

    const workspaces = await db
        .select({
            id: workspace.id,
            name: workspace.name,
            icon: workspace.icon,
            type: workspace.type,
            createdAt: workspace.createdAt,
            updatedAt: workspace.updatedAt,
            formCount: count(workspaceForm.id),
        })
        .from(workspace)
        .leftJoin(workspaceForm, eq(workspace.id, workspaceForm.workspaceId))
        .where(eq(workspace.userId, userId))
        .groupBy(workspace.id)
        .orderBy(workspace.createdAt);

    return workspaces;
}

export async function createWorkspace(name: string) {
    const headersList = await headers();
    const user = await auth.api.getSession({
        headers: headersList,
    });

    if (!user?.session) {
        throw new Error("Unauthorized");
    }

    const userId = user.user.id;
    const workspaceId = crypto.randomUUID();

    const [newWorkspace] = await db
        .insert(workspace)
        .values({
            id: workspaceId,
            name,
            icon: "folder",
            type: "personal",
            userId,
        })
        .returning();

    revalidatePath("/dashboard");
    return newWorkspace;
}

export async function updateWorkspace(id: string, name: string) {
    const headersList = await headers();
    const user = await auth.api.getSession({
        headers: headersList,
    });

    if (!user?.session) {
        throw new Error("Unauthorized");
    }

    const userId = user.user.id;

    // Verify ownership
    const [existing] = await db
        .select()
        .from(workspace)
        .where(and(eq(workspace.id, id), eq(workspace.userId, userId)));

    if (!existing) {
        throw new Error("Workspace not found");
    }

    const [updated] = await db
        .update(workspace)
        .set({ name })
        .where(eq(workspace.id, id))
        .returning();

    revalidatePath("/dashboard");
    return updated;
}

export async function deleteWorkspace(id: string) {
    const headersList = await headers();
    const user = await auth.api.getSession({
        headers: headersList,
    });

    if (!user?.session) {
        throw new Error("Unauthorized");
    }

    const userId = user.user.id;

    // Verify ownership
    const [existing] = await db
        .select()
        .from(workspace)
        .where(and(eq(workspace.id, id), eq(workspace.userId, userId)));

    if (!existing) {
        throw new Error("Workspace not found");
    }

    await db.delete(workspace).where(eq(workspace.id, id));

    revalidatePath("/dashboard");
    return { success: true };
}

export async function addFormToWorkspace(workspaceId: string, formId: string) {
    const headersList = await headers();
    const user = await auth.api.getSession({
        headers: headersList,
    });

    if (!user?.session) {
        throw new Error("Unauthorized");
    }

    const userId = user.user.id;

    // Verify workspace ownership
    const [workspaceData] = await db
        .select()
        .from(workspace)
        .where(and(eq(workspace.id, workspaceId), eq(workspace.userId, userId)));

    if (!workspaceData) {
        throw new Error("Workspace not found");
    }

    // Remove form from any other workspace first
    await db.delete(workspaceForm).where(eq(workspaceForm.formId, formId));

    // Add form to workspace
    const [newEntry] = await db
        .insert(workspaceForm)
        .values({
            id: crypto.randomUUID(),
            workspaceId,
            formId,
        })
        .returning();

    revalidatePath("/dashboard");
    return newEntry;
}

export async function removeFormFromWorkspace(workspaceId: string, formId: string) {
    const headersList = await headers();
    const user = await auth.api.getSession({
        headers: headersList,
    });

    if (!user?.session) {
        throw new Error("Unauthorized");
    }

    const userId = user.user.id;

    // Verify workspace ownership
    const [workspaceData] = await db
        .select()
        .from(workspace)
        .where(and(eq(workspace.id, workspaceId), eq(workspace.userId, userId)));

    if (!workspaceData) {
        throw new Error("Workspace not found");
    }

    await db
        .delete(workspaceForm)
        .where(
            and(
                eq(workspaceForm.workspaceId, workspaceId),
                eq(workspaceForm.formId, formId)
            )
        );

    revalidatePath("/dashboard");
    return { success: true };
}
