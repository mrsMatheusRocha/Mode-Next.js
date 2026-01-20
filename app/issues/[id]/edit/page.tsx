import { getIssue } from '@/lib/dal'
import IssueForm from '@/app/components/IssueForm'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

// 1. Create a "Loader" component.
// This component handles the async data fetching.
async function EditIssueLoader({ issueId }: { issueId: number }) {
  const issue = await getIssue(issueId)

  if (!issue) {
    notFound()
  }

  return <IssueForm userId={issue.userId} issue={issue} isEditing />
}

// 2. Your main Page component becomes the "Static Shell".
// It renders the layout immediately while data loads.
export default async function EditIssuePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const issueId = parseInt(id)

  // Safety check: If ID is invalid (like during build), return 404 immediately.
  if (isNaN(issueId)) {
    return notFound()
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <Link
        href={`/issues/${id}`}
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-6"
      >
        <ArrowLeftIcon size={16} className="mr-1" />
        Back to Issue
      </Link>

      <h1 className="text-2xl font-bold mb-6">Edit Issue</h1>

      <div className="bg-white dark:bg-dark-elevated border border-gray-200 dark:border-dark-border-default rounded-lg shadow-sm p-6">
        {/* 3. Wrap the Loader in Suspense. This satisfies dynamicIO. */}
        <Suspense fallback={<div className="p-4 text-gray-500">Loading issue data...</div>}>
          <EditIssueLoader issueId={issueId} />
        </Suspense>
      </div>
    </div>
  )
}