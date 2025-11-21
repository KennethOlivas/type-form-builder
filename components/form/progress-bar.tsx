"use client"

import { motion } from "framer-motion"

interface ProgressBarProps {
  progress: number
  color: string
}

export function ProgressBar({ progress, color }: ProgressBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <motion.div
        className="h-1"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
      />
    </div>
  )
}