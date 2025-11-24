"use client"

import { useState, useEffect } from "react"
import { format, subDays } from "date-fns"
import { Calendar as CalendarIcon, Download } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { KPICards } from "./kpi-cards"
import { ChartsSection } from "./charts-section"
import { ResponsesTable } from "./responses-table"
import { Skeleton } from "@/components/ui/skeleton"

interface AnalyticsDashboardProps {
    id: string
}

export function AnalyticsDashboard({ id }: AnalyticsDashboardProps) {
    const [date, setDate] = useState<DateRange | undefined>({
        from: subDays(new Date(), 30),
        to: new Date(),
    })
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const params = new URLSearchParams()
                if (date?.from) params.append("startDate", date.from.toISOString())
                if (date?.to) params.append("endDate", date.to.toISOString())

                const res = await fetch(`/api/analytics/${id}?${params.toString()}`)
                if (!res.ok) throw new Error("Failed to fetch analytics")
                const jsonData = await res.json()
                setData(jsonData)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id, date])

    const handleExport = () => {
        if (!data?.submissions) return

        // Convert submissions to CSV
        const headers = ["Submission ID", "Date", ...data.form.questions.map((q: any) => q.label)]
        const rows = data.submissions.map((s: any) => {
            const answers = data.form.questions.map((q: any) => {
                const val = s.answers[q.id]
                if (Array.isArray(val)) return val.join("; ")
                return val || ""
            })
            return [s.id, format(new Date(s.submittedAt), "yyyy-MM-dd HH:mm:ss"), ...answers]
        })

        const csvContent = [
            headers.join(","),
            ...rows.map((row: any[]) => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `submissions_${id}_${format(new Date(), "yyyy-MM-dd")}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (loading && !data) {
        return <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-48" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-[260px]" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32" />)}
            </div>
            <Skeleton className="h-[400px]" />
        </div>
    }

    if (!data) return <div className="p-8 text-center">Failed to load analytics</div>

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{data.form.title} Analytics</h1>
                    <p className="text-muted-foreground">Track your form performance and responses</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                id="date"
                                variant={"outline"}
                                className={cn(
                                    "w-full sm:w-[260px] justify-start text-left font-normal",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date?.from ? (
                                    date.to ? (
                                        <>
                                            {format(date.from, "LLL dd, y")} -{" "}
                                            {format(date.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(date.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                            <Calendar
                                initialFocus
                                mode="range"
                                defaultMonth={date?.from}
                                selected={date}
                                onSelect={setDate}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>

                    <Button variant="outline" onClick={handleExport} className="w-full sm:w-auto">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
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
            />
        </div>
    )
}
