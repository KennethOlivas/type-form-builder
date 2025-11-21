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
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-4 mb-8"
    >
      <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-widest opacity-60 mb-4" style={{ color: formStyle.textColor }}>
        <span>{currentIndex + 1} <span className="mx-1">/</span> {total}</span>
        <span className="flex-1 h-px bg-current opacity-20"></span>
      </div>

      <h2
        className="text-2xl sm:text-3xl md:text-4xl font-light leading-tight"
        style={{ color: formStyle.textColor }}
      >
        {questionLabel}{required && <span className="text-red-400 ml-1 text-lg align-top">*</span>}
      </h2>

      {description && (
        <p className="text-lg sm:text-xl opacity-70 font-light max-w-2xl" style={{ color: formStyle.textColor }}>
          {description}
        </p>
      )}
    </motion.div>
  )
}
