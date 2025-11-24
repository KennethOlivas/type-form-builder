import { db } from "@/db";
import { form, formVisit, submission, question } from "@/db/schema";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { startOfDay, subDays, format } from "date-fns";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    // Date filtering logic
    const dateFilter = [];
    if (startDateParam) {
        dateFilter.push(gte(formVisit.createdAt, new Date(startDateParam)));
    }
    if (endDateParam) {
        dateFilter.push(lte(formVisit.createdAt, new Date(endDateParam)));
    }

    // 1. Fetch Form & Questions
    const formData = await db.query.form.findFirst({
        where: eq(form.id, id),
        with: {
            questions: {
                orderBy: (questions: any, { asc }) => [asc(questions.position)],
            },
        },
    });

    if (!formData) {
        return new NextResponse("Form not found", { status: 404 });
    }

    // 2. Fetch Visits & Submissions (with filters)
    // We need to filter visits by date.
    // Submissions are linked to visits conceptually, but stored separately. 
    // Ideally we filter submissions by their submittedAt date too.

    const submissionDateFilter = [];
    if (startDateParam) {
        submissionDateFilter.push(gte(submission.submittedAt, new Date(startDateParam)));
    }
    if (endDateParam) {
        submissionDateFilter.push(lte(submission.submittedAt, new Date(endDateParam)));
    }

    const visits = await db
        .select()
        .from(formVisit)
        .where(and(eq(formVisit.formId, id), ...dateFilter));

    const submissions = await db
        .select()
        .from(submission)
        .where(and(eq(submission.formId, id), ...submissionDateFilter))
        .orderBy(desc(submission.submittedAt));

    // 3. Calculate KPIs
    const totalViews = visits.length;
    const totalStarts = visits.filter((v) => v.startedAt !== null).length;
    const totalSubmissions = submissions.length; // Use submissions table for accuracy
    const completionRate = totalViews > 0 ? (totalSubmissions / totalViews) * 100 : 0;

    // Avg Time: calculated from visits that have completedAt
    const completedVisits = visits.filter((v) => v.completedAt !== null && v.startedAt !== null);
    const totalTime = completedVisits.reduce((acc, v) => {
        return acc + (new Date(v.completedAt!).getTime() - new Date(v.startedAt!).getTime());
    }, 0);
    const avgTime = completedVisits.length > 0 ? totalTime / completedVisits.length / 1000 : 0; // in seconds

    // 4. Charts Data

    // Device Breakdown
    const deviceStats = visits.reduce((acc, v) => {
        const device = v.device || "desktop";
        acc[device] = (acc[device] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const deviceBreakdown = Object.entries(deviceStats).map(([name, value]) => ({ name, value }));

    // Response Timeline (Daily)
    const timelineMap = new Map<string, number>();
    // Initialize last 7 days or range
    // If no range, default to last 30 days? Or just use data present.
    // Let's use data present for now, or fill gaps if needed.
    submissions.forEach((s) => {
        const date = format(new Date(s.submittedAt), "yyyy-MM-dd");
        timelineMap.set(date, (timelineMap.get(date) || 0) + 1);
    });

    const responseTimeline = Array.from(timelineMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

    // Drop-off Funnel
    // Steps: View -> Start -> Q1 -> Q2 ... -> Complete
    // We can track how many visits reached each question.
    // lastQuestionId tells us where they stopped.
    // If completedAt is set, they reached the end.
    // If not, they stopped at lastQuestionId.

    // Map question IDs to their index/label
    const questionMap = new Map(formData.questions.map((q, i) => [q.id, { index: i, label: q.label }]));

    // Initialize counts
    const stepCounts = new Array(formData.questions.length + 2).fill(0);
    // Index 0: View, 1: Start, 2...N+1: Questions completed? 
    // Actually, funnel usually shows:
    // View: All visits
    // Start: All starts
    // Q1 Answered: Visits where lastQuestionId index >= 0 OR completed
    // Q2 Answered: Visits where lastQuestionId index >= 1 OR completed
    // ...
    // Completed: Visits where completedAt is not null

    stepCounts[0] = totalViews;
    stepCounts[1] = totalStarts;

    visits.forEach(v => {
        if (v.completedAt) {
            // Completed means they passed all questions (assuming linear flow for simplicity, logic jumps make this harder but let's approximate)
            for (let i = 0; i < formData.questions.length; i++) {
                stepCounts[i + 2]++;
            }
        } else if (v.lastQuestionId && questionMap.has(v.lastQuestionId)) {
            const qIndex = questionMap.get(v.lastQuestionId)!.index;
            // They answered up to qIndex.
            // So they passed Q1...Q(qIndex+1)
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
            value: stepCounts[i + 2]
        })),
        { name: "Completed", value: totalSubmissions }
    ];

    // 5. Question Analysis
    // Aggregate answers from submissions
    const questionAnalysis: Record<string, any> = {};

    formData.questions.forEach(q => {
        if (["text", "date", "long_text"].includes(q.type)) {
            // Recent answers
            const recent = submissions
                .slice(0, 5)
                .map(s => (s.answers as any)[q.id])
                .filter(Boolean);
            questionAnalysis[q.id] = { type: q.type, recent };
        } else if (["multiple_choice", "dropdown", "yes_no"].includes(q.type)) {
            // Frequency
            const counts: Record<string, number> = {};
            submissions.forEach(s => {
                const ans = (s.answers as any)[q.id];
                if (Array.isArray(ans)) {
                    ans.forEach(a => counts[a] = (counts[a] || 0) + 1);
                } else if (ans) {
                    counts[ans] = (counts[ans] || 0) + 1;
                }
            });
            questionAnalysis[q.id] = { type: q.type, counts };
        } else if (["rating", "nps"].includes(q.type)) {
            // Distribution & Average
            const counts: Record<string, number> = {};
            let sum = 0;
            let count = 0;
            submissions.forEach(s => {
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
                average: count > 0 ? sum / count : 0
            };
        }
    });

    return NextResponse.json({
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
        submissions: submissions, // Return all for now, client can paginate or we can add server pagination later if needed
    });
}
