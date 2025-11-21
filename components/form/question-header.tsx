"use client"
import { motion } from "framer-motion"

interface QuestionHeaderProps {
  questionLabel: string
  description?: string
  required: boolean
  formStyle: { textColor: string }
  currentIndex: number
  total: number
}

export function QuestionHeader({ questionLabel, description, required, formStyle, currentIndex, total }: QuestionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-2"
    >
      <h2
        className="text-xl sm:text-2xl font-semibold tracking-tight"
        style={{ color: formStyle.textColor }}
      >
        {questionLabel}{required && <span className="text-red-400 ml-1">*</span>}
      </h2>
      {description && (
        <p className="text-sm opacity-80" style={{ color: formStyle.textColor }}>
          {description}
        </p>
      )}
      <div className="text-xs opacity-60" style={{ color: formStyle.textColor }}>
        Question {currentIndex + 1} / {total}
      </div>
    </motion.div>
  )
}
