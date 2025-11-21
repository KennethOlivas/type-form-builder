"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

interface ThankYouScreenProps {
  formStyle: { backgroundColor: string; textColor: string; buttonColor: string }
}

export function ThankYouScreen({ formStyle }: ThankYouScreenProps) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: formStyle.backgroundColor, color: formStyle.textColor }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center shrink-0 transition-colors"
          style={{ backgroundColor: `${formStyle.buttonColor}33` }}
        >
          <CheckCircle2 className="w-12 h-12" style={{ color: formStyle.buttonColor }} />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold mb-4"
          style={{ color: formStyle.textColor }}
        >
          Thank you!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl opacity-70"
          style={{ color: formStyle.textColor }}
        >
          Your response has been recorded successfully.
        </motion.p>
      </motion.div>
    </div>
  )
}