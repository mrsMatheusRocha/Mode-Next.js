# Editing and Deleting Issues with Server Actions

/app/actions/issues.ts

```ts
export async function updateIssue(
  id: number,
  data: Partial<IssueData>
): Promise<ActionResponse> {
  try {
    // Security check - ensure user is authenticated
    await mockDelay(700)
    const user = await getCurrentUser()
    if (!user) {
      return {
        success: false,
        message: 'Unauthorized access',
        error: 'Unauthorized',
      }
    }

    // Allow partial validation for updates
    const UpdateIssueSchema = IssueSchema.partial()
    const validationResult = UpdateIssueSchema.safeParse(data)

    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Type safe update object with validated data
    const validatedData = validationResult.data
    const updateData: Record<string, unknown> = {}

    if (validatedData.title !== undefined)
      updateData.title = validatedData.title
    if (validatedData.description !== undefined)
      updateData.description = validatedData.description
    if (validatedData.status !== undefined)
      updateData.status = validatedData.status
    if (validatedData.priority !== undefined)
      updateData.priority = validatedData.priority

    // Update issue
    await db.update(issues).set(updateData).where(eq(issues.id, id))

    return { success: true, message: 'Issue updated successfully' }
  } catch (error) {
    console.error('Error updating issue:', error)
    return {
      success: false,
      message: 'An error occurred while updating the issue',
      error: 'Failed to update issue',
    }
  }
}

export async function deleteIssue(id: number) {
  try {
    // Security check - ensure user is authenticated
    await mockDelay(700)
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Delete issue
    await db.delete(issues).where(eq(issues.id, id))

    return { success: true, message: 'Issue deleted successfully' }
  } catch (error) {
    console.error('Error deleting issue:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the issue',
      error: 'Failed to delete issue',
    }
  }
}
```

/app/issues/[id]/page.tsx

```tsx
import { getIssue } from '@/lib/dal'
import { formatRelativeTime } from '@/lib/utils'
import { Priority, Status } from '@/lib/types'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Badge from '@/app/components/ui/Badge'
import Button from '@/app/components/ui/Button'
import { ArrowLeftIcon, Edit2Icon } from 'lucide-react'
import DeleteIssueButton from '../../components/DeleteIssueButton'

export default async function IssuePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const issue = await getIssue(parseInt(id))

  if (!issue) {
    notFound()
  }

  const { title, description, status, priority, createdAt, updatedAt, user } =
    issue

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'backlog':
        return 'Backlog'
      case 'todo':
        return 'Todo'
      case 'in_progress':
        return 'In Progress'
      case 'done':
        return 'Done'
      default:
        return status
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'Low'
      case 'medium':
        return 'Medium'
      case 'high':
        return 'High'
      default:
        return priority
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Issues
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold">{title}</h1>
          <div className="flex items-center space-x-2">
            <Link href={`/issues/${id}/edit`}>
              <Button variant="outline" size="sm">
                <span className="flex items-center">
                  <Edit2Icon size={16} className="mr-1" />
                  Edit
                </span>
              </Button>
            </Link>
            <DeleteIssueButton id={parseInt(id)} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-elevated border border-gray-200 dark:border-dark-border-default rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-wrap gap-3 mb-6">
          <Badge status={status as Status}>{getStatusLabel(status)}</Badge>
          <Badge priority={priority as Priority}>
            {getPriorityLabel(priority)}
          </Badge>
          <div className="text-sm text-gray-500">
            Created {formatRelativeTime(new Date(createdAt))}
          </div>
          {updatedAt !== createdAt && (
            <div className="text-sm text-gray-500">
              Updated {formatRelativeTime(new Date(updatedAt))}
            </div>
          )}
        </div>

        {description ? (
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-line">{description}</p>
          </div>
        ) : (
          <p className="text-gray-500 italic">No description provided.</p>
        )}
      </div>

      <div className="bg-white dark:bg-dark-elevated border border-gray-200 dark:border-dark-border-default rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-medium mb-2">Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">
              Assigned to
            </p>
            <p>{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
            <Badge status={status as Status}>{getStatusLabel(status)}</Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Priority</p>
            <Badge priority={priority as Priority}>
              {getPriorityLabel(priority)}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Created</p>
            <p>{formatRelativeTime(new Date(createdAt))}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
```

/app/issues/[id]/edit/page.tsx

```tsx
import { getIssue } from '@/lib/dal'
import IssueForm from '@/app/components/IssueForm'
import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
export default async function EditIssuePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const issue = await getIssue(parseInt(id))

  if (!issue) {
    notFound()
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
        <IssueForm userId={issue.userId} issue={issue} isEditing />
      </div>
    </div>
  )
}
```
