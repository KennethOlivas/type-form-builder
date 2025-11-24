import { z } from "zod";
import {
    formStyleSchema,
    welcomeScreenSchema,
    questionSchema,
    createFormSchema,
    updateFormSchema,
    submissionAnswersSchema,
    submitFormSchema,
    trackEventSchema,
    analyticsDateRangeSchema,
} from "@/lib/validations/schema";

// ============================================================================
// Inferred Types from Zod Schemas
// ============================================================================
export type FormStyle = z.infer<typeof formStyleSchema>;
export type WelcomeScreen = z.infer<typeof welcomeScreenSchema>;
export type Question = z.infer<typeof questionSchema>;
export type QuestionType = Question["type"];

export type CreateFormInput = z.infer<typeof createFormSchema>;
export type UpdateFormInput = z.infer<typeof updateFormSchema>;

export type SubmissionAnswers = z.infer<typeof submissionAnswersSchema>;
export type SubmitFormInput = z.infer<typeof submitFormSchema>;

export type TrackEventInput = z.infer<typeof trackEventSchema>;
export type AnalyticsDateRangeInput = z.infer<typeof analyticsDateRangeSchema>;

// ============================================================================
// Database Types (from schema)
// ============================================================================
export interface DbForm {
    id: string;
    title: string;
    description: string;
    style: FormStyle;
    welcomeScreen: WelcomeScreen | null;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface DbQuestion {
    id: string;
    formId: string;
    type: string;
    label: string;
    description: string | null;
    placeholder: string | null;
    required: boolean;
    options: unknown; // jsonb
    allowMultiple: boolean | null;
    ratingScale: number | null;
    position: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface DbSubmission {
    id: string;
    formId: string;
    answers: SubmissionAnswers;
    submittedAt: Date;
    device: string;
    location: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface DbFormVisit {
    id: string;
    formId: string;
    device: string | null;
    browser: string | null;
    os: string | null;
    ip: string | null;
    country: string | null;
    startedAt: Date | null;
    completedAt: Date | null;
    lastInteractionAt: Date;
    lastQuestionId: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface DbWorkspace {
    id: string;
    name: string;
    icon: string;
    type: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface DbWorkspaceForm {
    id: string;
    workspaceId: string;
    formId: string;
    createdAt: Date;
}

// ============================================================================
// API Response Types
// ============================================================================
export interface FormWithResponses extends DbForm {
    responses: number;
}

export interface FormWithQuestions extends DbForm {
    questions: Question[];
}

export interface WorkspaceWithFormCount extends DbWorkspace {
    formCount: number;
}

export interface AnalyticsKPI {
    views: number;
    starts: number;
    submissions: number;
    completionRate: number;
    avgTime: number;
}

export interface AnalyticsChartData {
    deviceBreakdown: Array<{ name: string; value: number }>;
    responseTimeline: Array<{ date: string; count: number }>;
    funnel: Array<{ name: string; value: number }>;
}

export interface AnalyticsQuestionData {
    type: string;
    recent?: string[];
    counts?: Record<string, number>;
    average?: number;
}

export interface AnalyticsResponse {
    form: {
        title: string;
        questions: DbQuestion[];
    };
    kpi: AnalyticsKPI;
    charts: AnalyticsChartData;
    questionAnalysis: Record<string, AnalyticsQuestionData>;
    submissions: DbSubmission[];
}

// ============================================================================
// Server Action Response Types
// ============================================================================
export type ActionResponse<T> =
    | { success: true; data: T }
    | { success: false; error: string };

export type FormActionResponse = ActionResponse<FormWithQuestions>;
export type FormsActionResponse = ActionResponse<FormWithResponses[]>;
export type SubmissionActionResponse = ActionResponse<{ id: string }>;
export type AnalyticsActionResponse = ActionResponse<AnalyticsResponse>;
export type TrackEventActionResponse = ActionResponse<{ visitId?: string }>;
