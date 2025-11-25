import { subDays, startOfDay, endOfDay } from "date-fns"
import { DatePreset } from "./types"

/**
 * Predefined date range presets for analytics
 */
export const DATE_PRESETS: DatePreset[] = [
    {
        label: "Current Day",
        getValue: () => {
            const today = new Date()
            return {
                from: startOfDay(today),
                to: endOfDay(today)
            }
        }
    },
    {
        label: "Last Day",
        getValue: () => {
            const yesterday = subDays(new Date(), 1)
            return {
                from: startOfDay(yesterday),
                to: endOfDay(yesterday)
            }
        }
    },
    {
        label: "Last 3 Days",
        getValue: () => ({
            from: startOfDay(subDays(new Date(), 3)),
            to: endOfDay(new Date())
        })
    },
    {
        label: "Last 7 Days",
        getValue: () => ({
            from: startOfDay(subDays(new Date(), 7)),
            to: endOfDay(new Date())
        })
    },
    {
        label: "Last 14 Days",
        getValue: () => ({
            from: startOfDay(subDays(new Date(), 14)),
            to: endOfDay(new Date())
        })
    },
    {
        label: "Last 30 Days",
        getValue: () => ({
            from: startOfDay(subDays(new Date(), 30)),
            to: endOfDay(new Date())
        })
    },
    {
        label: "Last 90 Days",
        getValue: () => ({
            from: startOfDay(subDays(new Date(), 90)),
            to: endOfDay(new Date())
        })
    }
]

export const DEFAULT_DATE_RANGE_DAYS = 30
export const DEBOUNCE_DELAY = 500
