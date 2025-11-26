import { Suspense } from "react";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getForms } from "@/actions/form-actions";
import { getWorkspaces } from "@/actions/workspace-actions";
import { FormsSkeleton } from "@/components/skeletons/forms-skeleton";
import { redirect } from "next/navigation";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function DashboardData({
  activeWorkspaceId,
}: {
  activeWorkspaceId?: string;
}) {
  // Fetch workspaces
  const workspaces = await getWorkspaces();
  const hasWorkspace = workspaces.length > 0;

  // Fetch forms
  const formsResult = await getForms(activeWorkspaceId);

  if (!formsResult.success) {
    // Handle error - could show error UI
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Error loading forms: {formsResult.error}</p>
      </div>
    );
  }

  return (
    <DashboardContent
      forms={formsResult.data}
      activeWorkspaceId={activeWorkspaceId}
      hasWorkspace={hasWorkspace}
    />
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ workspace?: string }>;
}) {
  const params = await searchParams;
  const activeWorkspaceId = params.workspace;

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardData activeWorkspaceId={activeWorkspaceId} />
    </Suspense>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-16 items-center px-6">
          <div className="flex-1" />
        </div>
      </div>
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <div className="h-9 w-48 bg-muted animate-pulse rounded mb-2" />
            <div className="h-5 w-96 bg-muted animate-pulse rounded" />
          </div>
          <FormsSkeleton />
        </div>
      </main>
    </>
  );
}

