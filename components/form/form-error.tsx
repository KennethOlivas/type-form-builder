"use client"

export function FormError() {
	return (
		<div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
			<div className="text-center relative z-10">
				<h1 className="text-2xl font-bold text-white mb-2">Form Not Found</h1>
				<p className="text-gray-400">The form you're looking for doesn't exist.</p>
			</div>
		</div>
	)
}