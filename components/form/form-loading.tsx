"use client"

import { Skeleton } from "@/components/ui/skeleton"

export function FormLoading() {
	return (
		<div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
			<div className="w-full max-w-3xl space-y-6 relative z-10">
				<Skeleton className="h-12 w-3/4 bg-gray-800" />
				<Skeleton className="h-16 w-full bg-gray-800" />
				<Skeleton className="h-12 w-1/3 bg-gray-800" />
			</div>
		</div>
	)
}