"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Save,
  Eye,
  BarChart3,
  ChevronLeft,
  Menu,
  Share,
  Home,
  Palette,
} from "lucide-react";
import { useBuilderStore } from "@/lib/store/builder-store";
import { memo, useState } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignPanel } from "./design-panel";
import { WelcomeScreenPanel } from "./welcome-screen-panel";
import { useRouter } from "next/navigation";
import { ShareFormModal } from "@/components/share-form-modal";
import { DesignModal } from "./design-modal";
import { WelcomeModal } from "./welcome-modal";
import { toast } from "sonner";
import { useCreateForm, useUpdateForm } from "@/hooks/use-forms";
import { ThemeToggle } from "../theme-toggle";
import { Form } from "@/lib/local-data-service";

interface BuilderHeaderProps {
  formId: string;
  isNewForm: boolean;
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateFormStatus } from "@/actions/form-actions";
import { cn } from "@/lib/utils";

// ... existing imports

export const BuilderHeader = memo(function BuilderHeader({
  isNewForm,
  formId,
}: BuilderHeaderProps) {
  const {
    formTitle,
    editingTitle,
    setFormTitle,
    setEditingTitle,
    formDescription,
    questions,
    formStyle,
    welcomeScreen,
    status,
    setStatus,
  } = useBuilderStore();

  const updateFormMutation = useUpdateForm();
  const createFormMutation = useCreateForm();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDesignModal, setShowDesignModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const router = useRouter();

  const isSaving = updateFormMutation.isLoading || createFormMutation.isLoading;

  const saveForm = async () => {
    // Add position property to questions based on their array index
    const questionsWithPosition = questions.map((q, index) => ({
      ...q,
      position: index,
    }));

    const formDataToSave = {
      title: formTitle,
      description: formDescription,
      questions: questionsWithPosition,
      style: formStyle,
      welcomeScreen,
    };

    try {
      if (isNewForm) {
        const result = await createFormMutation.mutate(formDataToSave);
        console.log("Created form:", result);
        toast.success("Form created");
        router.push(`/builder/${result.id}`);
      } else {
        const formToUpdate = {
          id: formId,
          ...formDataToSave,
        };
        console.log("Updating form:", formToUpdate);
        await updateFormMutation.mutate(formToUpdate);
        toast.success("Form saved successfully");
      }
    } catch (error) {
      toast.error(
        "An error occurred while saving the form" +
        (error instanceof Error ? `: ${error.message}` : ""),
      );
    }
  };

  const handlePreview = () => {
    router.push(`/form/${formId}`);
  };

  return (
    <div className="border-b bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="px-4 lg:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>

          {editingTitle ? (
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
              className="text-xl font-bold max-w-md"
              autoFocus
            />
          ) : (
            <h1
              className="text-xl lg:text-2xl font-bold cursor-pointer transition-colors truncate"
              onClick={() => setEditingTitle(true)}
            >
              {formTitle}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle variant="outline" />
          <Button
            variant="outline"
            onClick={() => setShowWelcomeModal(true)}
            className="hidden lg:flex"
          >
            <Home className="w-4 h-4 mr-2" />
            Welcome
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowDesignModal(true)}
            className="hidden lg:flex "
          >
            <Palette className="w-4 h-4 mr-2" />
            Design
          </Button>

          <Button
            variant="ghost"
            onClick={() => setShowMobileMenu(true)}
            className="lg:hidden "
          >
            <Menu className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowShareModal(true)}
            className=" hidden sm:flex"
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>

          <Link
            href={`/analytics/${formId}`}
            className="hidden sm:inline-block"
          >
            <Button variant="outline" className=" hidden sm:flex">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </Link>

          <Button
            variant="outline"
            onClick={handlePreview}
            className=" hidden lg:flex "
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <div className="flex items-center gap-2 mr-2">
            <Select
              value={status}
              onValueChange={async (value: "published" | "draft" | "closed") => {
                setStatus(value);
                try {
                  const result = await updateFormStatus(formId, value);
                  if (result.success) {
                    toast.success(`Form ${value}`);
                  } else {
                    toast.error(result.error);
                  }
                } catch (error) {
                  toast.error("Failed to update status");
                }
              }}
            >
              <SelectTrigger>
                <div className="flex items-center ">
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="published">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Published
                  </div>
                </SelectItem>
                <SelectItem value="draft">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    Draft
                  </div>
                </SelectItem>
                <SelectItem value="closed">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    Closed
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={saveForm} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetContent side="bottom" className=" h-[85vh]">
          <SheetHeader>
            <SheetTitle className="text-white">Menu</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowShareModal(true);
                }}
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button
                size="lg"
                onClick={() => {
                  setShowMobileMenu(false);
                  handlePreview();
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>

            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setShowMobileMenu(false);
                router.push(`/analytics/${formId}`);
              }}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>

            <Tabs fullWidth defaultValue="welcome" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
                <TabsTrigger
                  value="welcome"
                  className="data-[state=active]:bg-indigo-600 flex items-center"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Welcome
                </TabsTrigger>
                <TabsTrigger
                  value="design"
                  className="data-[state=active]:bg-indigo-600 flex items-center"
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Design
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="welcome"
                className="mt-4 space-y-4 max-h-[calc(85vh-260px)] overflow-y-auto"
              >
                <WelcomeScreenPanel />
              </TabsContent>

              <TabsContent
                value="design"
                className="mt-4 space-y-4 max-h-[calc(85vh-260px)] overflow-y-auto"
              >
                <DesignPanel />
              </TabsContent>
            </Tabs>
          </div>
        </SheetContent>
      </Sheet>

      <ShareFormModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        formId={formId}
        formTitle={formTitle}
      />

      <DesignModal open={showDesignModal} onOpenChange={setShowDesignModal} />
      <WelcomeModal
        open={showWelcomeModal}
        onOpenChange={setShowWelcomeModal}
      />
    </div>
  );
});
