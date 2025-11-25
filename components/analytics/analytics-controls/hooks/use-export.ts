import { useState } from "react"
import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { getAnalytics } from "@/actions"
import { convertToCSV, downloadCSV } from "../utils"

/**
 * Custom hook to handle analytics data export
 */
export function useExport(formId: string, date: DateRange | undefined) {
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        setIsExporting(true)

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

            const csvContent = convertToCSV(res.data)
            const filename = `submissions_${formId}_${format(new Date(), "yyyy-MM-dd")}.csv`

            downloadCSV(csvContent, filename)
        } catch (error) {
            console.error("Export failed:", error)
            // Ideally show a toast here
        } finally {
            setIsExporting(false)
        }
    }

    return {
        isExporting,
        handleExport
    }
}
