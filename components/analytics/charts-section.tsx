"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts"
import { FormStructure } from "./form-structure"

interface ChartsSectionProps {
    charts: {
        deviceBreakdown: { name: string; value: number }[]
        responseTimeline: { date: string; count: number }[]
        funnel: { name: string; value: number }[]
    }
    questionAnalysis: Record<string, any>
    questions: any[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export function ChartsSection({ charts, questionAnalysis, questions }: ChartsSectionProps) {
    return (
        <Tabs fullWidth defaultValue="overview" className="space-y-4">
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="questions">Question Analysis</TabsTrigger>
                <TabsTrigger value="structure">Structure</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Card className="col-span-4">
                        <CardHeader>
                            <CardTitle>Response Timeline</CardTitle>
                            <CardDescription>Daily response volume over time</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={charts.responseTimeline}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="#888888"
                                            fontSize={12}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `${value}`}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
                                            itemStyle={{ color: "var(--foreground)" }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#8884d8"
                                            strokeWidth={2}
                                            activeDot={{ r: 8 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-3">
                        <CardHeader>
                            <CardTitle>Device Breakdown</CardTitle>
                            <CardDescription>Responses by device type</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={charts.deviceBreakdown}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {charts.deviceBreakdown.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
                                            itemStyle={{ color: "var(--foreground)" }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Drop-off Funnel</CardTitle>
                        <CardDescription>User retention through form steps</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={charts.funnel} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-muted" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        width={150}
                                        tick={{ fontSize: 12 }}
                                        interval={0}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
                                        itemStyle={{ color: "var(--foreground)" }}
                                    />
                                    <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={30}>
                                        {charts.funnel.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === charts.funnel.length - 1 ? "#10b981" : "#6366f1"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="questions">
                <div className="grid gap-4 md:grid-cols-2">
                    {questions.map((q) => {
                        const analysis = questionAnalysis[q.id]
                        if (!analysis) return null

                        return (
                            <Card key={q.id}>
                                <CardHeader>
                                    <CardTitle className="text-base">{q.label}</CardTitle>
                                    <CardDescription className="text-xs truncate">{q.type}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {analysis.type === "text" || analysis.type === "long_text" || analysis.type === "date" ? (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-semibold">Recent Answers:</h4>
                                            <ul className="space-y-1">
                                                {analysis.recent.length > 0 ? (
                                                    analysis.recent.map((ans: string, i: number) => (
                                                        <li key={i} className="text-sm p-2 bg-muted rounded-md truncate">
                                                            {ans}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li className="text-sm text-muted-foreground">No answers yet</li>
                                                )}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="h-[200px]">
                                            {analysis.counts && Object.keys(analysis.counts).length > 0 ? (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart data={Object.entries(analysis.counts).map(([name, value]) => ({ name, value }))}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                                                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                                        <YAxis fontSize={12} tickLine={false} axisLine={false} />
                                                        <Tooltip
                                                            cursor={{ fill: 'transparent' }}
                                                            contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
                                                            itemStyle={{ color: "var(--foreground)" }}
                                                        />
                                                        <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                                                    No data available
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {analysis.average !== undefined && (
                                        <div className="mt-4 text-center">
                                            <span className="text-2xl font-bold">{analysis.average.toFixed(1)}</span>
                                            <span className="text-sm text-muted-foreground ml-2">Average Score</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            </TabsContent>
            <TabsContent value="structure">
                <FormStructure questions={questions} />
            </TabsContent>
        </Tabs>
    )
}
