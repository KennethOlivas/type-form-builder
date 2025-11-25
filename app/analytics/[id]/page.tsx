import { Suspense } from "react"
import { AnalyticsResults } from "@/components/analytics/analytics-results"
import { AnalyticsSkeleton } from "@/components/skeletons/analytics-skeleton"

interface AnalyticsPageProps {
    params: Promise<{ id: string }>
    searchParams: Promise<{ from?: string; to?: string }>
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
