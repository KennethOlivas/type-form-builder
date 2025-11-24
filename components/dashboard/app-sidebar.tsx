"use client";

import * as React from "react";
import {
    Archive,
    Folder,
    MoreHorizontal,
    Plus,
    Settings,
    Trash2,
    FileText,
} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileMenu } from "@/components/profile-menu";
import {
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
} from "@/actions/workspace-actions";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

interface Workspace {
    id: string;
    name: string;
    icon: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    formCount: number;
}

interface AppSidebarProps {
    workspaces: Workspace[];
}

export function AppSidebar({ workspaces }: AppSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeWorkspaceId = searchParams.get("workspace");

    const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = React.useState("");
    const [editingWorkspace, setEditingWorkspace] = React.useState<{
        id: string;
        name: string;
    } | null>(null);
    const [isCreating, setIsCreating] = React.useState(false);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleWorkspaceClick = (id: string) => {
        router.push(`/dashboard?workspace=${id}`);
    };

    const handleCreateWorkspace = async () => {
        if (!newWorkspaceName.trim()) {
            toast.error("Please enter a workspace name");
            return;
        }

        setIsCreating(true);
        try {
            await createWorkspace(newWorkspaceName);
            toast.success("Workspace created successfully");
            setCreateDialogOpen(false);
            setNewWorkspaceName("");
            router.refresh();
        } catch (error) {
            toast.error("Failed to create workspace");
        } finally {
            setIsCreating(false);
        }
    };

    const handleUpdateWorkspace = async (id: string, name: string) => {
        setIsUpdating(true);
        try {
            await updateWorkspace(id, name);
            toast.success("Workspace updated successfully");
            setEditingWorkspace(null);
            router.refresh();
        } catch (error) {
            toast.error("Failed to update workspace");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteWorkspace = async (id: string) => {
        setIsDeleting(true);
        try {
            await deleteWorkspace(id);
            toast.success("Workspace deleted successfully");
            if (activeWorkspaceId === id) {
                router.push("/dashboard");
            } else {
                router.refresh();
            }
        } catch (error) {
            toast.error("Failed to delete workspace");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Sidebar variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <FileText className="size-4" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">FormFlow</span>
                                    <span className="truncate text-xs">Enterprise</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <SidebarGroupAction title="Create Workspace">
                                <Plus /> <span className="sr-only">Create Workspace</span>
                            </SidebarGroupAction>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create Workspace</DialogTitle>
                                <DialogDescription>
                                    Create a new workspace to organize your forms.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Workspace Name</Label>
                                    <Input
                                        id="name"
                                        value={newWorkspaceName}
                                        onChange={(e) => setNewWorkspaceName(e.target.value)}
                                        placeholder="e.g., Marketing, HR, Personal"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateWorkspace} disabled={isCreating}>
                                    {isCreating ? "Creating..." : "Create Workspace"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {workspaces.length === 0 ? (
                                <SidebarMenuItem>
                                    <SidebarMenuButton disabled>
                                        <span className="text-muted-foreground">
                                            No workspaces
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ) : (
                                workspaces.map((workspace) => (
                                    <SidebarMenuItem key={workspace.id}>
                                        <SidebarMenuButton
                                            isActive={activeWorkspaceId === workspace.id}
                                            onClick={() => handleWorkspaceClick(workspace.id)}
                                        >
                                            <Folder />
                                            <span>{workspace.name}</span>
                                            {workspace.formCount !== undefined && (
                                                <span className="ml-auto text-xs text-muted-foreground">
                                                    {workspace.formCount}
                                                </span>
                                            )}
                                        </SidebarMenuButton>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <SidebarMenuAction showOnHover>
                                                    <MoreHorizontal />
                                                    <span className="sr-only">More</span>
                                                </SidebarMenuAction>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                className="w-48"
                                                side="right"
                                                align="start"
                                            >
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        setEditingWorkspace({
                                                            id: workspace.id,
                                                            name: workspace.name,
                                                        })
                                                    }
                                                >
                                                    <Settings className="text-muted-foreground" />
                                                    <span>Rename</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteWorkspace(workspace.id)}
                                                    className="text-destructive focus:text-destructive"
                                                    disabled={isDeleting}
                                                >
                                                    <Trash2 className="text-destructive" />
                                                    <span>Delete</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </SidebarMenuItem>
                                ))
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup className="mt-auto">
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Archive />
                                    <span>Trash</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton>
                                    <Settings />
                                    <span>Settings</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <div className="px-2 py-2">
                        <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-muted-foreground">Plan Usage</span>
                            <span className="font-medium">50/100</span>
                        </div>
                        <Progress value={50} className="h-2" />
                        <p className="text-[10px] text-muted-foreground mt-1">
                            Responses used this month
                        </p>
                    </div>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <div className="p-1">
                    <ProfileMenu />
                </div>
            </SidebarFooter>

            {/* Rename Dialog */}
            <Dialog
                open={!!editingWorkspace}
                onOpenChange={(open) => !open && setEditingWorkspace(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Workspace</DialogTitle>
                        <DialogDescription>
                            Change the name of your workspace.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Workspace Name</Label>
                            <Input
                                id="edit-name"
                                value={editingWorkspace?.name || ""}
                                onChange={(e) =>
                                    setEditingWorkspace(
                                        editingWorkspace
                                            ? { ...editingWorkspace, name: e.target.value }
                                            : null
                                    )
                                }
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => {
                                if (editingWorkspace) {
                                    handleUpdateWorkspace(
                                        editingWorkspace.id,
                                        editingWorkspace.name
                                    );
                                }
                            }}
                            disabled={isUpdating}
                        >
                            {isUpdating ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Sidebar>
    );
}
