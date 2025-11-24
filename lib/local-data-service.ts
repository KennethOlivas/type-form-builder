export interface Question {
  id: string;
  type:
  | "short-text"
  | "long-text"
  | "multiple-choice"
  | "email"
  | "phone"
  | "date"
  | "rating"
  | "yes-no"
  | "dropdown"
  | "file-upload";
  label: string;
  description?: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  allowMultiple?: boolean;
  ratingScale?: number;
  position?: number;
  logic?: LogicJump; // Added logic jumps property
}

export interface WelcomeScreen {
  enabled: boolean;
  title: string;
  description: string;
  buttonText: string;
  logo?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  backgroundOpacity: number;
  contentAlignment: "left" | "center" | "right";
  splitScreen: boolean;
  showTimeEstimate: boolean;
  timeEstimate?: string;
  showRespondentCount: boolean;
}

export interface FormStyle {
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  borderRadius: number;
  fontFamily: "sans" | "serif" | "mono";
}

export interface Form {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  style: FormStyle;
  welcomeScreen?: WelcomeScreen;
  createdAt: string;
  updatedAt: string;
  responses?: number;
}

export interface FormMetadata {
  id: string;
  title: string;
  description: string;
  responses: number;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  formId: string;
  answers: Record<string, string | string[]>;
  submittedAt: string;
  device: string;
  location?: string;
}

export interface LogicRule {
  id: string;
  operator:
  | "is"
  | "is-not"
  | "contains"
  | "does-not-contain"
  | "starts-with"
  | "is-empty"
  | "is-not-empty"
  | "equals"
  | "not-equals"
  | "greater-than"
  | "less-than"
  | "between";
  value?: string | number;
  valueMax?: number; // For "between" operator
  destinationType: "next-question" | "specific-question" | "end-form";
  destinationQuestionId?: string;
}

export interface LogicJump {
  enabled: boolean;
  rules: LogicRule[];
  defaultDestinationType: "next-question" | "specific-question" | "end-form";
  defaultDestinationQuestionId?: string;
}

const FORMS_LIST_KEY = "TC_FORMS_LIST";
const FORM_KEY_PREFIX = "TC_FORM_";
const SUBMISSIONS_KEY_PREFIX = "TC_SUBMISSIONS_";

export class LocalDataService {
  // Forms Management
  static getAllFormsMetadata(): FormMetadata[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(FORMS_LIST_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getForm(formId: string): Form | null {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(`${FORM_KEY_PREFIX}${formId}`);
    return data ? JSON.parse(data) : null;
  }

  static createForm(form: Omit<Form, "id" | "createdAt" | "updatedAt">): Form {
    const newForm: Form = {
      ...form,
      style: form.style || {
        backgroundColor: "#1f2937",
        textColor: "#ffffff",
        buttonColor: "#4f46e5",
        buttonTextColor: "#ffffff",
        borderRadius: 12,
        fontFamily: "sans",
      },
      welcomeScreen: form.welcomeScreen || {
        enabled: false,
        title: "Welcome to our survey",
        description:
          "Thank you for taking the time to complete this form. Your feedback is valuable to us.",
        buttonText: "Start",
        backgroundOpacity: 50,
        contentAlignment: "center",
        splitScreen: false,
        showTimeEstimate: false,
        showRespondentCount: false,
      },
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save form
    localStorage.setItem(
      `${FORM_KEY_PREFIX}${newForm.id}`,
      JSON.stringify(newForm),
    );

    // Update metadata list
    const metadata: FormMetadata = {
      id: newForm.id,
      title: newForm.title,
      description: newForm.description,
      responses: 0,
      createdAt: newForm.createdAt,
      updatedAt: newForm.updatedAt,
    };
    const list = this.getAllFormsMetadata();
    list.push(metadata);
    localStorage.setItem(FORMS_LIST_KEY, JSON.stringify(list));

    return newForm;
  }

  static updateForm(formId: string, updates: Partial<Form>): Form | null {
    const form = this.getForm(formId);
    if (!form) return null;

    const updatedForm: Form = {
      ...form,
      ...updates,
      id: formId,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      `${FORM_KEY_PREFIX}${formId}`,
      JSON.stringify(updatedForm),
    );

    // Update metadata
    const list = this.getAllFormsMetadata();
    const index = list.findIndex((f) => f.id === formId);
    if (index !== -1) {
      list[index] = {
        ...list[index],
        title: updatedForm.title,
        description: updatedForm.description,
        updatedAt: updatedForm.updatedAt,
      };
      localStorage.setItem(FORMS_LIST_KEY, JSON.stringify(list));
    }

    return updatedForm;
  }

  static deleteForm(formId: string): boolean {
    localStorage.removeItem(`${FORM_KEY_PREFIX}${formId}`);
    localStorage.removeItem(`${SUBMISSIONS_KEY_PREFIX}${formId}`);

    const list = this.getAllFormsMetadata();
    const filtered = list.filter((f) => f.id !== formId);
    localStorage.setItem(FORMS_LIST_KEY, JSON.stringify(filtered));

    return true;
  }

  static duplicateForm(formId: string): Form | null {
    const form = this.getForm(formId);
    if (!form) return null;

    const duplicated = this.createForm({
      title: `${form.title} (Copy)`,
      description: form.description,
      questions: form.questions.map((q) => ({
        ...q,
        id: `${Date.now()}-${Math.random()}`,
      })),
      style: form.style,
      welcomeScreen: form.welcomeScreen,
    });

    return duplicated;
  }

  // Submissions Management
  static getSubmissions(formId: string): Submission[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(`${SUBMISSIONS_KEY_PREFIX}${formId}`);
    return data ? JSON.parse(data) : [];
  }

  static createSubmission(
    formId: string,
    answers: Record<string, string | string[]>,
  ): Submission {
    const submission: Submission = {
      id: `${Date.now()}-${Math.random()}`,
      formId,
      answers,
      submittedAt: new Date().toISOString(),
      device: /Mobile|Android|iPhone/i.test(navigator.userAgent)
        ? "Mobile"
        : "Desktop",
    };

    const submissions = this.getSubmissions(formId);
    submissions.push(submission);
    localStorage.setItem(
      `${SUBMISSIONS_KEY_PREFIX}${formId}`,
      JSON.stringify(submissions),
    );

    // Update response count
    const list = this.getAllFormsMetadata();
    const index = list.findIndex((f) => f.id === formId);
    if (index !== -1) {
      list[index].responses = submissions.length;
      localStorage.setItem(FORMS_LIST_KEY, JSON.stringify(list));
    }

    return submission;
  }

  static getSubmissionsCount(formId: string): number {
    return this.getSubmissions(formId).length;
  }
}
