"use server";

import { db } from "@/db";
import { form, question, submission, workspace, workspaceForm, logicJump, logicRule } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, count, getTableColumns, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
    createFormSchema,
    updateFormSchema,
    deleteFormSchema,
    getFormSchema,
    getFormsSchema,
} from "@/lib/validations/schema";
import type {
    CreateFormInput,
    UpdateFormInput,
    FormActionResponse,
    FormsActionResponse,
    ActionResponse,
    Question,
    LogicJump,
    LogicRule,
} from "@/lib/types/db";

// ============================================================================
// Helper Functions
// ============================================================================
async function getAuthenticatedUser() {
    const headersList = await headers();
    const user = await auth.api.getSession({
        headers: headersList,
    });

    if (!user?.session) {
        return null;
    }

    return user.user;
}

// ============================================================================
// Form Actions
// ============================================================================

/**
 * Create a new form
 */
export async function createForm(
    input: CreateFormInput
): Promise<FormActionResponse> {
    try {
        // Validate input
        const validatedData = createFormSchema.parse(input);

        // Authenticate user
        const user = await getAuthenticatedUser();
        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        const userId = user.id;
        const formId = crypto.randomUUID();

        // Create form
        await db.insert(form).values({
            id: formId,
            title: validatedData.title,
            description: validatedData.description,
            status: "draft",
            style: validatedData.style,
            welcomeScreen: validatedData.welcomeScreen || null,
            createdBy: userId,
        });

        // Create questions
        await db.insert(question).values(
            validatedData.questions.map((q, index) => ({
                id: crypto.randomUUID(),
                formId: formId,
                type: q.type,
                label: q.label,
                description: q.description || null,
                placeholder: q.placeholder || null,
                required: q.required,
                options: q.options || null,
                allowMultiple: q.allowMultiple || false,
                ratingScale: q.ratingScale || null,
                position: index,
            }))
        );

        // Add form to workspace
        try {
            let targetWorkspaceId = validatedData.workspaceId;

            // If no workspaceId provided, use first workspace
            if (!targetWorkspaceId) {
                const userWorkspaces = await db
                    .select()
                    .from(workspace)
                    .where(eq(workspace.userId, userId))
                    .limit(1);

                if (userWorkspaces.length > 0) {
                    targetWorkspaceId = userWorkspaces[0].id;
                }
            }

            // Add to workspace if we have a target
            if (targetWorkspaceId) {
                await db.insert(workspaceForm).values({
                    id: crypto.randomUUID(),
                    workspaceId: targetWorkspaceId,
                    formId: formId,
                });
            }
        } catch (error) {
            console.error("Failed to add form to workspace:", error);
            // Don't fail form creation if workspace association fails
        }

        // Fetch the created form with questions
        const createdForm = await getFormById(formId);

        if (!createdForm.success) {
            return { success: false, error: "Failed to fetch created form" };
        }

        revalidatePath("/dashboard");
        return createdForm;
    } catch (error) {
        console.error("Error creating form:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Failed to create form" };
    }
}

/**
 * Update form status
 */
export async function updateFormStatus(
    id: string,
    status: "published" | "draft" | "closed"
): Promise<ActionResponse<{ success: true }>> {
    try {
        // Authenticate user
        const user = await getAuthenticatedUser();
        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        // Verify ownership
        const existingForm = await db
            .select()
            .from(form)
            .where(eq(form.id, id));

        if (existingForm.length === 0) {
            return { success: false, error: "Form not found" };
        }

        if (existingForm[0].createdBy !== user.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Update status
        await db
            .update(form)
            .set({
                status,
                updatedAt: new Date(),
            })
            .where(eq(form.id, id));

        revalidatePath("/dashboard");
        revalidatePath(`/form/${id}`);
        revalidatePath(`/builder/${id}`);

        return { success: true, data: { success: true } };
    } catch (error) {
        console.error("Error updating form status:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Failed to update form status" };
    }
}

/**
 * Get all forms for the authenticated user
 */
export async function getForms(
    workspaceId?: string
): Promise<FormsActionResponse> {
    try {
        // Validate input
        const validatedData = getFormsSchema.parse({ workspaceId });

        // Authenticate user
        const user = await getAuthenticatedUser();
        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        const userId = user.id;

        // If workspaceId is provided, filter by workspace
        if (validatedData.workspaceId) {
            const forms = await db
                .select({
                    ...getTableColumns(form),
                    responses: count(submission.id),
                })
                .from(form)
                .leftJoin(submission, eq(form.id, submission.formId))
                .leftJoin(workspaceForm, eq(form.id, workspaceForm.formId))
                .where(
                    and(
                        eq(form.createdBy, userId),
                        eq(workspaceForm.workspaceId, validatedData.workspaceId)
                    )
                )
                .groupBy(form.id);

            return { success: true, data: forms as any };
        }

        // Build query for all forms
        const forms = await db
            .select({
                ...getTableColumns(form),
                responses: count(submission.id),
            })
            .from(form)
            .leftJoin(submission, eq(form.id, submission.formId))
            .where(eq(form.createdBy, userId))
            .groupBy(form.id);

        return { success: true, data: forms as any };
    } catch (error) {
        console.error("Error fetching forms:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Failed to fetch forms" };
    }
}

/**
 * Get a single form by ID
 */
export async function getFormById(id: string): Promise<FormActionResponse> {
    try {
        // Validate input
        const validatedData = getFormSchema.parse({ id });

        // Authenticate user
        const user = await getAuthenticatedUser();
        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        // Fetch form
        const resultForm = await db
            .select()
            .from(form)
            .where(eq(form.id, validatedData.id));

        if (resultForm.length === 0) {
            return { success: false, error: "Form not found" };
        }

        // Verify ownership
        if (resultForm[0].createdBy !== user.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Fetch questions
        const resultQuestions = await db
            .select()
            .from(question)
            .where(eq(question.formId, validatedData.id))
            .orderBy(question.position);

        // Fetch logic jumps
        const questionIds = resultQuestions.map((q) => q.id);
        let logicJumpsMap: Record<string, LogicJump> = {};

        if (questionIds.length > 0) {
            const jumps = await db
                .select()
                .from(logicJump)
                .where(inArray(logicJump.questionId, questionIds));

            if (jumps.length > 0) {
                const jumpIds = jumps.map((j) => j.id);
                const rules = await db
                    .select()
                    .from(logicRule)
                    .where(inArray(logicRule.logicJumpId, jumpIds));

                for (const jump of jumps) {
                    const jumpRules = rules
                        .filter((r) => r.logicJumpId === jump.id)
                        .map((r) => ({
                            id: r.id,
                            operator: r.operator as LogicRule["operator"],
                            value: r.value || undefined,
                            valueMax: r.valueMax ? Number(r.valueMax) : undefined,
                            destinationType: r.destinationType as LogicRule["destinationType"],
                            destinationQuestionId: r.destinationQuestionId || undefined,
                        }));

                    logicJumpsMap[jump.questionId] = {
                        enabled: jump.enabled,
                        defaultDestinationType: jump.defaultDestinationType as LogicJump["defaultDestinationType"],
                        defaultDestinationQuestionId:
                            jump.defaultDestinationQuestionId || undefined,
                        rules: jumpRules,
                    };
                }
            }
        }

        const questions: Question[] = resultQuestions.map((q) => ({
            id: q.id,
            type: q.type as Question["type"],
            label: q.label,
            description: q.description || undefined,
            placeholder: q.placeholder || undefined,
            required: q.required,
            options: (q.options as string[]) || undefined,
            allowMultiple: q.allowMultiple || undefined,
            ratingScale: q.ratingScale || undefined,
            position: q.position,
            logic: logicJumpsMap[q.id] || undefined,
        }));

        const formData = {
            ...resultForm[0],
            questions,
        };

        return { success: true, data: formData as any };
    } catch (error) {
        console.error("Error fetching form:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Failed to fetch form" };
    }
}

/**
 * Get a single public form by ID (no auth required, but must be published)
 */
export async function getPublicFormById(id: string): Promise<FormActionResponse> {
    try {
        // Validate input
        const validatedData = getFormSchema.parse({ id });

        // Fetch form
        const resultForm = await db
            .select()
            .from(form)
            .where(eq(form.id, validatedData.id));

        if (resultForm.length === 0) {
            return { success: false, error: "Form not found" };
        }

        // Check status - ONLY allow published forms
        if (resultForm[0].status !== "published") {
            return { success: false, error: "Form is not published" };
        }

        // Fetch questions
        const resultQuestions = await db
            .select()
            .from(question)
            .where(eq(question.formId, validatedData.id))
            .orderBy(question.position);

        // Fetch logic jumps
        const questionIds = resultQuestions.map((q) => q.id);
        let logicJumpsMap: Record<string, LogicJump> = {};

        if (questionIds.length > 0) {
            const jumps = await db
                .select()
                .from(logicJump)
                .where(inArray(logicJump.questionId, questionIds));

            if (jumps.length > 0) {
                const jumpIds = jumps.map((j) => j.id);
                const rules = await db
                    .select()
                    .from(logicRule)
                    .where(inArray(logicRule.logicJumpId, jumpIds));

                for (const jump of jumps) {
                    const jumpRules = rules
                        .filter((r) => r.logicJumpId === jump.id)
                        .map((r) => ({
                            id: r.id,
                            operator: r.operator as LogicRule["operator"],
                            value: r.value || undefined,
                            valueMax: r.valueMax ? Number(r.valueMax) : undefined,
                            destinationType: r.destinationType as LogicRule["destinationType"],
                            destinationQuestionId: r.destinationQuestionId || undefined,
                        }));

                    logicJumpsMap[jump.questionId] = {
                        enabled: jump.enabled,
                        defaultDestinationType: jump.defaultDestinationType as LogicJump["defaultDestinationType"],
                        defaultDestinationQuestionId:
                            jump.defaultDestinationQuestionId || undefined,
                        rules: jumpRules,
                    };
                }
            }
        }

        const questions: Question[] = resultQuestions.map((q) => ({
            id: q.id,
            type: q.type as Question["type"],
            label: q.label,
            description: q.description || undefined,
            placeholder: q.placeholder || undefined,
            required: q.required,
            options: (q.options as string[]) || undefined,
            allowMultiple: q.allowMultiple || undefined,
            ratingScale: q.ratingScale || undefined,
            position: q.position,
            logic: logicJumpsMap[q.id] || undefined,
        }));

        const formData = {
            ...resultForm[0],
            questions,
        };

        return { success: true, data: formData as any };
    } catch (error) {
        console.error("Error fetching public form:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Failed to fetch form" };
    }
}

/**
 * Update an existing form
 */
export async function updateForm(
    input: UpdateFormInput
): Promise<FormActionResponse> {
    try {
        // Validate input
        const validatedData = updateFormSchema.parse(input);

        // Authenticate user
        const user = await getAuthenticatedUser();
        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        // Verify ownership
        const existingForm = await db
            .select()
            .from(form)
            .where(eq(form.id, validatedData.id));

        if (existingForm.length === 0) {
            return { success: false, error: "Form not found" };
        }

        if (existingForm[0].createdBy !== user.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Update form
        await db
            .update(form)
            .set({
                title: validatedData.title,
                description: validatedData.description,
                style: validatedData.style,
                welcomeScreen: validatedData.welcomeScreen || null,
                updatedAt: new Date(),
            })
            .where(eq(form.id, validatedData.id));

        // Delete existing questions and re-insert
        await db.delete(question).where(eq(question.formId, validatedData.id));

        await db.insert(question).values(
            validatedData.questions.map((q, index) => ({
                id: q.id || crypto.randomUUID(),
                formId: validatedData.id,
                type: q.type,
                label: q.label,
                description: q.description || null,
                placeholder: q.placeholder || null,
                required: q.required,
                options: q.options || null,
                allowMultiple: q.allowMultiple || false,
                ratingScale: q.ratingScale || null,
                position: index,
            }))
        );

        // Insert Logic
        for (const q of validatedData.questions) {
            if (q.logic && q.logic.enabled && q.id) {
                const logicJumpId = crypto.randomUUID();
                await db.insert(logicJump).values({
                    id: logicJumpId,
                    questionId: q.id,
                    enabled: q.logic.enabled,
                    defaultDestinationType: q.logic.defaultDestinationType,
                    defaultDestinationQuestionId:
                        q.logic.defaultDestinationQuestionId || null,
                });

                if (q.logic.rules && q.logic.rules.length > 0) {
                    await db.insert(logicRule).values(
                        q.logic.rules.map((rule) => ({
                            id: crypto.randomUUID(),
                            logicJumpId: logicJumpId,
                            operator: rule.operator,
                            value: rule.value?.toString() || null,
                            valueMax: rule.valueMax?.toString() || null,
                            destinationType: rule.destinationType,
                            destinationQuestionId: rule.destinationQuestionId || null,
                        }))
                    );
                }
            }
        }

        // Fetch updated form
        const updatedForm = await getFormById(validatedData.id);

        revalidatePath("/dashboard");
        revalidatePath(`/form/${validatedData.id}`);
        return updatedForm;
    } catch (error) {
        console.error("Error updating form:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Failed to update form" };
    }
}

/**
 * Delete a form
 */
export async function deleteForm(
    id: string
): Promise<ActionResponse<{ success: true }>> {
    try {
        // Validate input
        const validatedData = deleteFormSchema.parse({ id });

        // Authenticate user
        const user = await getAuthenticatedUser();
        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        // Verify ownership
        const existingForm = await db
            .select()
            .from(form)
            .where(eq(form.id, validatedData.id));

        if (existingForm.length === 0) {
            return { success: false, error: "Form not found" };
        }

        if (existingForm[0].createdBy !== user.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Delete form (cascade will handle questions and submissions)
        await db.delete(form).where(eq(form.id, validatedData.id));

        revalidatePath("/dashboard");
        return { success: true, data: { success: true } };
    } catch (error) {
        console.error("Error deleting form:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Failed to delete form" };
    }
}
