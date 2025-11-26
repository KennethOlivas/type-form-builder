import { Suspense } from "react"
import { AnalyticsResults } from "@/components/analytics/analytics-results"
import { AnalyticsSkeleton } from "@/components/skeletons/analytics-skeleton"
import { getFormById } from "@/actions/form-actions"
import { Metadata } from "next"

interface AnalyticsPageProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ from?: string; to?: string }>
}

export async function generateMetadata({ params }: AnalyticsPageProps): Promise<Metadata> {
    const { id } = await params
    const form = await getFormById(id)

    if (!form.success || !form.data) {
        return {
            title: "Analytics",
        }
    }

    return {
        title: `Analytics - ${form.data.title}`,
    }
}

export default async function AnalyticsPage({
    params,
    searchParams,
}: AnalyticsPageProps) {
    const { id } = await params
    const { from, to } = await searchParams

    return (
        <Suspense fallback={<AnalyticsSkeleton />}>
            <AnalyticsResults
                formId={id}
                startDate={from}
                endDate={to}
            />
        </Suspense>
    )
}
