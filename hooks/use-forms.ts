import { useState, useCallback, useSyncExternalStore } from "react";
import { LocalDataService, type Form } from "@/lib/local-data-service";

// Custom event for form data changes
export const FORMS_UPDATED_EVENT = "formsUpdated";

function dispatchFormsUpdate() {
  window.dispatchEvent(new CustomEvent(FORMS_UPDATED_EVENT));
}

// Forms List Hook
export function useFormsList() {
  const [data, setData] = useState<Form[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/form", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch forms");
      }
      const forms = await res.json();
      console.log("Fetched forms:", forms);
      setData(forms.forms);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useSyncExternalStore(
    useCallback(
      (onStoreChange) => {
        fetchData().then(onStoreChange);
        const handler = () => {
          fetchData().then(onStoreChange);
        };
        window.addEventListener(FORMS_UPDATED_EVENT, handler);
        return () => window.removeEventListener(FORMS_UPDATED_EVENT, handler);
      },
      [fetchData],
    ),
    () => data,
    () => data,
  );

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
}

// Single Form Hook
export function useFormData(formId: string) {
  const [data, setData] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!formId || formId === "new") {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/form/${formId}`, {
        method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch form");
      }
      const formData = await res.json();
      setData(formData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [formId]);

  // Initial fetch
  useSyncExternalStore(
    useCallback(
      (onStoreChange) => {
        fetchData().then(onStoreChange);
        const handler = (e: Event) => {
          const customEvent = e as CustomEvent;
          if (!customEvent.detail || customEvent.detail === formId) {
            fetchData().then(onStoreChange);
          }
        };
        window.addEventListener(FORMS_UPDATED_EVENT, handler);
        return () => window.removeEventListener(FORMS_UPDATED_EVENT, handler);
      },
      [fetchData, formId],
    ),
    () => data,
    () => data,
  );

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
}

// Create Form Action
export function useCreateForm() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(
    async (form: Omit<Form, "id" | "createdAt" | "updatedAt">) => {
      setIsLoading(true);
      try {
        // const newForm = LocalDataService.createForm(form);
        const res = await fetch("/api/form", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formData: form }),
        });
        dispatchFormsUpdate();
        setIsLoading(false);
        return res.json();
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    [],
  );

  return { mutate, isLoading };
}

// Update Form Action
export function useUpdateForm() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(
    async ({ id, ...updates }: { id: string } & Partial<Form>) => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/form/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ formData: updates }),
        });
        if (!res.ok) {
          throw new Error("Failed to update form");
        }
        dispatchFormsUpdate();
        window.dispatchEvent(
          new CustomEvent(FORMS_UPDATED_EVENT, { detail: id }),
        );
        setIsLoading(false);
        return await res.json();
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    [],
  );

  return { mutate, isLoading };
}

// Delete Form Action
export function useDeleteForm() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(async (formId: string) => {
    setIsLoading(true);
    try {
      await fetch(`/api/form/${formId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      dispatchFormsUpdate();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  return { mutate, isLoading };
}

// Duplicate Form Action
export function useDuplicateForm() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = useCallback(async (formId: string) => {
    setIsLoading(true);
    try {
      const duplicatedForm = LocalDataService.duplicateForm(formId);
      dispatchFormsUpdate();
      setIsLoading(false);
      return duplicatedForm;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  }, []);

  return { mutate, isLoading };
}

// Submissions Hook
export function useSubmissions(formId: string) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const handler = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (!customEvent.detail || customEvent.detail === formId) {
          onStoreChange();
        }
      };
      window.addEventListener(FORMS_UPDATED_EVENT, handler);
      return () => window.removeEventListener(FORMS_UPDATED_EVENT, handler);
    },
    [formId],
  );

  const data = useSyncExternalStore<
    ReturnType<typeof LocalDataService.getSubmissions>
  >(
    subscribe,
    () => (formId ? LocalDataService.getSubmissions(formId) : []),
    () => (formId ? LocalDataService.getSubmissions(formId) : []),
  );

  const isLoading = false;
  const refetch = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent(FORMS_UPDATED_EVENT, { detail: formId }),
    );
  }, [formId]);

  return { data, isLoading, refetch };
}

// Submit Form Action
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
        const submission = LocalDataService.createSubmission(formId, answers);
        dispatchFormsUpdate();
        setIsLoading(false);
        return submission;
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    [],
  );

  return { mutate, isLoading };
}
