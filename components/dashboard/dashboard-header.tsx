"use client";

import { useEffect, useState } from "react";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileMenu } from "@/components/user/profile-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "../theme-toggle";
import { CreateFormModal } from "@/components/dashboard/create-form-modal";

interface DashboardHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    hasWorkspace?: boolean;
}

export function DashboardHeader({ searchQuery, onSearchChange, hasWorkspace = true }: DashboardHeaderProps) {
    const [createFormModalOpen, setCreateFormModalOpen] = useState(false);

    useEffect(() => {
        const handleOpenModal = () => setCreateFormModalOpen(true);
        document.addEventListener("open-create-form-modal", handleOpenModal);
        return () => document.removeEventListener("open-create-form-modal", handleOpenModal);
    }, []);

    return (
        <>
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-backdrop-filter:bg-background/60">
                <SidebarTrigger className="-ml-2" />
                <div className="flex flex-1 items-center gap-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search forms..."
                            className="w-full bg-background pl-9 md:w-[300px] lg:w-[400px]"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {hasWorkspace ? (
                        <Button onClick={() => setCreateFormModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Form
                        </Button>
                    ) : (
                        <Button disabled title="Create a workspace first to start creating forms">
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Form
                        </Button>
                    )}
                    <div className="h-8 w-px bg-border" />
                    <ThemeToggle />
                    <ProfileMenu />
                </div>
            </header>

            <CreateFormModal
                open={createFormModalOpen}
                onOpenChange={setCreateFormModalOpen}
            />
        </>
    );
}
