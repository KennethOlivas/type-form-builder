import { db } from "@/db";
import { formVisit } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { formId, visitId, event, data } = body;

        if (!formId) {
            return new NextResponse("Missing formId", { status: 400 });
        }

        if (event === "view") {
            const userAgent = request.headers.get("user-agent") || "";
            const parser = new UAParser(userAgent);
            const device = parser.getDevice().type || "desktop"; // default to desktop if undefined (usually means desktop)
            const browser = parser.getBrowser().name;
            const os = parser.getOS().name;
            const ip = request.headers.get("x-forwarded-for") || "unknown";
            const country = request.headers.get("x-vercel-ip-country") || "unknown"; // Vercel specific, but good to have

            const newVisitId = crypto.randomUUID();

            await db.insert(formVisit).values({
                id: newVisitId,
                formId,
                device,
                browser,
                os,
                ip,
                country,
                startedAt: null,
                completedAt: null,
            });

            return NextResponse.json({ visitId: newVisitId });
        }

        if (!visitId) {
            return new NextResponse("Missing visitId", { status: 400 });
        }

        if (event === "start") {
            await db
                .update(formVisit)
                .set({ startedAt: new Date(), lastInteractionAt: new Date() })
                .where(eq(formVisit.id, visitId));
            return NextResponse.json({ success: true });
        }

        if (event === "progress") {
            const { questionId } = data || {};
            await db
                .update(formVisit)
                .set({
                    lastQuestionId: questionId,
                    lastInteractionAt: new Date(),
                })
                .where(eq(formVisit.id, visitId));
            return NextResponse.json({ success: true });
        }

        if (event === "complete") {
            await db
                .update(formVisit)
                .set({ completedAt: new Date(), lastInteractionAt: new Date() })
                .where(eq(formVisit.id, visitId));
            return NextResponse.json({ success: true });
        }

        return new NextResponse("Invalid event", { status: 400 });
    } catch (error) {
        console.error("Tracking error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
