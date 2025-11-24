import { db } from "@/db";
import { submission } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return new NextResponse("Missing id", { status: 400 });
    }

    try {
        await db.delete(submission).where(eq(submission.id, id));
        return new NextResponse("Deleted", { status: 200 });
    } catch (error) {
        console.error("Delete error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
