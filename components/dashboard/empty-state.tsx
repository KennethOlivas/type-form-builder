"use client";

import { FilePlus, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center animate-in fade-in-50 zoom-in-95 duration-500">
            <div className="relative mb-6">
                <div className="absolute -inset-4 bg-linear-to-r from-primary/20 to-purple-500/20 rounded-full blur-xl opacity-50" />
                <div className="relative bg-background p-4 rounded-full border shadow-sm">
                    <Sparkles className="h-12 w-12 text-primary" />
                </div>
            </div>

            <h3 className="text-2xl font-bold tracking-tight mb-2">
                You don't have any forms yet
            </h3>
            <p className="text-muted-foreground max-w-md mb-8">
                Create your first form to start collecting responses. You can start from scratch or use one of our templates.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                            <FilePlus className="h-5 w-5" />
                            Start from Scratch
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Build a form exactly how you want it with our drag-and-drop builder.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Link href="/builder/new" className="w-full">
                            <Button className="w-full">Create Form</Button>
                        </Link>
                    </CardFooter>
                </Card>

                <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                            <PlayCircle className="h-5 w-5" />
                            Watch Tutorial
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Learn how to build powerful forms in just 2 minutes.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full">Watch Video</Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="mt-8 text-sm text-muted-foreground">
                <span className="mr-2">Popular templates:</span>
                <Button variant="link" className="h-auto p-0 mr-2">Contact Form</Button>
                <Button variant="link" className="h-auto p-0 mr-2">Feedback Survey</Button>
                <Button variant="link" className="h-auto p-0">Event Registration</Button>
            </div>
        </div>
    );
}
