import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getWorkspaces, createWorkspace } from "@/lib/workspace-actions";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let workspaces = await getWorkspaces();

    // Auto-create workspace if user has none
    if (workspaces.length === 0) {
        try {
            await createWorkspace("My Workspace");
            workspaces = await getWorkspaces();
        } catch (error) {
            console.error("Failed to auto-create workspace:", error);
        }
    }

    return (
        <SidebarProvider>
            <AppSidebar workspaces={workspaces} />
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    );
}
