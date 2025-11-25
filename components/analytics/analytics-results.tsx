import { getAnalytics } from "@/actions"
import { KPICards } from "./kpi-cards"
import { ChartsSection } from "./charts-section"
import { ResponsesTable } from "./responses-table"
import { AnalyticsHeader } from "./analytics-header"
import { AnalyticsControls } from "./analytics-controls"

interface AnalyticsResultsProps {
    formId: string
    startDate?: string
    endDate?: string
}

export async function AnalyticsResults({ formId, startDate, endDate }: AnalyticsResultsProps) {
    const res = await getAnalytics({
        formId,
        startDate,
        endDate,
    })

    if (!res.success) {
        return <div className="p-8 text-center text-destructive">Failed to load analytics: {res.error}</div>
    }

    const { data } = res

    return (
        <div className="min-h-screen bg-muted/5">
            <AnalyticsHeader title={data.form.title} formId={formId} />

            <main className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
                        <p className="text-muted-foreground">Track your form performance and responses</p>
                    </div>
                    <AnalyticsControls formId={formId} />
                </div>

                <KPICards data={data.kpi} />

                <ChartsSection
                    charts={data.charts}
                    questionAnalysis={data.questionAnalysis}
                    questions={data.form.questions}
                />

                <ResponsesTable
                    submissions={data.submissions}
                    questions={data.form.questions}
                    refreshData={async () => {
                        "use server"
                    }}
                />
            </main>
        </div>
    )
}
