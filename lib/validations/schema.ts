import { z } from "zod";

// ============================================================================
// Form Style Schema
// ============================================================================
export const formStyleSchema = z.object({
    backgroundColor: z.string(),
    textColor: z.string(),
    buttonColor: z.string(),
    buttonTextColor: z.string(),
    borderRadius: z.number().min(0).max(50),
    fontFamily: z.enum(["sans", "serif", "mono"]),
});

// ============================================================================
// Welcome Screen Schema
// ============================================================================
export const welcomeScreenSchema = z.object({
    enabled: z.boolean(),
    title: z.string(),
    description: z.string(),
    buttonText: z.string(),
    logo: z.string().optional(),
    backgroundImage: z.string().optional(),
    backgroundVideo: z.string().optional(),
    backgroundOpacity: z.number().min(0).max(100),
    contentAlignment: z.enum(["left", "center", "right"]),
    splitScreen: z.boolean(),
    showTimeEstimate: z.boolean(),
    timeEstimate: z.string().optional(),
    showRespondentCount: z.boolean(),
});

// ============================================================================
// Question Schema
// ============================================================================
export const questionTypeSchema = z.enum([
    "short-text",
    "long-text",
    "multiple-choice",
    "email",
    "phone",
    "date",
    "rating",
    "yes-no",
    "dropdown",
    "file-upload",
]);

export const questionSchema = z.object({
    id: z.string().optional(), // Optional for creation
    type: questionTypeSchema,
    label: z.string().min(1, "Question label is required"),
    description: z.string().optional(),
    placeholder: z.string().optional(),
    required: z.boolean().default(true),
    options: z.array(z.string()).optional(),
    allowMultiple: z.boolean().optional(),
    ratingScale: z.number().min(1).max(10).optional(),
    position: z.number().default(0),
});

// ============================================================================
// Form Schemas
// ============================================================================
export const createFormSchema = z.object({
    title: z.string().min(1, "Form title is required").max(200),
    description: z.string().max(500),
    style: formStyleSchema,
    welcomeScreen: welcomeScreenSchema.optional(),
    questions: z.array(questionSchema).min(1, "At least one question is required"),
    workspaceId: z.string().optional(),
});

export const updateFormSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Form title is required").max(200),
    description: z.string().max(500),
    style: formStyleSchema,
    welcomeScreen: welcomeScreenSchema.optional(),
    questions: z.array(questionSchema).min(1, "At least one question is required"),
});

export const deleteFormSchema = z.object({
    id: z.string(),
});

export const getFormSchema = z.object({
    id: z.string(),
});

export const getFormsSchema = z.object({
    workspaceId: z.string().optional(),
});

// ============================================================================
// Submission Schemas
// ============================================================================
export const submissionAnswersSchema = z.record(
    z.string(),
    z.union([z.string(), z.array(z.string())])
);

export const submitFormSchema = z.object({
    formId: z.string(),
    answers: submissionAnswersSchema,
});

export const deleteSubmissionSchema = z.object({
    id: z.string(),
});

export const getSubmissionsSchema = z.object({
    formId: z.string(),
});

// ============================================================================
// Analytics Schemas
// ============================================================================
export const analyticsDateRangeSchema = z.object({
    formId: z.string(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
});

export const trackEventSchema = z.object({
    formId: z.string(),
    visitId: z.string().optional(),
    event: z.enum(["view", "start", "progress", "complete"]),
    data: z
        .object({
            questionId: z.string().optional(),
        })
        .optional(),
});

// ============================================================================
// Workspace Schemas (for reference, already implemented in workspace-actions)
// ============================================================================
export const createWorkspaceSchema = z.object({
    name: z.string().min(1, "Workspace name is required").max(100),
});

export const updateWorkspaceSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Workspace name is required").max(100),
});

export const deleteWorkspaceSchema = z.object({
    id: z.string(),
});

export const addFormToWorkspaceSchema = z.object({
    workspaceId: z.string(),
    formId: z.string(),
});

export const removeFormFromWorkspaceSchema = z.object({
    workspaceId: z.string(),
    formId: z.string(),
});
