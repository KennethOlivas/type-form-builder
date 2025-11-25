"use client"

import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { DatePresets } from "./date-presets"
import { formatDateRange } from "./utils"

interface DateRangePickerProps {
    date: DateRange | undefined
    onSelect: (date: DateRange | undefined) => void
}

/**
 * Component that renders a date range picker with calendar and presets
 */
export function DateRangePicker({ date, onSelect }: DateRangePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant="outline"
                    className={cn(
                        "w-full sm:w-[260px] justify-start text-left font-normal bg-background",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateRange(date)}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
                <div className="flex">
                    <DatePresets onSelect={onSelect} />
                    <Calendar
                        autoFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={onSelect}
                        numberOfMonths={2}
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}
