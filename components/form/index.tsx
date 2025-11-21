"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LocalDataService, type Question } from "@/lib/local-data-service"
import { useFormData, useSubmitForm } from "@/hooks/use-forms"
import { FormLoading } from "@/components/form/form-loading"

import { WelcomeScreen } from "@/components/form/welcome-screen"
import { ThankYouScreen } from "@/components/form/thank-you-screen"
import { ProgressBar } from "@/components/form/progress-bar"
import { NavigationButtons } from "@/components/form/navigation-buttons"
import { QuestionHeader } from "./question-header"
import { QuestionInput } from "./question-input"
import { useRouter } from "next/navigation"


interface FormCProps {
  id: string
}


export default function Form({ id }: FormCProps) {
  const { data: formData, isLoading, notFound } = useFormData(id)
  const submitFormMutation = useSubmitForm()
  const router = useRouter()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [direction, setDirection] = useState(1)
  const [showWelcome, setShowWelcome] = useState(true)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})

  const questions = formData?.questions || []
  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  const formStyle = formData?.style || {
    backgroundColor: "#1f2937",
    textColor: "#ffffff",
    buttonColor: "#4f46e5",
    buttonTextColor: "#ffffff",
    borderRadius: 12,
    fontFamily: "sans",
  }

  const welcomeScreen = formData?.welcomeScreen
  const shouldShowWelcome = welcomeScreen?.enabled && showWelcome
  const respondentCount = formData ? LocalDataService.getSubmissionsCount(id) : 0

  useEffect(() => {
    // reserved for style side-effects if needed
  }, [formData])

  const handleNext = () => {
    const currentAnswer = answers[currentQuestion.id]
    if (currentQuestion.required && !currentAnswer) return
    const logicDestination = evaluateLogic(
      currentQuestion,
      Array.isArray(currentAnswer) ? currentAnswer.join(",") : String(currentAnswer ?? ""),
    )
    if (logicDestination === "END_FORM") {
      handleSubmit()
      return
    }
    if (logicDestination) {
      const targetIndex = questions.findIndex(q => q.id === logicDestination)
      if (targetIndex !== -1 && targetIndex > currentQuestionIndex) {
        setDirection(1)
        setCurrentQuestionIndex(targetIndex)
        return
      }
    }
    if (currentQuestionIndex < questions.length - 1) {
      setDirection(1)
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1)
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = () => {
    const currentAnswer = answers[currentQuestion.id]
    if (currentQuestion.required && !currentAnswer) return
    submitFormMutation.mutate({ formId: id, answers })
    setIsSubmitted(true)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (currentQuestionIndex === questions.length - 1) handleSubmit()
      else handleNext()
    }
  }

  useEffect(() => {
    if (notFound) {
      router.replace("/not-found")
    }
  }, [notFound, router])

  if (isLoading) return <FormLoading />
  if (notFound) return null

  if (isSubmitted) return <ThankYouScreen formStyle={formStyle} />
  if (shouldShowWelcome && welcomeScreen) {
    return (
      <WelcomeScreen
        welcomeScreen={welcomeScreen}
        formStyle={formStyle}
        respondentCount={respondentCount}
        onStart={() => setShowWelcome(false)}
      />
    )
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-${formStyle.fontFamily} relative overflow-hidden`}
      style={{ backgroundColor: formStyle.backgroundColor, color: formStyle.textColor }}
    >
      <ProgressBar progress={progress} color={formStyle.buttonColor} />
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 relative z-10">
        <div className="w-full max-w-3xl">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 sm:mb-6 text-center">
            <span className="text-xs sm:text-sm opacity-60" style={{ color: formStyle.textColor }}>
              {currentQuestionIndex + 1} of {questions.length}
            </span>
          </motion.div>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -100 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="space-y-6 sm:space-y-8"
            >
              <QuestionHeader
                questionLabel={currentQuestion.label}
                description={currentQuestion.description}
                required={currentQuestion.required}
                formStyle={formStyle}
                currentIndex={currentQuestionIndex}
                total={questions.length}
              />
              <QuestionInput
                question={currentQuestion}
                answers={answers}
                setAnswers={setAnswers}
                handleKeyPress={handleKeyPress}
                formStyle={formStyle}
              />
            </motion.div>
          </AnimatePresence>
          <NavigationButtons
            currentIndex={currentQuestionIndex}
            total={questions.length}
            canProceed={!(currentQuestion.required && !answers[currentQuestion.id])}
            isLast={currentQuestionIndex === questions.length - 1}
            formStyle={formStyle}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}

const evaluateLogic = (question: Question, answer: string): string | null => {
  if (!question.logic?.enabled || !question.logic.rules.length) return null
  for (const rule of question.logic.rules) {
    let ruleMatches = false
    switch (rule.operator) {
      case "is": ruleMatches = answer === rule.value; break
      case "is-not": ruleMatches = answer !== rule.value; break
      case "contains": ruleMatches = answer.toLowerCase().includes(String(rule.value).toLowerCase()); break
      case "does-not-contain": ruleMatches = !answer.toLowerCase().includes(String(rule.value).toLowerCase()); break
      case "starts-with": ruleMatches = answer.toLowerCase().startsWith(String(rule.value).toLowerCase()); break
      case "is-empty": ruleMatches = !answer || answer.trim() === ""; break
      case "is-not-empty": ruleMatches = !!answer && answer.trim() !== ""; break
      case "equals": ruleMatches = Number(answer) === Number(rule.value); break
      case "not-equals": ruleMatches = Number(answer) !== Number(rule.value); break
      case "greater-than": ruleMatches = Number(answer) > Number(rule.value); break
      case "less-than": ruleMatches = Number(answer) < Number(rule.value); break
      case "between": ruleMatches = Number(answer) >= Number(rule.value) && Number(answer) <= Number(rule.valueMax); break
    }
    if (ruleMatches) {
      if (rule.destinationType === "end-form") return "END_FORM"
      if (rule.destinationType === "specific-question") return rule.destinationQuestionId || null
      return null
    }
  }
  if (question.logic.defaultDestinationType === "end-form") return "END_FORM"
  if (question.logic.defaultDestinationType === "specific-question") return question.logic.defaultDestinationQuestionId || null
  return null
}
