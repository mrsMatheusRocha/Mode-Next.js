import { Issue } from '@/db/schema'
import { formatRelativeTime } from '@/lib/utils'
import { Priority, Status } from '@/lib/types'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/Card'
import Badge from './ui/Badge'

interface IssueCardProps {
  issue: Issue
}

export default function IssueCard({ issue }: IssueCardProps) {
  const { id, title, description, status, priority, createdAt } = issue

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
    <Link href={`/issues/${id}`}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-1 text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          {description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
              {description}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Badge status={status as Status}>{getStatusLabel(status)}</Badge>
            <Badge priority={priority as Priority}>
              {getPriorityLabel(priority)}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="text-xs text-gray-500">
          {formatRelativeTime(new Date(createdAt))}
        </CardFooter>
      </Card>
    </Link>
  )
}
