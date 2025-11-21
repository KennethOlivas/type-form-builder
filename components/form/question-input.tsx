"use client"
import { useCallback, useState } from "react"
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
  const [emailError, setEmailError] = useState<string>("")

  const updateAnswer = useCallback(
    (val: string | string[]) => {
      setAnswers(prev => ({ ...prev, [question.id]: val }))
      if (question.type === "email" && emailError) {
        setEmailError("")
      }
    },
    [question.id, setAnswers, question.type, emailError]
  )

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (question.type === "email") {
      if (e.target.value && !validateEmail(e.target.value)) {
        setEmailError("Please enter a valid email address")
      } else {
        setEmailError("")
      }
    }
  }

  switch (question.type) {
    case "short-text":
    case "email":
    case "phone":
    case "date":
      return (
        <div className="space-y-2">
          <Input
            type={question.type === "date" ? "date" : question.type === "email" ? "email" : "text"}
            placeholder={question.placeholder || "Type your answer here..."}
            value={typeof currentValue === "string" ? currentValue : ""}
            onChange={e => updateAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={handleBlur}
            className="min-h-14 text-2xl sm:text-3xl border-0 border-b-2 border-gray-200 rounded-none px-4 focus-visible:ring-0 focus-visible:border-black transition-colors bg-transparent placeholder:text-gray-300"
            style={{
              color: formStyle.textColor,
              borderColor: emailError ? "red" : (currentValue ? formStyle.buttonColor : undefined)
            }}
          />
          {emailError && (
            <p className="text-red-500 text-sm animate-in slide-in-from-top-1 fade-in">
              {emailError}
            </p>
          )}
        </div>
      )
    case "long-text":
      return (
        <Textarea
          placeholder={question.placeholder || "Type your answer here..."}
          value={typeof currentValue === "string" ? currentValue : ""}
          onChange={e => updateAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          className="min-h-40 text-xl sm:text-2xl border-0 border-b-2 border-gray-200 rounded-none px-4 py-2 focus-visible:ring-0 focus-visible:border-black transition-colors bg-transparent resize-none placeholder:text-gray-300"
          style={{
            color: formStyle.textColor,
            borderColor: currentValue ? formStyle.buttonColor : undefined
          }}
        />
      )
    case "multiple-choice":
      return (
        <div className="space-y-3">
          {question.options?.map((opt, index) => {
            const selected = Array.isArray(currentValue)
              ? currentValue.includes(opt)
              : currentValue === opt
            const letter = String.fromCharCode(65 + index) // A, B, C...

            return (
              <div
                key={opt}
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
                className={"w-full group flex items-center gap-3 p-2 pl-3 pr-4 rounded-md border-2 cursor-pointer transition-all duration-200"}
                style={{
                  borderColor: selected ? formStyle.buttonColor : "rgba(229, 231, 235, 0.5)",
                  backgroundColor: selected ? `${formStyle.buttonColor}1A` : undefined // 10% opacity
                }}
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded border text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: selected ? formStyle.buttonColor : "transparent",
                    borderColor: selected ? formStyle.buttonColor : "rgba(156, 163, 175, 0.5)",
                    color: selected ? formStyle.buttonTextColor : formStyle.textColor
                  }}
                >
                  {letter}
                </div>
                <span className="text-xl flex-1" style={{ color: formStyle.textColor }}>{opt}</span>
                {selected && (
                  <div className="text-current">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke={formStyle.buttonColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
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
          <SelectTrigger
            className="w-full text-2xl sm:text-3xl border-0 border-b-2 border-gray-200 rounded-none px-0 focus:ring-0 focus:border-black bg-transparent h-auto py-2"
            style={{ color: formStyle.textColor }}
          >
            <SelectValue placeholder={question.placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent>
            {question.options?.map(opt => (
              <SelectItem key={opt} value={opt} className="text-lg py-3">
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    case "yes-no":
      return (
        <div className="flex gap-4">
          {(["Yes", "No"] as const).map((opt, index) => {
            const selected = currentValue === opt
            const letter = index === 0 ? "Y" : "N"
            return (
              <div
                key={opt}
                onClick={() => updateAnswer(opt)}
                className={`
                  flex items-center gap-3 p-2 pl-3 pr-6 rounded-md border-2 cursor-pointer transition-all duration-200 min-w-[140px]
                  ${selected ? 'bg-opacity-10' : 'bg-transparent'}
                `}
                style={{
                  borderColor: selected ? formStyle.buttonColor : "rgba(229, 231, 235, 0.5)",
                  backgroundColor: selected ? `${formStyle.buttonColor}1A` : undefined
                }}
              >
                <div
                  className="flex items-center justify-center w-8 h-8 rounded border text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: selected ? formStyle.buttonColor : "transparent",
                    borderColor: selected ? formStyle.buttonColor : "rgba(156, 163, 175, 0.5)",
                    color: selected ? formStyle.buttonTextColor : formStyle.textColor
                  }}
                >
                  {letter}
                </div>
                <span className="text-xl" style={{ color: formStyle.textColor }}>{opt}</span>
              </div>
            )
          })}
        </div>
      )
    case "rating":
      return (
        <div className="flex gap-2">
          {Array.from({ length: question.ratingScale || 5 }).map((_, i) => {
            const val = (i + 1).toString()
            // Fix: Check if the current star index is less than or equal to the selected value
            const isSelected = currentValue ? parseInt(currentValue as string) >= i + 1 : false

            return (
              <button
                key={val}
                onClick={() => updateAnswer(val)}
                className="group p-1 transition-transform hover:scale-110 focus:outline-none"
                aria-label={`Rate ${val}`}
                type="button"
              >
                <Star
                  className={`w-10 h-10 sm:w-12 sm:h-12 transition-colors duration-200`}
                  style={{
                    color: isSelected ? formStyle.buttonColor : "rgba(156, 163, 175, 0.3)",
                    fill: isSelected ? formStyle.buttonColor : "none"
                  }}
                />
              </button>
            )
          })}
        </div>
      )
    case "file-upload":
      return (
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50/10 transition-colors"
            style={{ borderColor: formStyle.buttonColor }}>
            <Input
              type="file"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) updateAnswer(file.name)
              }}
              className="w-full h-full opacity-0 cursor-pointer"
            />
            <div className="absolute pointer-events-none flex flex-col items-center">
              <span className="text-lg font-medium" style={{ color: formStyle.buttonColor }}>Choose a file</span>
              <span className="text-sm opacity-60" style={{ color: formStyle.textColor }}>or drag it here</span>
            </div>
          </div>
          {currentValue && typeof currentValue === "string" && (
            <div className="flex items-center gap-2 text-lg" style={{ color: formStyle.textColor }}>
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Selected: {currentValue}
            </div>
          )}
        </div>
      )
    default:
      return null
  }
}
