"use client";

import { memo } from "react";
import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Question } from "@/lib/local-data-service";
import { QuestionCard } from "./question-card";
import type { AnimateLayoutChanges } from "@dnd-kit/sortable";

interface SortableQuestionProps {
  question: Question;
  index: number;
  isSelected: boolean;
  isCompact: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
}

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
  const { isSorting, wasDragging } = args;

  // Always animate layout changes during sorting
  if (isSorting || wasDragging) {
    return defaultAnimateLayoutChanges(args);
  }

  return true;
};

export const SortableQuestion = memo(function SortableQuestion({
  question,
  index,
  isSelected,
  isCompact,
  onSelect,
  onUpdate,
  onDelete,
}: SortableQuestionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: question.id,
    animateLayoutChanges,
    transition: {
      duration: 250,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 250ms cubic-bezier(0.25, 1, 0.5, 1)",
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <QuestionCard
      question={question}
      index={index}
      isSelected={isSelected}
      isCompact={isCompact}
      onSelect={onSelect}
      onUpdate={onUpdate}
      onDelete={onDelete}
      isDragging={isDragging}
      listeners={listeners}
      attributes={attributes}
      setNodeRef={setNodeRef}
      style={style}
    />
  );
});
