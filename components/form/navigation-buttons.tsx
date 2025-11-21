"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface NavigationButtonsProps {
  currentIndex: number
  total: number
  canProceed: boolean
  isLast: boolean
  formStyle: { buttonColor: string; buttonTextColor: string; borderRadius: number; textColor: string }
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
}

export function NavigationButtons({ currentIndex, /* total */ canProceed, isLast, formStyle, onPrevious, onNext, onSubmit }: NavigationButtonsProps) {
  return (
    <div className="mt-8 sm:mt-12 flex items-center justify-between gap-4">
      <Button
        onClick={onPrevious}
        disabled={currentIndex === 0}
        variant="ghost"
        className="disabled:opacity-30 min-h-12 px-4"
        style={{ color: formStyle.textColor }}
      >
        <ChevronLeft className="w-5 h-5 sm:mr-2" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      {isLast ? (
        <Button
          onClick={onSubmit}
          disabled={!canProceed}
          className="px-6 sm:px-8 disabled:opacity-50 min-h-12"
          style={{
            backgroundColor: formStyle.buttonColor,
            color: formStyle.buttonTextColor,
            borderRadius: `${formStyle.borderRadius}px`,
          }}
        >
          Submit
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="px-6 sm:px-8 disabled:opacity-50 min-h-12"
          style={{
            backgroundColor: formStyle.buttonColor,
            color: formStyle.buttonTextColor,
            borderRadius: `${formStyle.borderRadius}px`,
          }}
        >
          <span className="sm:mr-2">Next</span>
          <ChevronRight className="w-5 h-5 hidden sm:block" />
        </Button>
      )}
    </div>
  )
}