"use client"
import { useCallback } from "react"
import type { Question } from "@/lib/local-data-service"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { ChevronDown, Star } from "lucide-react"

interface QuestionInputProps {
  question: Question
  answers: Record<string, string | string[]>
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string | string[]>>>
  handleKeyPress: (e: React.KeyboardEvent) => void
  formStyle: { textColor: string; buttonColor: string; buttonTextColor: string; borderRadius: number }
}

export function QuestionInput({ question, answers, setAnswers, handleKeyPress, formStyle }: QuestionInputProps) {
  const currentValue = answers[question.id]

  const updateAnswer = useCallback(
    (val: string | string[]) => {
      setAnswers(prev => ({ ...prev, [question.id]: val }))
    },
    [question.id, setAnswers]
  )

  switch (question.type) {
    case "short-text":
    case "email":
    case "phone":
    case "date":
      return (
        <Input
          type={question.type === "date" ? "date" : question.type === "email" ? "email" : "text"}
          placeholder={question.placeholder || "Your answer"}
          value={typeof currentValue === "string" ? currentValue : ""}
          onChange={e => updateAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          className="min-h-12 "
          style={{ color: formStyle.textColor }}
        />
      )
    case "long-text":
      return (
        <Textarea
          placeholder={question.placeholder || "Your answer"}
          value={typeof currentValue === "string" ? currentValue : ""}
            onChange={e => updateAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          className="min-h-32"
          style={{ color: formStyle.textColor }}
        />
      )
    case "multiple-choice":
      return (
        <div className="space-y-2">
          {question.options?.map(opt => {
            const selected = Array.isArray(currentValue)
              ? currentValue.includes(opt)
              : currentValue === opt
            return (
              <Button
                key={opt}
                type="button"
                variant={selected ? "default" : "outline"}
                onClick={() => {
                  if (question.allowMultiple) {
                    const arr = Array.isArray(currentValue) ? currentValue : []
                    updateAnswer(
                      selected ? arr.filter(o => o !== opt) : [...arr, opt]
                    )
                  } else {
                    updateAnswer(opt)
                  }
                }}
                className="w-full justify-start"
                style={selected ? { backgroundColor: formStyle.buttonColor, color: formStyle.buttonTextColor } : {}}
              >
                {opt}
              </Button>
            )
          })}
        </div>
      )
    case "dropdown":
      return (
        <Select
          value={typeof currentValue === "string" ? currentValue : undefined}
          onValueChange={val => updateAnswer(val)}
        >
          <SelectTrigger className="min-h-12 justify-between">
            <SelectValue placeholder={question.placeholder || "Select an option"} />
            <ChevronDown className="w-4 h-4 opacity-60" />
          </SelectTrigger>
          <SelectContent>
            {question.options?.map(opt => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    case "yes-no":
      return (
        <div className="flex gap-3">
          {(["Yes", "No"] as const).map(opt => (
            <Button
              key={opt}
              type="button"
              variant={currentValue === opt ? "default" : "outline"}
              onClick={() => updateAnswer(opt)}
              style={currentValue === opt ? { backgroundColor: formStyle.buttonColor, color: formStyle.buttonTextColor } : {}}
              className="px-6"
            >
              {opt}
            </Button>
          ))}
        </div>
      )
    case "rating":
      return (
        <div className="flex gap-2">
          {Array.from({ length: question.ratingScale || 5 }).map((_, i) => {
            const val = (i + 1).toString()
            const selected = currentValue === val
            return (
              <button
                key={val}
                onClick={() => updateAnswer(val)}
                className="group"
                aria-label={`Rate ${val}`}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${selected ? "text-yellow-400" : "text-gray-500 group-hover:text-gray-300"}`}
                  fill={selected ? "currentColor" : "none"}
                />
              </button>
            )
          })}
        </div>
      )
    case "file-upload":
      return (
        <div className="space-y-2">
          <Input
            type="file"
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) updateAnswer(file.name)
            }}
            className="bg-background/40"
          />
          {currentValue && typeof currentValue === "string" && (
            <div className="text-sm opacity-80" style={{ color: formStyle.textColor }}>
              Selected: {currentValue}
            </div>
          )}
        </div>
      )
    default:
      return null
  }
}
