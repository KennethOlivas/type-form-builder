"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useDeleteForm, useDuplicateForm } from "@/hooks/use-forms";
import { ShareFormModal } from "@/components/share-form-modal";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardToolbar } from "@/components/dashboard/dashboard-toolbar";
import { FormCard } from "@/components/dashboard/form-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Card } from "@/components/ui/card";

interface Form {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    responses: number;
    style: any;
    welcomeScreen: any;
    createdBy: string;
}

interface DashboardContentProps {
    forms: Form[];
    activeWorkspaceId?: string;
}

export function DashboardContent({
    forms,
    activeWorkspaceId,
}: DashboardContentProps) {
    const deleteFormMutation = useDeleteForm();
    const duplicateFormMutation = useDuplicateForm();

    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [selectedForm, setSelectedForm] = useState<{
        id: string;
        title: string;
    } | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState("updated");
    const [view, setView] = useState<"grid" | "list">("grid");

    const handleDelete = (id: string) => {
        deleteFormMutation.mutate(id);
    };

    const handleDuplicate = (id: string) => {
        duplicateFormMutation.mutate(id);
    };

    const handleShare = (id: string, title: string) => {
        setSelectedForm({ id, title });
        setShareModalOpen(true);
    };

    // Transform and filter forms
    const filteredAndSortedForms = useMemo(() => {
        let processed = forms.map((form) => ({
            id: form.id,
            title: form.title,
            status: "published" as "published" | "draft" | "closed",
            responses: form.responses || 0,
            lastEdited: new Date(form.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }),
            views: 0,
            completionRate: 0,
        }));

        // Filter by search query
        if (searchQuery) {
            processed = processed.filter((form) =>
                form.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by status
        if (statusFilter !== "all") {
            processed = processed.filter((form) => form.status === statusFilter);
        }

        // Sort
        processed.sort((a, b) => {
            switch (sortOrder) {
                case "alphabetical":
                    return a.title.localeCompare(b.title);
                case "responses":
                    return b.responses - a.responses;
                case "updated":
                default:
                    return 0; // Already sorted by recent from API
            }
        });

        return processed;
    }, [forms, searchQuery, statusFilter, sortOrder]);

    return (
        <>
            <DashboardHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            <main className="flex-1 overflow-auto p-6">
                <div className="mx-auto max-w-7xl space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Your Forms</h1>
                        <p className="text-muted-foreground">
                            {activeWorkspaceId
                                ? "Forms in this workspace"
                                : "Manage and organize all your forms in one place"}
                        </p>
                    </div>

                    <DashboardToolbar
                        view={view}
                        onViewChange={setView}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        sortOrder={sortOrder}
                        onSortOrderChange={setSortOrder}
                    />

                    {filteredAndSortedForms.length === 0 ? (
                        forms.length === 0 ? (
                            <EmptyState />
                        ) : (
                            <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                                <p className="text-lg text-muted-foreground">
                                    No forms found matching your criteria
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Try adjusting your filters or search query
                                </p>
                            </div>
                        )
                    ) : (
                        <AnimatePresence mode="popLayout">
                            <div
                                className={
                                    view === "grid"
                                        ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                                        : "space-y-4"
                                }
                            >
                                {filteredAndSortedForms.map((form, index) => (
                                    <motion.div
                                        key={form.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <FormCard
                                            form={form}
                                            onDelete={handleDelete}
                                            onDuplicate={handleDuplicate}
                                            onShare={() => handleShare(form.id, form.title)}
                                        />
                                    </motion.div>
                                ))}

                                {view === "grid" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: filteredAndSortedForms.length * 0.05 }}
                                    >
                                        <Link href="/builder/new">
                                            <Card className="group relative overflow-hidden transition-all hover:shadow-md border-dashed border-2 hover:border-primary/50 bg-card/30 backdrop-blur-sm h-[300px] flex items-center justify-center cursor-pointer">
                                                <div className="text-center space-y-4">
                                                    <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                        <Plus className="w-6 h-6 text-primary" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">Create New Form</h3>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Start building your next form
                                                        </p>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    </motion.div>
                                )}
                            </div>
                        </AnimatePresence>
                    )}
                </div>
            </main>

            {selectedForm && (
                <ShareFormModal
                    open={shareModalOpen}
                    onOpenChange={setShareModalOpen}
                    formId={selectedForm.id}
                    formTitle={selectedForm.title}
                />
            )}
        </>
    );
}
