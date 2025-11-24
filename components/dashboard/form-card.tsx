"use client";

import { MoreHorizontal, Edit, Copy, Trash2, Eye, Share } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FormCardProps {
    form: {
        id: string;
        title: string;
        status: "published" | "draft" | "closed";
        responses: number;
        lastEdited: string;
        views: number;
        completionRate: number;
    };
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onShare: (id: string) => void;
}

// Mock data for sparkline
const data = [
    { value: 10 },
    { value: 15 },
    { value: 8 },
    { value: 20 },
    { value: 25 },
    { value: 18 },
    { value: 30 },
];

export function FormCard({
    form,
    onDelete,
    onDuplicate,
    onShare,
}: FormCardProps) {
    const statusColors = {
        published: "bg-green-500/15 text-green-600 hover:bg-green-500/25",
        draft: "bg-gray-500/15 text-gray-600 hover:bg-gray-500/25",
        closed: "bg-red-500/15 text-red-600 hover:bg-red-500/25",
    };

    return (
        <Card className="group relative overflow-hidden transition-all hover:shadow-md border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="absolute top-3 right-3 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onDuplicate(form.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onShare(form.id)}>
                            <Share className="mr-2 h-4 w-4" />
                            Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(form.id)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <Link href={`/builder/${form.id}`} className="block h-full">
                <div className="aspect-[16/9] w-full bg-muted/30 p-4 transition-colors group-hover:bg-muted/50 flex items-center justify-center relative overflow-hidden">
                    {/* Abstract visual representation of the form */}
                    <div className="w-3/4 h-3/4 bg-background rounded-lg shadow-sm p-3 opacity-80 group-hover:scale-105 transition-transform duration-300">
                        <div className="h-2 w-1/3 bg-primary/20 rounded mb-2"></div>
                        <div className="h-2 w-2/3 bg-muted rounded mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-8 w-full border border-border rounded bg-muted/10"></div>
                        </div>
                    </div>

                    <div className="absolute bottom-3 left-3">
                        <Badge
                            variant="secondary"
                            className={cn("capitalize font-normal", statusColors[form.status])}
                        >
                            {form.status}
                        </Badge>
                    </div>
                </div>

                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="font-semibold leading-none tracking-tight truncate pr-4">
                                {form.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Edited {form.lastEdited}
                            </p>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <span className="font-medium text-foreground">{form.responses}</span>
                            <span>responses</span>
                        </div>
                    </div>

                    <div className="h-8 w-16">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="hsl(var(--primary))"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardFooter>
            </Link>
        </Card>
    );
}
