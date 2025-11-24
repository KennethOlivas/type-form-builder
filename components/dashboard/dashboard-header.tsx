"use client";

import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProfileMenu } from "@/components/profile-menu";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "../theme-toggle";

interface DashboardHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export function DashboardHeader({ searchQuery, onSearchChange }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                <Link href="/builder/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Form
                    </Button>
                </Link>
                <div className="h-8 w-px bg-border" />
                <ThemeToggle />
                <ProfileMenu />
            </div>
        </header>
    );
}
