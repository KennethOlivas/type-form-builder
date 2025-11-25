"use client"

import * as React from "react"
import { format, subDays, startOfDay, endOfDay } from "date-fns"
import { Calendar as CalendarIcon, Download } from "lucide-react"
import { DateRange } from "react-day-picker"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getAnalytics } from "@/actions"

interface AnalyticsControlsProps {
    formId: string
}

export function AnalyticsControls({ formId }: AnalyticsControlsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Initialize state from URL params or default
    const [date, setDate] = React.useState<DateRange | undefined>(() => {
        const fromParam = searchParams.get("from")
        const toParam = searchParams.get("to")

        if (fromParam && toParam) {
            return {
                from: new Date(fromParam),
                to: new Date(toParam)
            }
        }

        return {
            from: subDays(new Date(), 30),
            to: new Date(),
        }
    })

    const updateSearchParams = useDebouncedCallback((newDate: DateRange | undefined) => {
        const params = new URLSearchParams(searchParams.toString())

        if (newDate?.from) {
            params.set("from", newDate.from.toISOString())
        } else {
            params.delete("from")
        }

        if (newDate?.to) {
            params.set("to", newDate.to.toISOString())
        } else {
            params.delete("to")
        }

        router.push(`?${params.toString()}`)
    }, 500)

    const handleDateSelect = (newDate: DateRange | undefined) => {
        setDate(newDate)
        updateSearchParams(newDate)
    }

    const handleExport = async () => {
        try {
            const res = await getAnalytics({
                formId,
                startDate: date?.from?.toISOString(),
                endDate: date?.to?.toISOString(),
            })

            if (!res.success) {
                throw new Error(res.error)
            }

            if (!res.data) {
                throw new Error("Failed to fetch data for export")
            }

            const data = res.data
            if (!data.submissions) return

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
                ...rows.map((row: any[]) => row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
            ].join("\n")

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.setAttribute("href", url)
            link.setAttribute("download", `submissions_${formId}_${format(new Date(), "yyyy-MM-dd")}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error("Export failed:", error)
            // Ideally show a toast here
        }
    }

    return (
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full sm:w-[260px] justify-start text-left font-normal bg-background",
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
                        autoFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleDateSelect}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>

            <Button variant="outline" onClick={handleExport} className="w-full sm:w-auto bg-background">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
            </Button>
        </div>
    )
}
