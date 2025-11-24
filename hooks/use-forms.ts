import { useState, useCallback, useEffect } from "react";
import {
  createForm,
  updateForm,
  deleteForm,
  getFormById
} from "@/actions/form-actions";
import { submitForm } from "@/actions/submission-actions";
import type { CreateFormInput, UpdateFormInput } from "@/lib/types/db";
import type { Form } from "@/lib/local-data-service";
import { useRouter } from "next/navigation";

// ============================================================================
// Form CRUD Hooks
// ============================================================================

/**
 * Hook to create a new form using server actions
 */
export function useCreateForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const mutate = useCallback(
    async (formData: CreateFormInput) => {
      setIsLoading(true);
      try {
        const result = await createForm(formData);

        if (!result.success) {
          throw new Error(result.error);
        }

        router.refresh();
        return result.data;
      } catch (error) {
        console.error("Error creating form:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return { mutate, isLoading };
}

/**
 * Hook to fetch a single form by ID
 */
export function useFormData(formId: string) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [notFound, setNotFound] = useState(false);

  const fetchData = useCallback(async () => {
    if (!formId || formId === "new") {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      setNotFound(false);
      const result = await getFormById(formId);

      if (!result.success) {
        if (result.error === "Form not found") {
          setNotFound(true);
          setData(null);
        } else {
          throw new Error(result.error);
        }
      } else {
        setData(result.data);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [formId]);

  // Fetch on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, notFound, refetch };
}

/**
 * Hook to update an existing form
 */
export function useUpdateForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const mutate = useCallback(
    async (formData: UpdateFormInput) => {
      setIsLoading(true);
      try {
        const result = await updateForm(formData);

        if (!result.success) {
          throw new Error(result.error);
        }

        router.refresh();
        return result.data;
      } catch (error) {
        console.error("Error updating form:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return { mutate, isLoading };
}

/**
 * Hook to delete a form
 */
export function useDeleteForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const mutate = useCallback(
    async (formId: string) => {
      setIsLoading(true);
      try {
        const result = await deleteForm(formId);

        if (!result.success) {
          throw new Error(result.error);
        }

        router.refresh();
        return result.data;
      } catch (error) {
        console.error("Error deleting form:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return { mutate, isLoading };
}

/**
 * Hook to duplicate a form
 * Note: This creates a copy by fetching the original and creating a new one
 */
export function useDuplicateForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const mutate = useCallback(
    async (formId: string) => {
      setIsLoading(true);
      try {
        // Fetch the original form
        const originalResult = await getFormById(formId);

        if (!originalResult.success) {
          throw new Error(originalResult.error);
        }

        const original = originalResult.data;

        // Create a duplicate
        const duplicateData: CreateFormInput = {
          title: `${original.title} (Copy)`,
          description: original.description,
          style: original.style as any,
          welcomeScreen: original.welcomeScreen as any,
          questions: original.questions.map((q) => ({
            type: q.type,
            label: q.label,
            description: q.description,
            placeholder: q.placeholder,
            required: q.required,
            options: q.options,
            allowMultiple: q.allowMultiple,
            ratingScale: q.ratingScale,
            position: q.position,
          })),
        };

        const result = await createForm(duplicateData);

        if (!result.success) {
          throw new Error(result.error);
        }

        router.refresh();
        return result.data;
      } catch (error) {
        console.error("Error duplicating form:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return { mutate, isLoading };
}

/**
 * Hook to submit a form (public - no auth)
 */
export function useSubmitForm() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(
    async ({
      formId,
      answers,
    }: {
      formId: string;
      answers: Record<string, string | string[]>;
    }) => {
      setIsLoading(true);
      try {
        const result = await submitForm({ formId, answers });

        if (!result.success) {
          throw new Error(result.error);
        }

        return result.data;
      } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { mutate, isLoading };
}
