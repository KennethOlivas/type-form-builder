"use client"

import { Button } from "@/components/ui/button"
import { DateRange } from "react-day-picker"
import { DATE_PRESETS } from "./constants"

interface DatePresetsProps {
    onSelect: (date: DateRange) => void
}

/**
 * Component that renders preset date range buttons
 */
export function DatePresets({ onSelect }: DatePresetsProps) {
    return (
        <div className="border-r p-3 space-y-1">
            <div className="text-sm font-medium mb-2 text-muted-foreground">
                Presets
            </div>
            <div className="flex flex-col gap-1">
                {DATE_PRESETS.map((preset) => (
                    <Button
                        key={preset.label}
                        variant="ghost"
                        size="sm"
                        className="justify-start text-sm h-8 px-2"
                        onClick={() => onSelect(preset.getValue())}
                    >
                        {preset.label}
                    </Button>
                ))}
            </div>
        </div>
    )
}
