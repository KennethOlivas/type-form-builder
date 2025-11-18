"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Type, List, Mail, Phone, Calendar, MessageSquare, Star, CheckSquare, ChevronDown, Upload, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Question } from "@/lib/local-data-service"
import { useBuilderStore } from "@/lib/store/builder-store"

const questionTypes = [
  { value: "short-text", label: "Short Text", icon: Type },
  { value: "long-text", label: "Long Text", icon: MessageSquare },
  { value: "multiple-choice", label: "Multiple Choice", icon: List },
  { value: "rating", label: "Rating Scale", icon: Star },
  { value: "yes-no", label: "Yes/No", icon: CheckSquare },
  { value: "dropdown", label: "Dropdown", icon: ChevronDown },
  { value: "email", label: "Email", icon: Mail },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "date", label: "Date", icon: Calendar },
  { value: "file-upload", label: "File Upload", icon: Upload },
]

interface AddItemPanelProps {

  isMobile?: boolean
}

export function AddItemPanel({  isMobile = false }: AddItemPanelProps) {
  const { leftPanelCollapsed, toggleLeftPanel, addQuestion } = useBuilderStore()

    const addItem = (type: Question["type"]) => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type,
      label: "New Question",
      placeholder: "",
      required: false,
      ...(type === "multiple-choice" || type === "dropdown" ? { options: ["Option 1", "Option 2"] } : {}),
      ...(type === "multiple-choice" ? { allowMultiple: false } : {}),
      ...(type === "rating" ? { ratingScale: 5 } : {}),
    }
    addQuestion(newQuestion)
    // setShowAddSheet(false)
  }

  if (isMobile) {
    return (
      <div className="space-y-2">
        {questionTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => addItem(type.value as Question["type"])}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-muted hover:bg-accent border border-border transition-all text-left"
          >
            <type.icon className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-foreground">{type.label}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div
      className={`hidden lg:flex flex-col border-r border-border overflow-hidden bg-card/50 backdrop-blur-xl transition-all duration-300 ${
        leftPanelCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!leftPanelCollapsed && <h2 className="text-sm font-semibold text-muted-foreground uppercase">Add Item</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleLeftPanel}
          className="text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          {leftPanelCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Question Types */}
      <div className="flex-1 overflow-y-auto p-4">
        <TooltipProvider>
          <div className="space-y-2">
            {questionTypes.map((type) => (
              <Tooltip key={type.value} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => addItem(type.value as Question["type"])}
                    className={`w-full flex items-center rounded-lg bg-muted hover:bg-accent border border-border hover:border-primary/50 transition-all group ${
                      leftPanelCollapsed ? "justify-center py-3 px-2" : "gap-3 px-4 py-3"
                    }`}
                  >
                    <type.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    {!leftPanelCollapsed && (
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors text-left">
                        {type.label}
                      </span>
                    )}
                  </button>
                </TooltipTrigger>
                {leftPanelCollapsed && (
                  <TooltipContent side="right">
                    {type.label}
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </div>
  )
}
