import { db } from "@/db";
import { form, submission } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {

  const id = new URL(request.url).pathname.split("/").pop() as string;

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }


  const { answers } = (await request.json()) as { answers: string | string[] };

  const resultForm = await db.select().from(form).where(eq(form.id, id));

  if (!resultForm) {
    return new Response("Not Found", { status: 404 });
  }

  const submissionId = crypto.randomUUID();

  await db.insert(submission).values({
    id: submissionId,
    formId: id,
    answers,
    device: "web",
  });


  return new Response("Submitted", { status: 200 });
};
