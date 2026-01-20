# Fetching Protected Data in Server Components

Our sign-in server action currently lacks the crucial step of verifying user credentials against stored data. To address this, we need to implement the logic to locate a user based on the provided email. Furthermore, for the dashboard page, we'll need to fetch and display issues specifically associated with the logged-in user. To accomplish these data retrieval tasks, we will utilize server-side functions. It's crucial to understand the distinction between these functions and Server Actions, which are defined using the `use server` directive. Server Actions act as API routes, bridging the client and server. They are ideal for handling user interactions from the client, and while often used for data mutations, they can also be employed to fetch data in response to client-side events, crossing the network boundary to execute server-side logic. In contrast, the server-side data fetching we'll implement here runs directly on the server _before_ a component renders. This process is integral to React Server Components (RSCs) and does not cross the network boundary, as it's purely server-side execution. This type of server-side data fetching is essential for preparing and securing data for the initial UI render, ensuring that sensitive data handling and initial data retrieval are efficiently managed on the server, with its code bundled separately from client-side modules.

/lib/dal.ts

```ts
// Current user
export const getCurrentUser = async () => {
  const session = await getSession()
  if (!session) return null

  try {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))

    return result[0] || null
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
}

// Get user by email
export const getUserByEmail = async (email: string) => {
  try {
    const result = await db.select().from(users).where(eq(users.email, email))
    return result[0] || null
  } catch (error) {
    console.error('Error getting user by email:', error)
    return null
  }
}

export async function getIssues() {
  try {
    const result = await db.query.issues.findMany({
      with: {
        user: true,
      },
      orderBy: (issues, { desc }) => [desc(issues.createdAt)],
    })
    return result
  } catch (error) {
    console.error('Error fetching issues:', error)
    throw new Error('Failed to fetch issues')
  }
}
```

/app/dashboard/page.tsx

```tsx
import { getIssues } from '@/lib/dal'
import Link from 'next/link'
import Button from '../components/ui/Button'
import { PlusIcon } from 'lucide-react'
import Badge from '../components/ui/Badge'
import { formatRelativeTime } from '@/lib/utils'
import { Priority, Status } from '@/lib/types'
import { ISSUE_STATUS, ISSUE_PRIORITY } from '@/db/schema'

export default async function DashboardPage() {
  const issues = await getIssues()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Issues</h1>
        <Link href="/issues/new">
          <Button>
            <span className="flex items-center">
              <PlusIcon size={18} className="mr-2" />
              New Issue
            </span>
          </Button>
        </Link>
      </div>

      {issues.length > 0 ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-dark-border-default bg-white dark:bg-dark-high shadow-sm">
          {/* Header row */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-elevated border-b border-gray-200 dark:border-dark-border-default">
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-3">Created</div>
          </div>

          {/* Issue rows */}
          <div className="divide-y divide-gray-200 dark:divide-dark-border-default">
            {issues.map((issue) => (
              <Link
                key={issue.id}
                href={`/issues/${issue.id}`}
                className="block hover:bg-gray-50 dark:hover:bg-dark-elevated transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                  <div className="col-span-5 font-medium truncate">
                    {issue.title}
                  </div>
                  <div className="col-span-2">
                    <Badge status={issue.status as Status}>
                      {ISSUE_STATUS[issue.status as Status].label}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <Badge priority={issue.priority as Priority}>
                      {ISSUE_PRIORITY[issue.priority as Priority].label}
                    </Badge>
                  </div>
                  <div className="col-span-3 text-sm text-gray-500 dark:text-gray-400">
                    {formatRelativeTime(new Date(issue.createdAt))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center border border-gray-200 dark:border-dark-border-default rounded-lg bg-white dark:bg-dark-high p-8">
          <h3 className="text-lg font-medium mb-2">No issues found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Get started by creating your first issue.
          </p>
          <Link href="/issues/new">
            <Button>
              <span className="flex items-center">
                <PlusIcon size={18} className="mr-2" />
                Create Issue
              </span>
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
```

/app/dashboard/layout.tsx

```tsx
import { Suspense } from 'react'
import Navigation from '../components/Navigation'
import DashboardSkeleton from '../components/DashboardSkeleton'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pl-16 md:pl-64 pt-0 min-h-screen">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <Suspense fallback={<DashboardSkeleton />}>{children}</Suspense>
        </div>
      </main>
    </div>
  )
}
```

Next.js is actively developing features to improve data fetching and caching in Server Components. Features like `dynamicIO`, currently available in the canary channel, offer more granular control over caching behavior. With `dynamicIO` enabled, Next.js, by default, will throw an error if a Server Component fetches data _without_ being wrapped in a `<Suspense>` boundary or utilizing the `use cache` directive. To handle dynamic data fetching during development, wrap the component fetching the data in `<Suspense>`. This opts that component out of caching, ensuring you always see the latest data.

```ts
const getCurrentUser = async () => {
  const session = await getSession()
  if (!session) return null
  // Skip database query during prerendering if we don't have a session
  // hack until we have PPR https://nextjs.org/docs/app/building-your-application/rendering/partial-prerendering
  if (
    typeof window === 'undefined' &&
    process.env.NEXT_PHASE === 'phase-production-build'
  ) {
    return null
  }
  //....
}
```
