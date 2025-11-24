"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LocalDataService, type Question } from "@/lib/local-data-service"
import { useFormData, useSubmitForm } from "@/hooks/use-forms"
import { trackFormEvent } from "@/actions/analytics-actions"
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
  initialData?: any
}


export default function Form({ id, initialData }: FormCProps) {
  const { data: fetchedData, isLoading: isFetching, notFound } = useFormData(id)

  const formData = initialData || fetchedData
  const isLoading = !initialData && isFetching
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

  const [visitId, setVisitId] = useState<string | null>(null)

  useEffect(() => {
    // Track View
    const trackView = async () => {
      try {
        const result = await trackFormEvent({ formId: id, event: "view" })
        if (result.success && result.data.visitId) {
          setVisitId(result.data.visitId)
        }
      } catch (error) {
        console.error("Failed to track view", error)
      }
    }
    trackView()
  }, [id])

  const trackStart = async () => {
    if (!visitId) return
    try {
      await trackFormEvent({ formId: id, visitId, event: "start" })
    } catch (error) {
      console.error("Failed to track start", error)
    }
  }

  const trackProgress = async (questionId: string) => {
    if (!visitId) return
    try {
      await trackFormEvent({ formId: id, visitId, event: "progress", data: { questionId } })
    } catch (error) {
      console.error("Failed to track progress", error)
    }
  }

  const trackComplete = async () => {
    if (!visitId) return
    try {
      await trackFormEvent({ formId: id, visitId, event: "complete" })
    } catch (error) {
      console.error("Failed to track complete", error)
    }
  }

  const handleNext = () => {
    const currentAnswer = answers[currentQuestion.id]
    if (currentQuestion.required && !currentAnswer) return

    // Track progress (question answered)
    trackProgress(currentQuestion.id)

    // If this is the first question and no welcome screen, or if we just started
    // Actually, start is better tracked when they actually start.
    // If welcome screen exists, start is tracked on onStart.
    // If not, start should be tracked on first interaction? 
    // Let's handle start in onStart prop or useEffect if no welcome screen.

    const logicDestination = evaluateLogic(
      currentQuestion,
      Array.isArray(currentAnswer) ? currentAnswer.join(",") : String(currentAnswer ?? ""),
    )
    if (logicDestination === "END_FORM") {
      handleSubmit()
      return
    }
    if (logicDestination) {
      const targetIndex = questions.findIndex((q: Question) => q.id === logicDestination)
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

    trackProgress(currentQuestion.id)
    trackComplete()

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

  // Handle Start tracking if no welcome screen
  useEffect(() => {
    if (!isLoading && !welcomeScreen?.enabled && visitId) {
      // If no welcome screen, we could consider "Start" as soon as they view? 
      // Or better, when they answer the first question.
      // But "Starts" usually means "Started filling it out".
      // If no welcome screen, the first question is visible immediately.
      // Let's track start when they interact with the first question?
      // Or just trigger it once on mount if no welcome screen?
      // Let's trigger it on first interaction (handleNext) if not already started?
      // Simplest: If no welcome screen, "View" is "Start"? No, that inflates starts.
      // Let's stick to: Start = Clicked "Start" on Welcome Screen OR Answered first question.
    }
  }, [isLoading, welcomeScreen, visitId])

  // We need a state to track if started
  const [hasStarted, setHasStarted] = useState(false)

  const handleStart = () => {
    setShowWelcome(false)
    if (!hasStarted) {
      setHasStarted(true)
      trackStart()
    }
  }

  // If no welcome screen, we need to track start on first answer
  const handleNextWithStart = () => {
    if (!hasStarted) {
      setHasStarted(true)
      trackStart()
    }
    handleNext()
  }

  const handleSubmitWithStart = () => {
    if (!hasStarted) {
      setHasStarted(true)
      trackStart()
    }
    handleSubmit()
  }

  if (isLoading) return <FormLoading />
  if (notFound) return null

  if (isSubmitted) return <ThankYouScreen formStyle={formStyle} />
  if (shouldShowWelcome && welcomeScreen) {
    return (
      <WelcomeScreen
        welcomeScreen={welcomeScreen}
        formStyle={formStyle}
        respondentCount={respondentCount}
        onStart={handleStart}
      />
    )
  }

  return (
    <div
      className={`min-h-screen flex flex-col font-${formStyle.fontFamily} relative overflow-hidden`}
      style={{ backgroundColor: formStyle.backgroundColor, color: formStyle.textColor }}
    >
      <ProgressBar progress={progress} color={formStyle.buttonColor} />
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 relative z-10 min-h-[80vh]">
        <div className="w-full max-w-2xl mx-auto">
          {/* Progress indicator moved to header in QuestionHeader, removing separate count here */}
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
            onNext={handleNextWithStart}
            onSubmit={handleSubmitWithStart}
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
