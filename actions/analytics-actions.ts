"use server";

import { db } from "@/db";
import { form, formVisit, submission, question } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { format } from "date-fns";
import { UAParser } from "ua-parser-js";
import {
    analyticsDateRangeSchema,
    trackEventSchema,
} from "@/lib/validations/schema";
import type {
    AnalyticsDateRangeInput,
    TrackEventInput,
    AnalyticsActionResponse,
    TrackEventActionResponse,
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
// Analytics Actions
// ============================================================================

/**
 * Get analytics data for a form
 */
export async function getAnalytics(
    input: AnalyticsDateRangeInput
): Promise<AnalyticsActionResponse> {
    try {
        // Validate input
        const validatedData = analyticsDateRangeSchema.parse(input);

        // Authenticate user
        const user = await getAuthenticatedUser();
        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        // Fetch form with questions
        const formData = await db.query.form.findFirst({
            where: eq(form.id, validatedData.formId),
            with: {
                questions: {
                    orderBy: (questions: any, { asc }) => [asc(questions.position)],
                },
            },
        });

        if (!formData) {
            return { success: false, error: "Form not found" };
        }

        // Verify ownership
        if (formData.createdBy !== user.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Build date filters
        const dateFilter = [];
        if (validatedData.startDate) {
            dateFilter.push(gte(formVisit.createdAt, new Date(validatedData.startDate)));
        }
        if (validatedData.endDate) {
            dateFilter.push(lte(formVisit.createdAt, new Date(validatedData.endDate)));
        }

        const submissionDateFilter = [];
        if (validatedData.startDate) {
            submissionDateFilter.push(
                gte(submission.submittedAt, new Date(validatedData.startDate))
            );
        }
        if (validatedData.endDate) {
            submissionDateFilter.push(
                lte(submission.submittedAt, new Date(validatedData.endDate))
            );
        }

        // Fetch visits and submissions
        const visits = await db
            .select()
            .from(formVisit)
            .where(and(eq(formVisit.formId, validatedData.formId), ...dateFilter));

        const submissions = await db
            .select()
            .from(submission)
            .where(
                and(eq(submission.formId, validatedData.formId), ...submissionDateFilter)
            )
            .orderBy(desc(submission.submittedAt));

        // Calculate KPIs
        const totalViews = visits.length;
        const totalStarts = visits.filter((v) => v.startedAt !== null).length;
        const totalSubmissions = submissions.length;
        const completionRate =
            totalViews > 0 ? (totalSubmissions / totalViews) * 100 : 0;

        // Calculate average time
        const completedVisits = visits.filter(
            (v) => v.completedAt !== null && v.startedAt !== null
        );
        const totalTime = completedVisits.reduce((acc, v) => {
            return (
                acc +
                (new Date(v.completedAt!).getTime() -
                    new Date(v.startedAt!).getTime())
            );
        }, 0);
        const avgTime =
            completedVisits.length > 0 ? totalTime / completedVisits.length / 1000 : 0;

        // Device breakdown
        const deviceStats = visits.reduce(
            (acc, v) => {
                const device = v.device || "desktop";
                acc[device] = (acc[device] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>
        );

        const deviceBreakdown = Object.entries(deviceStats).map(([name, value]) => ({
            name,
            value,
        }));

        // Response timeline
        const timelineMap = new Map<string, number>();
        submissions.forEach((s) => {
            const date = format(new Date(s.submittedAt), "yyyy-MM-dd");
            timelineMap.set(date, (timelineMap.get(date) || 0) + 1);
        });

        const responseTimeline = Array.from(timelineMap.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // Drop-off funnel
        const questionMap = new Map(
            formData.questions.map((q, i) => [q.id, { index: i, label: q.label }])
        );

        const stepCounts = new Array(formData.questions.length + 2).fill(0);
        stepCounts[0] = totalViews;
        stepCounts[1] = totalStarts;

        visits.forEach((v) => {
            if (v.completedAt) {
                for (let i = 0; i < formData.questions.length; i++) {
                    stepCounts[i + 2]++;
                }
            } else if (v.lastQuestionId && questionMap.has(v.lastQuestionId)) {
                const qIndex = questionMap.get(v.lastQuestionId)!.index;
                for (let i = 0; i <= qIndex; i++) {
                    stepCounts[i + 2]++;
                }
            }
        });

        const funnel = [
            { name: "Views", value: stepCounts[0] },
            { name: "Starts", value: stepCounts[1] },
            ...formData.questions.map((q, i) => ({
                name: `${i + 1}. ${q.label.substring(0, 15)}...`,
                value: stepCounts[i + 2],
            })),
            { name: "Completed", value: totalSubmissions },
        ];

        // Question analysis
        const questionAnalysis: Record<string, any> = {};

        formData.questions.forEach((q) => {
            if (["text", "date", "long_text"].includes(q.type)) {
                const recent = submissions
                    .slice(0, 5)
                    .map((s) => (s.answers as any)[q.id])
                    .filter(Boolean);
                questionAnalysis[q.id] = { type: q.type, recent };
            } else if (["multiple_choice", "dropdown", "yes_no"].includes(q.type)) {
                const counts: Record<string, number> = {};
                submissions.forEach((s) => {
                    const ans = (s.answers as any)[q.id];
                    if (Array.isArray(ans)) {
                        ans.forEach((a) => (counts[a] = (counts[a] || 0) + 1));
                    } else if (ans) {
                        counts[ans] = (counts[ans] || 0) + 1;
                    }
                });
                questionAnalysis[q.id] = { type: q.type, counts };
            } else if (["rating", "nps"].includes(q.type)) {
                const counts: Record<string, number> = {};
                let sum = 0;
                let count = 0;
                submissions.forEach((s) => {
                    const ans = (s.answers as any)[q.id];
                    if (ans) {
                        const val = Number(ans);
                        if (!isNaN(val)) {
                            counts[val] = (counts[val] || 0) + 1;
                            sum += val;
                            count++;
                        }
                    }
                });
                questionAnalysis[q.id] = {
                    type: q.type,
                    counts,
                    average: count > 0 ? sum / count : 0,
                };
            }
        });

        return {
            success: true,
            data: {
                form: { title: formData.title, questions: formData.questions },
                kpi: {
                    views: totalViews,
                    starts: totalStarts,
                    submissions: totalSubmissions,
                    completionRate,
                    avgTime,
                },
                charts: {
                    deviceBreakdown,
                    responseTimeline,
                    funnel,
                },
                questionAnalysis,
                submissions: submissions as any,
            },
        };
    } catch (error) {
        console.error("Error fetching analytics:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Failed to fetch analytics" };
    }
}

/**
 * Track form events (view, start, progress, complete)
 * Public endpoint - no auth required
 */
export async function trackFormEvent(
    input: TrackEventInput
): Promise<TrackEventActionResponse> {
    try {
        // Validate input
        const validatedData = trackEventSchema.parse(input);

        // Verify form exists
        const formExists = await db
            .select()
            .from(form)
            .where(eq(form.id, validatedData.formId));

        if (formExists.length === 0) {
            return { success: false, error: "Form not found" };
        }

        // Handle different event types
        if (validatedData.event === "view") {
            const headersList = await headers();
            const userAgent = headersList.get("user-agent") || "";
            const parser = new UAParser(userAgent);
            const device = parser.getDevice().type || "desktop";
            const browser = parser.getBrowser().name;
            const os = parser.getOS().name;
            const ip = headersList.get("x-forwarded-for") || "unknown";
            const country = headersList.get("x-vercel-ip-country") || "unknown";

            const newVisitId = crypto.randomUUID();

            await db.insert(formVisit).values({
                id: newVisitId,
                formId: validatedData.formId,
                device,
                browser,
                os,
                ip,
                country,
                startedAt: null,
                completedAt: null,
            });

            return { success: true, data: { visitId: newVisitId } };
        }

        if (!validatedData.visitId) {
            return { success: false, error: "Missing visitId" };
        }

        if (validatedData.event === "start") {
            await db
                .update(formVisit)
                .set({ startedAt: new Date(), lastInteractionAt: new Date() })
                .where(eq(formVisit.id, validatedData.visitId));

            return { success: true, data: {} };
        }

        if (validatedData.event === "progress") {
            const questionId = validatedData.data?.questionId;
            await db
                .update(formVisit)
                .set({
                    lastQuestionId: questionId,
                    lastInteractionAt: new Date(),
                })
                .where(eq(formVisit.id, validatedData.visitId));

            return { success: true, data: {} };
        }

        if (validatedData.event === "complete") {
            await db
                .update(formVisit)
                .set({ completedAt: new Date(), lastInteractionAt: new Date() })
                .where(eq(formVisit.id, validatedData.visitId));

            return { success: true, data: {} };
        }

        return { success: false, error: "Invalid event type" };
    } catch (error) {
        console.error("Error tracking event:", error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: "Failed to track event" };
    }
}
