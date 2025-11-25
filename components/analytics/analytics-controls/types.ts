import { DateRange } from "react-day-picker"

export interface AnalyticsControlsProps {
    formId: string
}

export interface DatePreset {
    label: string
    getValue: () => DateRange
}
