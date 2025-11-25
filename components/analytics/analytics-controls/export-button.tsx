import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExportButtonProps {
    onClick: () => void
    isExporting?: boolean
}

/**
 * Component that renders an export CSV button
 */
export function ExportButton({ onClick, isExporting = false }: ExportButtonProps) {
    return (
        <Button
            variant="outline"
            onClick={onClick}
            className="w-full sm:w-auto"
            disabled={isExporting}
        >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Exporting..." : "Export CSV"}
        </Button>
    )
}
