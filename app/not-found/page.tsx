export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 p-6">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-3xl font-bold tracking-tight text-white">Form Not Found</h1>
        <p className="text-gray-400 text-sm">
          The form you are trying to access does not exist or may have been removed.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-md bg-indigo-600 hover:bg-indigo-500 transition-colors px-5 py-2 text-sm font-medium text-white"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  )
}
