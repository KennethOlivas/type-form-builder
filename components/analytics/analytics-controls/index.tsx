"use client"

import { AnalyticsControlsProps } from "./types"
import { useDateRange } from "./hooks/use-date-range"
import { useExport } from "./hooks/use-export"
import { DateRangePicker } from "./date-range-picker"
import { ExportButton } from "./export-button"

/**
 * Main analytics controls component that combines date range picker and export functionality
 */
export function AnalyticsControls({ formId }: AnalyticsControlsProps) {
    const { date, handleDateSelect } = useDateRange()
    const { isExporting, handleExport } = useExport(formId, date)

    return (
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <DateRangePicker date={date} onSelect={handleDateSelect} />
            <ExportButton onClick={handleExport} isExporting={isExporting} />
        </div>
    )
}
