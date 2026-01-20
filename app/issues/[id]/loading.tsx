export default function LoadingIssuePage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="animate-pulse space-y-4">
        {/* Header Skeleton */}
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>

        {/* Card Skeleton */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 h-64">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  )
}
