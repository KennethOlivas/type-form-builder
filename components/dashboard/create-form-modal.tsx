"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, LayoutTemplate, ArrowRight, Check, Loader2 } from "lucide-react";
import { templates, Template } from "@/lib/templates";
import { useCreateForm } from "@/hooks/use-forms";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CreateFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

type Step = "selection" | "templates";

export function CreateFormModal({ open, onOpenChange }: CreateFormModalProps) {
    const router = useRouter();
    const [step, setStep] = useState<Step>("selection");
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
    const { mutate: createForm, isLoading } = useCreateForm();

    const handleClose = () => {
        onOpenChange(false);
        // Reset state after a short delay to allow animation to finish
        setTimeout(() => {
            setStep("selection");
            setSelectedTemplate(null);
        }, 300);
    };

    const handleCreateBlank = () => {
        router.push("/builder/new");
        handleClose();
    };

    const handleCreateFromTemplate = async () => {
        if (!selectedTemplate) return;

        try {
            const result = await createForm({
                title: selectedTemplate.title,
                description: selectedTemplate.description,
                questions: selectedTemplate.questions,
                style: selectedTemplate.style,
                welcomeScreen: selectedTemplate.welcomeScreen,
            });

            toast.success("Form created from template");
            router.push(`/builder/${result.id}`);
            handleClose();
        } catch (error) {
            toast.error("Failed to create form");
        }
    };

    // Group templates by category
    const categories = Array.from(new Set(templates.map((t) => t.category)));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden gap-0">
                <div className="p-6 border-b">
                    <DialogHeader>
                        <DialogTitle>Create New Form</DialogTitle>
                        <DialogDescription>
                            {step === "selection"
                                ? "Choose how you want to start building your form."
                                : "Select a template to get started quickly."}
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 bg-muted/30 min-h-[400px]">
                    {step === "selection" ? (
                        <div className="grid md:grid-cols-2 gap-6 h-full">
                            <Card
                                className="p-6 cursor-pointer hover:border-primary hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-4 group"
                                onClick={handleCreateBlank}
                            >
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <FileText className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Start from Scratch</h3>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Build your form from the ground up with a blank canvas.
                                    </p>
                                </div>
                            </Card>

                            <Card
                                className="p-6 cursor-pointer hover:border-primary hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-4 group"
                                onClick={() => setStep("templates")}
                            >
                                <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                                    <LayoutTemplate className="w-8 h-8 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">Use a Template</h3>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Choose from our pre-made templates to save time.
                                    </p>
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full gap-4">
                            <Tabs defaultValue="All" className="w-full flex-1 flex flex-col">
                                <TabsList className="w-full justify-start mb-4">
                                    <TabsTrigger value="All">All Templates</TabsTrigger>
                                    {categories.map((category) => (
                                        <TabsTrigger key={category} value={category}>
                                            {category}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                <ScrollArea className="flex-1 h-[300px] pr-4">
                                    <TabsContent value="All" className="mt-0 space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {templates.map((template) => (
                                                <TemplateCard
                                                    key={template.id}
                                                    template={template}
                                                    selected={selectedTemplate?.id === template.id}
                                                    onSelect={() => setSelectedTemplate(template)}
                                                />
                                            ))}
                                        </div>
                                    </TabsContent>
                                    {categories.map((category) => (
                                        <TabsContent key={category} value={category} className="mt-0 space-y-4">
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {templates
                                                    .filter((t) => t.category === category)
                                                    .map((template) => (
                                                        <TemplateCard
                                                            key={template.id}
                                                            template={template}
                                                            selected={selectedTemplate?.id === template.id}
                                                            onSelect={() => setSelectedTemplate(template)}
                                                        />
                                                    ))}
                                            </div>
                                        </TabsContent>
                                    ))}
                                </ScrollArea>
                            </Tabs>

                            <div className="flex justify-between items-center pt-4 border-t mt-auto">
                                <Button variant="ghost" onClick={() => setStep("selection")}>
                                    Back
                                </Button>
                                <Button
                                    onClick={handleCreateFromTemplate}
                                    disabled={!selectedTemplate || isLoading}
                                >
                                    {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Create Form
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function TemplateCard({
    template,
    selected,
    onSelect,
}: {
    template: Template;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <div
            className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all relative overflow-hidden",
                selected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "hover:border-primary/50 hover:bg-muted/50"
            )}
            onClick={onSelect}
        >
            {selected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                </div>
            )}
            <h4 className="font-semibold mb-1">{template.name}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
                {template.description}
            </p>
            <div className="mt-3 flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-muted rounded-full font-medium">
                    {template.category}
                </span>
                <span className="text-xs text-muted-foreground">
                    {template.questions.length} questions
                </span>
            </div>
        </div>
    );
}
