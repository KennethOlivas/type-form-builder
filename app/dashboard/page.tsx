import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { db } from "@/db";
import { form, submission, workspaceForm } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, count, getTableColumns } from "drizzle-orm";
import { headers } from "next/headers";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ workspace?: string }>;
}) {
  const headersList = await headers();
  const user = await auth.api.getSession({
    headers: headersList,
  });

  if (!user?.session) {
    return <div>Unauthorized</div>;
  }

  const userId = user.user.id;
  const params = await searchParams;
  const activeWorkspaceId = params.workspace;

  // Fetch all forms with response counts
  let formsQuery = db
    .select({
      ...getTableColumns(form),
      responses: count(submission.id),
    })
    .from(form)
    .leftJoin(submission, eq(form.id, submission.formId))
    .where(eq(form.createdBy, userId))
    .groupBy(form.id)
    .$dynamic();

  // If a workspace is selected, join with workspaceForm to filter
  if (activeWorkspaceId) {
    formsQuery = db
      .select({
        ...getTableColumns(form),
        responses: count(submission.id),
      })
      .from(form)
      .innerJoin(workspaceForm, eq(form.id, workspaceForm.formId))
      .leftJoin(submission, eq(form.id, submission.formId))
      .where(eq(form.createdBy, userId))
      .where(eq(workspaceForm.workspaceId, activeWorkspaceId))
      .groupBy(form.id)
      .$dynamic();
  }

  const forms = await formsQuery;

  return (
    <>
      <DashboardContent forms={forms} activeWorkspaceId={activeWorkspaceId} />
    </>
  );
}
