"use client";
import { BuilderHeader } from "./builder-header";
import { AddItemPanel } from "./add-item-panel";
import { QuestionList } from "./question-list";
import { RightPanel } from "./right-panel";
import { MobileSheets } from "./mobile-sheets";
import { useEffect, useRef, useState } from "react";
import { useFormData, useUpdateForm } from "@/hooks/use-forms";
import { useBuilderStore } from "@/lib/store/builder-store";

interface BuilderProps {
  id: string;
  isNewForm: boolean;
}

export function Builder({ id, isNewForm }: BuilderProps) {
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);

  const { data: formData } = useFormData(id);
  const updateFormMutation = useUpdateForm();

  const {
    formTitle,
    formDescription,
    questions,
    formStyle,
    welcomeScreen,
    isInitialized,
    initializeForm,
    reset,
  } = useBuilderStore();

  const lastSavedStyleRef = useRef<string | null>(null);
  const lastSavedTitleRef = useRef<string | null>(null);
  const lastSavedWelcomeRef = useRef<string | null>(null);

  useEffect(() => {
    reset();
  }, [id, reset]);

  useEffect(() => {
    if (formData && !isInitialized) {
      initializeForm({
        title: formData.title,
        description: formData.description,
        questions: formData.questions,
        style: formData.style,
        welcomeScreen: formData.welcomeScreen,
      });
    }
  }, [formData, isInitialized, initializeForm]);

  useEffect(() => {
    if (!isNewForm && isInitialized) {
      const currentStyleString = JSON.stringify(formStyle);
      const currentTitleString = JSON.stringify(formTitle);
      const currentWelcomeString = JSON.stringify(welcomeScreen);

      if (
        currentStyleString !== lastSavedStyleRef.current ||
        currentTitleString !== lastSavedTitleRef.current ||
        currentWelcomeString !== lastSavedWelcomeRef.current
      ) {
        lastSavedStyleRef.current = currentStyleString;
        lastSavedTitleRef.current = currentTitleString;
        lastSavedWelcomeRef.current = currentWelcomeString;

        const timeoutId = setTimeout(() => {
          updateFormMutation.mutate({
            id: id,
            title: formTitle,
            description: formDescription,
            questions,
            style: formStyle,
            welcomeScreen,
          });
        }, 1000);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [
    formStyle,
    formTitle,
    welcomeScreen,
    isNewForm,
    isInitialized,
    formDescription,
    questions,
    updateFormMutation,
    id,
  ]);

  return (
    <>
      <BuilderHeader formId={id} isNewForm={isNewForm} />
      <div className="flex h-[calc(100vh-73px)]">
        <AddItemPanel />
        <QuestionList
          formId={id}
          isNewForm={isNewForm}
          onMobileSheetOpen={() => setShowSettingsSheet(true)}
        />
        <RightPanel />
      </div>
      <MobileSheets
        showAddSheet={showAddSheet}
        showSettingsSheet={showSettingsSheet}
        onAddSheetChange={setShowAddSheet}
        onSettingsSheetChange={setShowSettingsSheet}
      />
    </>
  );
}
