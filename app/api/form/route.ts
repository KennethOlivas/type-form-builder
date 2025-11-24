import { Form } from "@/lib/local-data-service";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { form, question, submission, workspace, workspaceForm } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, count, getTableColumns } from "drizzle-orm";

export const POST = async (request: NextRequest) => {
  const user = await auth.api.getSession(request);

  if (!user?.session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = user.user.id;

  const { formData, workspaceId } = (await request.json()) as {
    formData: Form;
    workspaceId?: string;
  };

  // Here you would typically handle form creation logic, e.g., saving to a database
  const formId = crypto.randomUUID();

  await db
    .insert(form)
    .values({
      id: formId,
      description: formData.description,
      title: formData.title,
      style: formData.style,
      welcomeScreen: formData.welcomeScreen,
      createdBy: userId,
    })
    .returning();

  await db
    .insert(question)
    .values(
      formData.questions.map((q) => ({
        id: crypto.randomUUID(),
        formId: formId,
        type: q.type,
        label: q.label,
        description: q.description || null,
        placeholder: q.placeholder || null,
        required: q.required,
        options: q.options || null,
        allowMultiple: q.allowMultiple || false,
        ratingScale: q.ratingScale || null,
      })),
    )
    .returning();

  // Add form to workspace
  try {
    let targetWorkspaceId = workspaceId;

    // If no workspaceId provided, use first workspace
    if (!targetWorkspaceId) {
      const userWorkspaces = await db
        .select()
        .from(workspace)
        .where(eq(workspace.userId, userId))
        .limit(1);

      if (userWorkspaces.length > 0) {
        targetWorkspaceId = userWorkspaces[0].id;
      }
    }

    // Add to workspace if we have a target
    if (targetWorkspaceId) {
      await db.insert(workspaceForm).values({
        id: crypto.randomUUID(),
        workspaceId: targetWorkspaceId,
        formId: formId,
      });
    }
  } catch (error) {
    console.error("Failed to add form to workspace:", error);
    // Don't fail form creation if workspace association fails
  }

  return NextResponse.json({ message: "Form created successfully", formId });
};

export const GET = async (request: NextRequest) => {
  const userData = await auth.api.getSession(request);

  if (!userData?.session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = userData.user.id;

  const response = await db
    .select({
      ...getTableColumns(form),
      responses: count(submission.id),
    })
    .from(form)
    .leftJoin(submission, eq(form.id, submission.formId))
    .where(eq(form.createdBy, userId))
    .groupBy(form.id);

  return NextResponse.json({ forms: response });
};
