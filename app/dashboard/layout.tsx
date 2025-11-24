import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getWorkspaces } from "@/lib/workspace-actions";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const workspaces = await getWorkspaces();

    return (
        <SidebarProvider>
            <AppSidebar workspaces={workspaces} />
            <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
    );
}
