"use server";

import { db } from "@/db";
import { form, submission } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import {
    submitFormSchema,
    deleteSubmissionSchema,
    getSubmissionsSchema,
} from "@/lib/validations/schema";
import type {
    SubmitFormInput,
    SubmissionActionResponse,
    ActionResponse,
    DbSubmission,
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
// Submission Actions
// ============================================================================

/**
 * Submit a form (public endpoint - no auth required)
 */
export async function submitForm(
    input: SubmitFormInput
): Promise<SubmissionActionResponse> {
    try {
        // Validate input
        const validatedData = submitFormSchema.parse(input);

        // Verify form exists
        const resultForm = await db
            .select()
            .from(form)
            .where(eq(form.id, validatedData.formId));

        if (resultForm.length === 0) {
            return { success: false, error: "Form not found" };
        }

        // Create submission
        const submissionId = crypto.randomUUID();

        await db.insert(submission).values({
            id: submissionId,
            formId: validatedData.formId,
            answers: validatedData.answers,
            device: "web",
        });

        return { success: true, data: { id: submissionId } };
    } catch (error) {
        console.error("Error submitting form:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Failed to submit form" };
    }
}

/**
 * Get all submissions for a form
 */
export async function getSubmissions(
    formId: string
): Promise<ActionResponse<DbSubmission[]>> {
    try {
        // Validate input
        const validatedData = getSubmissionsSchema.parse({ formId });

        // Authenticate user
        const user = await getAuthenticatedUser();
        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        // Verify form ownership
        const resultForm = await db
            .select()
            .from(form)
            .where(eq(form.id, validatedData.formId));

        if (resultForm.length === 0) {
            return { success: false, error: "Form not found" };
        }

        if (resultForm[0].createdBy !== user.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Fetch submissions
        const submissions = await db
            .select()
            .from(submission)
            .where(eq(submission.formId, validatedData.formId))
            .orderBy(desc(submission.submittedAt));

        return { success: true, data: submissions as any };
    } catch (error) {
        console.error("Error fetching submissions:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Failed to fetch submissions" };
    }
}

/**
 * Delete a submission
 */
export async function deleteSubmission(
    id: string
): Promise<ActionResponse<{ success: true }>> {
    try {
        // Validate input
        const validatedData = deleteSubmissionSchema.parse({ id });

        // Authenticate user
        const user = await getAuthenticatedUser();
        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        // Fetch submission to verify ownership
        const resultSubmission = await db
            .select()
            .from(submission)
            .where(eq(submission.id, validatedData.id));

        if (resultSubmission.length === 0) {
            return { success: false, error: "Submission not found" };
        }

        // Verify form ownership
        const resultForm = await db
            .select()
            .from(form)
            .where(eq(form.id, resultSubmission[0].formId));

        if (resultForm.length === 0) {
            return { success: false, error: "Form not found" };
        }

        if (resultForm[0].createdBy !== user.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Delete submission
        await db.delete(submission).where(eq(submission.id, validatedData.id));

        revalidatePath(`/analytics/${resultSubmission[0].formId}`);
        return { success: true, data: { success: true } };
    } catch (error) {
        console.error("Error deleting submission:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Failed to delete submission" };
    }
}
