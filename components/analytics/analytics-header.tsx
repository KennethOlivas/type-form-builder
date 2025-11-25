import Link from "next/link"
import { ArrowLeft, BarChart3, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProfileMenu } from "../user/profile-menu"

interface AnalyticsHeaderProps {
    title: string
    formId: string
}

export function AnalyticsHeader({ title, formId }: AnalyticsHeaderProps) {
    return (
        <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex flex-1 items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard">
                        <ArrowLeft className="h-4 w-4" />
                        <span className="sr-only">Back to Dashboard</span>
                    </Link>
                </Button>
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-md">
                        <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold leading-none">{title}</h1>
                        <p className="text-sm text-muted-foreground">Analytics Dashboard</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">

                <Button variant="outline" asChild>
                    <Link href={`/builder/${formId}`} >
                        <Pencil className="h-4 w-4" />
                        Edit Form
                    </Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href={`/form/${formId}`} target="_blank">
                        View Form
                    </Link>
                </Button>

                <div className="h-8 w-px bg-border" />
                <ThemeToggle />
                <ProfileMenu />

            </div>
        </div>
    )
}
