import { Form } from "@/lib/local-data-service";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { form, question } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";


export const POST = async (request: NextRequest) => {
  const user = await auth.api.getSession(request);

  if (!user?.session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = user.user.id

  const { formData } = (await request.json()) as { formData: Form };
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
      }))
    )
    .returning();

  return NextResponse.json({ message: "Form created successfully", formId });
};

export const GET = async (request: NextRequest) => {
  const userData = await auth.api.getSession(request);

  if (!userData?.session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = userData.user.id;


  const response = await db
    .select()
    .from(form)
    .where(eq(form.createdBy, userId));

  return NextResponse.json({ forms: response });
}

