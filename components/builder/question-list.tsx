"use client";

import { memo, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { DragOverlay } from "@dnd-kit/core";
import type {
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import type { Question } from "@/lib/local-data-service";
import { SortableQuestion } from "./sortable-question";
import { QuestionCard } from "./question-card";
import { useState } from "react";
import { useBuilderStore } from "@/lib/store/builder-store";
import { useUpdateForm } from "@/hooks/use-forms";
import { ScrollArea } from "../ui/scroll-area";

interface QuestionListProps {
  isNewForm: boolean;
  formId: string;

  onMobileSheetOpen?: () => void;
}

export const QuestionList = memo(function QuestionList({
  formId,
  isNewForm,

  onMobileSheetOpen,
}: QuestionListProps) {
  const [isMobile, setIsMobile] = useState(false);
  const updateFormMutation = useUpdateForm();
  const {
    formTitle,
    formDescription,
    questions,
    formStyle,
    welcomeScreen,
    selectedQuestion,
    rightPanelCollapsed,
    setSelectedQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
  } = useBuilderStore();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [localQuestions, setLocalQuestions] = useState<Question[]>(questions);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setLocalQuestions(questions);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setLocalQuestions((items) => {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderQuestions(active.id as string, over.id as string);
    }
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setLocalQuestions(questions);
  };

  const handleDelete = async (questionId: string) => {
    deleteQuestion(questionId);

    if (!isNewForm) {
      const updatedQuestions = questions.filter((q) => q.id !== questionId);
      await updateFormMutation.mutate({
        id: formId,
        title: formTitle,
        description: formDescription,
        questions: updatedQuestions.map((q, i) => ({ ...q, position: i })),
        style: formStyle,
        welcomeScreen,
      });
    }
  };

  const activeQuestion = activeId
    ? questions.find((q) => q.id === activeId)
    : null;

  const displayQuestions = activeId ? localQuestions : questions;

  return (
    <ScrollArea className="flex-1  ">
      <div className="max-w-2xl mx-auto space-y-4 mb-2 mt-4 px-4 md:px-0">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={displayQuestions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {displayQuestions.map((question, index) => (
              <SortableQuestion
                key={question.id}
                question={question}
                index={index}
                isSelected={selectedQuestion === question.id}
                isCompact={rightPanelCollapsed}
                onSelect={() => {
                  setSelectedQuestion(question.id);
                  if (isMobile && onMobileSheetOpen) {
                    onMobileSheetOpen();
                  }
                }}
                onUpdate={(updates) => updateQuestion(question.id, updates)}
                onDelete={() => handleDelete(question.id)}
              />
            ))}
          </SortableContext>
          <DragOverlay
            dropAnimation={{
              duration: 200,
              easing: "cubic-bezier(0.25, 1, 0.5, 1)",
            }}
          >
            {activeQuestion ? (
              <div className="rotate-2 scale-105">
                <QuestionCard
                  question={activeQuestion}
                  index={0}
                  isSelected={false}
                  isCompact={rightPanelCollapsed}
                  onSelect={() => { }}
                  onUpdate={() => { }}
                  onDelete={() => { }}
                  isDragging={true}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </ScrollArea>
  );
});
