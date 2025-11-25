import { format } from "date-fns"
import { DateRange } from "react-day-picker"

/**
 * Converts analytics data to CSV format
 */
export function convertToCSV(data: any): string {
    if (!data.submissions) return ""

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

    return csvContent
}

/**
 * Downloads a CSV file
 */
export function downloadCSV(csvContent: string, filename: string): void {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

/**
 * Formats date range for display
 */
export function formatDateRange(date: DateRange | undefined): string {
    if (!date?.from) return "Pick a date"

    if (date.to) {
        return `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`
    }

    return format(date.from, "LLL dd, y")
}
