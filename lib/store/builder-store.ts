import { create } from "zustand";
import type {
  Question,
  FormStyle,
  WelcomeScreen,
  LogicJump,
} from "@/lib/local-data-service";

interface BuilderState {
  formTitle: string;
  formDescription: string;
  questions: Question[];
  formStyle: FormStyle;
  welcomeScreen: WelcomeScreen;
  selectedQuestion: string;
  rightPanelMode: "settings" | "logic";
  rightPanelWidth: number;
  editingTitle: boolean;
  leftPanelCollapsed: boolean;
  rightPanelCollapsed: boolean;
  isInitialized: boolean;

  setFormTitle: (title: string) => void;
  setFormDescription: (description: string) => void;
  setQuestions: (questions: Question[]) => void;
  setFormStyle: (style: FormStyle) => void;
  setWelcomeScreen: (screen: WelcomeScreen) => void;
  setSelectedQuestion: (id: string) => void;
  setRightPanelMode: (mode: "settings" | "logic") => void;
  setRightPanelWidth: (width: number) => void;
  setEditingTitle: (editing: boolean) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  initializeForm: (data: {
    title: string;
    description: string;
    questions: Question[];
    style?: FormStyle;
    welcomeScreen?: WelcomeScreen;
  }) => void;

  updateQuestion: (id: string, updates: Partial<Question>) => void;
  addQuestion: (question: Question) => void;
  deleteQuestion: (id: string) => void;
  addOption: (questionId: string) => void;
  updateOption: (
    questionId: string,
    optionIndex: number,
    newValue: string,
  ) => void;
  deleteOption: (questionId: string, optionIndex: number) => void;
  reorderQuestions: (activeId: string, overId: string) => void;
  updateQuestionLogic: (id: string, logic: LogicJump) => void;
  reset: () => void;
}

const initialState = {
  formTitle: "Untitled Form",
  formDescription: "",
  questions: [],
  formStyle: {
    backgroundColor: "#1f2937",
    textColor: "#ffffff",
    buttonColor: "#4f46e5",
    buttonTextColor: "#ffffff",
    borderRadius: 12,
    fontFamily: "sans" as const,
  },
  welcomeScreen: {
    enabled: false,
    title: "Welcome to our survey",
    description:
      "Thank you for taking the time to complete this form. Your feedback is valuable to us.",
    buttonText: "Start",
    backgroundOpacity: 50,
    contentAlignment: "center" as const,
    splitScreen: false,
    showTimeEstimate: false,
    showRespondentCount: false,
  },
  selectedQuestion: "",
  rightPanelMode: "settings" as const,
  rightPanelWidth: 320,
  editingTitle: false,
  leftPanelCollapsed: false,
  rightPanelCollapsed: false,
  isInitialized: false,
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  ...initialState,

  setFormTitle: (title) => set({ formTitle: title }),
  setFormDescription: (description) => set({ formDescription: description }),
  setQuestions: (questions) => set({ questions }),
  setFormStyle: (style) => set({ formStyle: style }),
  setWelcomeScreen: (screen) => set({ welcomeScreen: screen }),
  setSelectedQuestion: (id) => set({ selectedQuestion: id }),
  setRightPanelMode: (mode) => set({ rightPanelMode: mode }),
  setRightPanelWidth: (width) => set({ rightPanelWidth: width }),
  setEditingTitle: (editing) => set({ editingTitle: editing }),
  toggleLeftPanel: () =>
    set((state) => ({ leftPanelCollapsed: !state.leftPanelCollapsed })),
  toggleRightPanel: () =>
    set((state) => ({ rightPanelCollapsed: !state.rightPanelCollapsed })),

  initializeForm: (data) => {
    const state = get();
    if (!state.isInitialized) {
      set({
        formTitle: data.title,
        formDescription: data.description,
        questions: data.questions,
        formStyle: data.style || initialState.formStyle,
        welcomeScreen: data.welcomeScreen || initialState.welcomeScreen,
        selectedQuestion: data.questions.length > 0 ? data.questions[0].id : "",
        isInitialized: true,
      });
    }
  },

  updateQuestion: (id, updates) =>
    set((state) => ({
      questions: state.questions.map((q) => {
        if (q.id !== id) return q;

        const updatedQuestion = { ...q, ...updates };

        if (updates.type && updates.type !== q.type) {
          const newType = updates.type;

          if (newType !== "multiple-choice" && newType !== "dropdown") {
            delete updatedQuestion.options;
            delete updatedQuestion.allowMultiple;
          }

          if (newType !== "rating") {
            delete updatedQuestion.ratingScale;
          }

          if (
            newType !== "short-text" &&
            newType !== "long-text" &&
            newType !== "email" &&
            newType !== "phone"
          ) {
            delete updatedQuestion.placeholder;
          }

          if (newType === "multiple-choice" || newType === "dropdown") {
            updatedQuestion.options = ["Option 1", "Option 2"];
          }

          if (newType === "multiple-choice") {
            updatedQuestion.allowMultiple = false;
          }

          if (newType === "rating") {
            updatedQuestion.ratingScale = 5;
          }
        }

        return updatedQuestion;
      }),
    })),

  addQuestion: (question) =>
    set((state) => ({
      questions: [...state.questions, question],
      selectedQuestion: question.id,
    })),

  deleteQuestion: (id) =>
    set((state) => {
      const updatedQuestions = state.questions.filter((q) => q.id !== id);
      return {
        questions: updatedQuestions,
        selectedQuestion:
          state.selectedQuestion === id
            ? updatedQuestions[0]?.id || ""
            : state.selectedQuestion,
      };
    }),

  addOption: (questionId) =>
    set((state) => ({
      questions: state.questions.map((q) => {
        if (q.id === questionId && q.options) {
          const newIndex = q.options.length + 1;
          return { ...q, options: [...q.options, `Option ${newIndex}`] };
        }
        return q;
      }),
    })),

  updateOption: (questionId, optionIndex, newValue) =>
    set((state) => ({
      questions: state.questions.map((q) => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = newValue;
          return { ...q, options: newOptions };
        }
        return q;
      }),
    })),

  deleteOption: (questionId, optionIndex) =>
    set((state) => ({
      questions: state.questions.map((q) => {
        if (q.id === questionId && q.options && q.options.length > 2) {
          return {
            ...q,
            options: q.options.filter((_, i) => i !== optionIndex),
          };
        }
        return q;
      }),
    })),

  reorderQuestions: (activeId, overId) =>
    set((state) => {
      const oldIndex = state.questions.findIndex((q) => q.id === activeId);
      const newIndex = state.questions.findIndex((q) => q.id === overId);

      if (oldIndex === -1 || newIndex === -1) return state;

      const newQuestions = [...state.questions];
      const [movedQuestion] = newQuestions.splice(oldIndex, 1);
      newQuestions.splice(newIndex, 0, movedQuestion);

      return { questions: newQuestions };
    }),

  updateQuestionLogic: (id, logic) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, logic } : q,
      ),
    })),

  reset: () => {
    set({ ...initialState });
  },
}));
