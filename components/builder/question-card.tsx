/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import type { Question } from "@/lib/local-data-service";
import { motion } from "framer-motion";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  index: number;
  isSelected: boolean;
  isCompact: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
  isDragging?: boolean;
  listeners?: any;
  attributes?: any;
  setNodeRef?: (node: HTMLElement | null) => void;
  style?: React.CSSProperties;
}

export function QuestionCard({
  question,
  index,
  isSelected,
  isCompact,
  onSelect,
  onUpdate,
  onDelete,
  isDragging,
  listeners,
  attributes,
  setNodeRef,
  style,
}: QuestionCardProps) {
  const renderQuestionPreview = () => {
    if (isCompact) {
      return null;
    }

    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="space-y-2">
            {question.options?.slice(0, 3).map((option, i) => (
              <div key={i} className="flex items-center gap-2 min-h-8">
                <div
                  className={`w-3 h-3 ${question.allowMultiple ? "rounded" : "rounded-full"} border-2 border-foreground shrink-0`}
                />
                <span className="text-xs text-gray-400">{option}</span>
              </div>
            ))}
            {question.options && question.options.length > 3 && (
              <span className="text-xs text-gray-600">
                +{question.options.length - 3} more
              </span>
            )}
          </div>
        );
      case "dropdown":
        return (
          <Select disabled>
            <SelectTrigger className="bg-accent border-gray-700 text-gray-500 min-h-10 text-sm">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
          </Select>
        );
      case "rating":
        return (
          <div className="flex gap-1">
            {Array.from({ length: Math.min(question.ratingScale || 5, 5) }).map(
              (_, i) => (
                <Star key={i} className="w-4 h-4 text-gray-600" />
              ),
            )}
          </div>
        );
      case "yes-no":
        return (
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-gray-600" />
              <span className="text-xs text-gray-400">Yes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-gray-600" />
              <span className="text-xs text-gray-400">No</span>
            </div>
          </div>
        );
      case "long-text":
        return (
          <div className="bg-accent border  rounded-lg p-2 min-h-16">
            <span className="text-xs text-gray-500">
              {question.placeholder || "Long answer"}
            </span>
          </div>
        );
      default:
        return (
          <div className="bg-accent border  rounded-lg p-2 min-h-10">
            <span className="text-xs text-gray-500">
              {question.placeholder || "Short answer"}
            </span>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      ref={setNodeRef}
      style={style}
    >
      <div
        className={`cursor-pointer transition-all bg-accent/30 backdrop-blur-xl  rounded-xl shadow  ${
          isSelected
            ? "ring-2 ring-primary"
            : "hover:ring-1 hover:ring-gray-600"
        } ${isCompact ? "p-3" : "p-6"} ${isDragging ? "opacity-50 scale-105 shadow-2xl shadow-indigo-500/20" : ""}`}
        onClick={onSelect}
      >
        <div className={`space-y-${isCompact ? "2" : "4"}`}>
          <div className="flex items-start justify-between gap-3">
            {!isCompact && (
              <div
                className="cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400 transition-colors"
                {...listeners}
                {...attributes}
                onClick={(e) => e.stopPropagation()}
              >
                <GripVertical className="w-4 h-4" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <Input
                value={question.label}
                onChange={(e) => {
                  e.stopPropagation();
                  onUpdate({ label: e.target.value });
                }}
                onClick={(e) => e.stopPropagation()}
                className={`${isCompact ? "text-sm" : "text-base"}`}
              />
              {!isCompact && question.description && (
                <p className="text-xs text-accent-foreground mt-1 line-clamp-2">
                  {question.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {isCompact ? (
                <span className="text-[10px] text-accent-foreground bg-secondary px-1.5 py-0.5 rounded">
                  {question.type.split("-")[0]}
                </span>
              ) : (
                <span className="text-xs text-accent-foreground px-2 py-1 rounded">
                  {question.type.replace("-", " ")}
                </span>
              )}
              {!isCompact && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                 
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          {renderQuestionPreview()}
        </div>
      </div>
    </motion.div>
  );
}
