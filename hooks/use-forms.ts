import { useState, useCallback, useSyncExternalStore, useRef } from "react"
import { LocalDataService, type Form } from "@/lib/local-data-service"

// Custom event for form data changes
export const FORMS_UPDATED_EVENT = "formsUpdated"

function dispatchFormsUpdate() {
  window.dispatchEvent(new CustomEvent(FORMS_UPDATED_EVENT))
}

// Forms List Hook
export function useFormsList() {
  const cacheRef = useRef<ReturnType<typeof LocalDataService.getAllFormsMetadata> | null>(null)

  const subscribe = useCallback((onStoreChange: () => void) => {
    const handler = () => onStoreChange()
    window.addEventListener(FORMS_UPDATED_EVENT, handler)
    return () => window.removeEventListener(FORMS_UPDATED_EVENT, handler)
  }, [])

  const getSnapshot = useCallback(() => {
    const next = LocalDataService.getAllFormsMetadata()
    const prev = cacheRef.current
    if (
      prev &&
      prev.length === next.length &&
      prev.every((item, idx) => item === next[idx])
    ) {
      return prev
    }
    cacheRef.current = next
    return next
  }, [])

  const data = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot
  )

  const isLoading = false
  const refetch = useCallback(() => {
    // Trigger a re-read of the snapshot by dispatching the update event
    dispatchFormsUpdate()
  }, [])

  return { data, isLoading, refetch }
}

// Single Form Hook
export function useFormData(formId: string) {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent
      if (!customEvent.detail || customEvent.detail === formId) {
        onStoreChange()
      }
    }
    window.addEventListener(FORMS_UPDATED_EVENT, handler)
    return () => window.removeEventListener(FORMS_UPDATED_EVENT, handler)
  }, [formId])

  const data = useSyncExternalStore<Form | null>(
    subscribe,
    () => {
      if (!formId || formId === "new") return null
      return LocalDataService.getForm(formId)
    },
    () => {
      if (!formId || formId === "new") return null
      return LocalDataService.getForm(formId)
    }
  )

  const isLoading = false
  const refetch = useCallback(() => {
    // Trigger a re-read of the snapshot by dispatching a targeted update
    window.dispatchEvent(new CustomEvent(FORMS_UPDATED_EVENT, { detail: formId }))
  }, [formId])

  return { data, isLoading, refetch }
}

// Create Form Action
export function useCreateForm() {
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(async (form: Omit<Form, "id" | "createdAt" | "updatedAt">) => {
    setIsLoading(true)
    try {
      const newForm = LocalDataService.createForm(form)
      dispatchFormsUpdate()
      setIsLoading(false)
      return newForm
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }, [])

  return { mutate, isLoading }
}

// Update Form Action
export function useUpdateForm() {
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(async ({ id, ...updates }: { id: string } & Partial<Form>) => {
    setIsLoading(true)
    try {
      const updatedForm = LocalDataService.updateForm(id, updates)
      dispatchFormsUpdate()
      window.dispatchEvent(new CustomEvent(FORMS_UPDATED_EVENT, { detail: id }))
      setIsLoading(false)
      return updatedForm
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }, [])

  return { mutate, isLoading }
}

// Delete Form Action
export function useDeleteForm() {
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(async (formId: string) => {
    setIsLoading(true)
    try {
      LocalDataService.deleteForm(formId)
      dispatchFormsUpdate()
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }, [])

  return { mutate, isLoading }
}

// Duplicate Form Action
export function useDuplicateForm() {
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(async (formId: string) => {
    setIsLoading(true)
    try {
      const duplicatedForm = LocalDataService.duplicateForm(formId)
      dispatchFormsUpdate()
      setIsLoading(false)
      return duplicatedForm
    } catch (error) {
      setIsLoading(false)
      throw error
    }
  }, [])

  return { mutate, isLoading }
}

// Submissions Hook
export function useSubmissions(formId: string) {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent
      if (!customEvent.detail || customEvent.detail === formId) {
        onStoreChange()
      }
    }
    window.addEventListener(FORMS_UPDATED_EVENT, handler)
    return () => window.removeEventListener(FORMS_UPDATED_EVENT, handler)
  }, [formId])

  const data = useSyncExternalStore<ReturnType<typeof LocalDataService.getSubmissions>>(
    subscribe,
    () => (formId ? LocalDataService.getSubmissions(formId) : []),
    () => (formId ? LocalDataService.getSubmissions(formId) : [])
  )

  const isLoading = false
  const refetch = useCallback(() => {
    window.dispatchEvent(new CustomEvent(FORMS_UPDATED_EVENT, { detail: formId }))
  }, [formId])

  return { data, isLoading, refetch }
}

// Submit Form Action
export function useSubmitForm() {
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(
    async ({ formId, answers }: { formId: string; answers: Record<string, string | string[]> }) => {
      setIsLoading(true)
      try {
        const submission = LocalDataService.createSubmission(formId, answers)
        dispatchFormsUpdate()
        setIsLoading(false)
        return submission
      } catch (error) {
        setIsLoading(false)
        throw error
      }
    },
    []
  )

  return { mutate, isLoading }
}
