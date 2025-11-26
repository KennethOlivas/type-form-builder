import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Circle, List, Type, Calendar, Star, Upload, AlignLeft, Hash } from "lucide-react"
import { DbQuestion } from "@/lib/types/db"

interface FormStructureProps {
    questions: DbQuestion[]
}

export function FormStructure({ questions }: FormStructureProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case "text": return <Type className="h-4 w-4" />
            case "long_text": return <AlignLeft className="h-4 w-4" />
            case "number": return <Hash className="h-4 w-4" />
            case "multiple_choice": return <List className="h-4 w-4" />
            case "date": return <Calendar className="h-4 w-4" />
            case "rating": return <Star className="h-4 w-4" />
            case "file_upload": return <Upload className="h-4 w-4" />
            default: return <Circle className="h-4 w-4" />
        }
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {questions.map((q, index) => (
                <Card key={q.id} className="flex flex-col">
                    <CardHeader className="flex-row items-start gap-4 space-y-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            {getIcon(q.type)}
                        </div>
                        <div className="space-y-1 flex-1">
                            <CardTitle className="text-base leading-none">{q.label}</CardTitle>
                            <CardDescription className="text-xs flex items-center gap-2">
                                <span className="capitalize">{q.type.replace("_", " ")}</span>
                                {q.required && <Badge variant="secondary" className="text-[10px] h-4 px-1">Required</Badge>}
                            </CardDescription>
                        </div>
                        <div className="text-sm font-mono text-muted-foreground">
                            #{index + 1}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                        {q.description && (
                            <p className="text-sm text-muted-foreground mb-4">{q.description}</p>
                        )}

                        {Array.isArray(q.options) && q.options.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Options</h4>
                                <ScrollArea className="h-[100px] w-full rounded-md border p-2">
                                    <ul className="space-y-1">
                                        {q.options.map((opt: string, i: number) => (
                                            <li key={i} className="text-sm flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                                                {opt}
                                            </li>
                                        ))}
                                    </ul>
                                </ScrollArea>
                            </div>
                        )}

                        {q.ratingScale && (
                            <div className="mt-2">
                                <Badge variant="outline">Scale: 1 - {q.ratingScale}</Badge>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
