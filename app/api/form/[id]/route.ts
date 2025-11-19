import { auth } from "@/lib/auth";
import { Form, Question } from "@/lib/local-data-service";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { form, question } from "@/db/schema";
import { eq } from "drizzle-orm";

export const DELETE = async (request: NextRequest) => {
   const user = await auth.api.getSession(request);

  if (!user?.session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = new URL(request.url).pathname.split("/").pop() as string;

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  await db.delete(question).where(eq(question.formId, id));
  await db.delete(form).where(eq(form.id, id));
  return new Response("Deleted", { status: 200 });
};

export const PUT = async (request: NextRequest) => {
  const userData = await auth.api.getSession(request);

  if (!userData?.session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { formData } = (await request.json()) as { formData: Form };

  await db
    .update(form)
    .set({
      title: formData.title,
      description: formData.description,
      style: formData.style,
      welcomeScreen: formData.welcomeScreen,
      updatedAt: new Date(),
    })
    .where(eq(form.id, formData.id));

  // For simplicity, delete existing questions and re-insert
    return NextResponse.json({ message: "Form updated successfully" })
};


export const GET = async (request: NextRequest) => {
  const user = await auth.api.getSession(request);

  if (!user?.session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const id = new URL(request.url).pathname.split("/").pop() as string;

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const resultForm = await db.select().from(form).where(eq(form.id, id));

  if (resultForm.length === 0) {
    return new Response("Not Found test", { status: 404 });
  }

  const resultQuestions = await db
    .select()
    .from(question)
    .where(eq(question.formId, id));

  const questions: Question[] = resultQuestions.map((q) => ({
    id: q.id,
    type: q.type as Question["type"],
    label: q.label,
    description: q.description || undefined,
    placeholder: q.placeholder || undefined,
    required: false,
  }));

  const formData: Form = {
    id: resultForm[0].id,
    title: resultForm[0].title,
    description: resultForm[0].description,
    style: resultForm[0].style as Form["style"],
    welcomeScreen: resultForm[0].welcomeScreen as Form["welcomeScreen"],
    questions,
    createdAt: resultForm[0].createdAt.toISOString(),
    updatedAt: resultForm[0].updatedAt.toISOString(),
  };

  return NextResponse.json(formData);
};
// ... other data
