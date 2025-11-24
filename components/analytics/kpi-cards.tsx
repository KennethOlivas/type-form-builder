import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Play, CheckCircle, Percent, Clock } from "lucide-react"

interface KPICardsProps {
    data: {
        views: number
        starts: number
        submissions: number
        completionRate: number
        avgTime: number
    }
}

export function KPICards({ data }: KPICardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.views}</div>
                    <p className="text-xs text-muted-foreground">Total impressions</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Starts</CardTitle>
                    <Play className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.starts}</div>
                    <p className="text-xs text-muted-foreground">Interacted with form</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Submissions</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.submissions}</div>
                    <p className="text-xs text-muted-foreground">Completed responses</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.completionRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">Submissions / Views</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.avgTime.toFixed(0)}s</div>
                    <p className="text-xs text-muted-foreground">Time to complete</p>
                </CardContent>
            </Card>
        </div>
    )
}
