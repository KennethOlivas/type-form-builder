import * as React from "react"
import { subDays } from "date-fns"
import { DateRange } from "react-day-picker"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { DEFAULT_DATE_RANGE_DAYS, DEBOUNCE_DELAY } from "../constants"

/**
 * Custom hook to manage date range state and URL synchronization
 */
export function useDateRange() {
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
            from: subDays(new Date(), DEFAULT_DATE_RANGE_DAYS),
            to: new Date(),
        }
    })

    // Debounced function to update URL search params
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
    }, DEBOUNCE_DELAY)

    // Handler for date selection
    const handleDateSelect = React.useCallback((newDate: DateRange | undefined) => {
        setDate(newDate)
        updateSearchParams(newDate)
    }, [updateSearchParams])

    return {
        date,
        handleDateSelect
    }
}
