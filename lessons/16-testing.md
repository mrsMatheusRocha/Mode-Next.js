# Testing Your Next.js Application

Testing is a critical part of application development, ensuring your code works as expected and preventing regressions. In this lesson, we'll learn how to set up and use Vitest, a fast and feature-rich testing framework, with Next.js.

## Why Vitest?

Vitest is a Vite-powered testing framework that offers:

- Fast execution with native ESM support
- Watch mode that only re-runs affected tests
- Compatible with Jest's API
- Built-in code coverage
- TypeScript and JSX support out of the box

## Setting Up Vitest in a Next.js Project

Let's walk through the process of manually setting up Vitest for testing your Next.js application.

### Step 1: Install Required Dependencies

First, install Vitest and related testing libraries:

```bash
npm install -D vitest @vitejs/plugin-react vite-tsconfig-paths @testing-library/react @testing-library/dom jsdom
```

These packages provide:

- `vitest`: The testing framework
- `@vitejs/plugin-react`: For React component testing
- `vite-tsconfig-paths`: For resolving TypeScript paths
- `@testing-library/react` and `@testing-library/dom`: For testing React components
- `jsdom`: For simulating a browser environment

### Step 2: Create a Vitest Configuration File

Create a `vitest.config.mjs` file in your project root:

```javascript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    include: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
})
```

This configuration:

- Uses the React plugin for testing React components
- Configures TypeScript path resolution
- Sets JSDOM as the testing environment
- Specifies test file patterns
- Enables global test functions (like `describe`, `it`, etc.)
- References a setup file we'll create next

### Step 3: Create a Setup File

Create a `vitest.setup.ts` file in your project root:

```typescript
import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    pathname: '/',
    params: {},
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Next.js image component
vi.mock('next/image', () => ({
  default: (props: {
    src: string
    alt: string
    width?: number
    height?: number
    className?: string
    priority?: boolean
    quality?: number
    style?: React.CSSProperties
  }) => {
    return React.createElement('img', {
      ...props,
      src: props.src,
      alt: props.alt,
    })
  },
}))

// Mock Next.js link component
vi.mock('next/link', () => ({
  default: (props: {
    href: string
    children: React.ReactNode
    className?: string
    prefetch?: boolean
    replace?: boolean
    scroll?: boolean
  }) => {
    return React.createElement(
      'a',
      {
        ...props,
        href: props.href,
      },
      props.children
    )
  },
}))

// Add any global mocks or setup here
```

This setup file:

- Imports Jest DOM matchers for additional assertions
- Mocks Next.js navigation hooks to avoid router-related errors
- Mocks Next.js Image and Link components
- Provides a place to add other global mocks or setup code

### Step 4: Add Test Script to package.json

Add or update the test script in your `package.json`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest run --coverage"
}
```

### Step 5: Create a Test Directory Structure

Create a `__tests__` directory in your project. You can place it at the root level or within specific feature directories. For example:

```
app/
  components/
    __tests__/
      Button.test.tsx
    Button.tsx
```

Alternatively, you can co-locate test files with the components they test:

```
app/
  components/
    Button.tsx
    Button.test.tsx
```

## Writing Your First Test

Let's create a simple test for a button component:

1. Create a test file `app/components/__tests__/Button.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from '../Button'

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

## Testing Server Components

Testing React Server Components requires special handling. Here's how to test them:

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ServerComponent from '../ServerComponent'

// Mock the fetch function or any server-side APIs
vi.mock('next/headers', () => ({
  cookies: () => ({ get: () => ({ value: 'mocked-value' }) }),
  headers: () => new Headers(),
}))

describe('ServerComponent', () => {
  it('renders server component correctly', async () => {
    // For server components, await them, they are just functions.

    render(await ServerComponent()))
    expect(screen.getByText('Server Component Content')).toBeInTheDocument()
  })
})
```

## Testing API Routes and Server Actions

For testing API routes and server actions, you can use direct function calls:

```tsx
import { describe, it, expect, vi } from 'vitest'
import { createTodo } from '../actions'

// Mock any dependencies
vi.mock('../../lib/db', () => ({
  db: {
    insert: vi.fn().mockResolvedValue({ id: '123' }),
  },
}))

describe('Server Action: createTodo', () => {
  it('creates a todo successfully', async () => {
    const result = await createTodo({ title: 'Test Todo' })
    expect(result).toEqual({ success: true, id: '123' })
  })
})
```

## Testing API Routes

For testing API routes in Next.js App Router, you can directly import and test the route handlers:

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '../route'
import { db } from '@/db'
import { NextResponse } from 'next/server'

// Mock dependencies
vi.mock('@/db', () => ({
  db: {
    query: {
      issues: {
        findMany: vi.fn(),
      },
    },
    insert: vi.fn(),
  },
}))

vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, options) => ({ data, options })),
  },
}))

describe('Issue API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET', () => {
    it('returns all issues successfully', async () => {
      // Mock the database response
      const mockIssues = [
        {
          id: 1,
          title: 'Issue 1',
          status: 'todo',
          priority: 'medium',
          description: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 'user1',
        },
      ]
      vi.mocked(db.query.issues.findMany).mockResolvedValueOnce(mockIssues)

      // Call the GET function
      const response = await GET()

      // Verify the response
      expect(db.query.issues.findMany).toHaveBeenCalledTimes(1)
      expect(NextResponse.json).toHaveBeenCalledWith(mockIssues)
    })
  })
})
```

## Running Tests

Run your tests with the following commands:

- `npm test`: Run tests in watch mode
- `npm test -- --run`: Run tests once
- `npm test -- --coverage`: Generate coverage report
- `npm test -- path/to/test.tsx`: Run specific tests

## Testing dashboard

/app/dashboard/**test**/page.test.tsx

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DashboardPage from '../page'
import { getIssues } from '@/lib/dal'
import { ISSUE_STATUS, ISSUE_PRIORITY } from '@/db/schema'
import { Status, Priority } from '@/lib/types'

// Mock the dependencies
vi.mock('@/lib/dal', () => ({
  getIssues: vi.fn(),
  getCurrentUser: vi.fn(),
}))

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({
    href,
    children,
  }: {
    href: string
    children: React.ReactNode
  }) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  ),
}))

// Mock the formatRelativeTime function
vi.mock('@/lib/utils', () => ({
  formatRelativeTime: vi.fn(() => '2 days ago'),
  cn: vi.fn((...args) => args.join(' ')),
}))

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the issues list when issues are available', async () => {
    // Mock data
    const mockIssues = [
      {
        id: 1,
        title: 'Test Issue 1',
        description: 'Test description',
        status: 'todo' as Status,
        priority: 'medium' as Priority,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user1',
        user: {
          id: 'user1',
          email: 'user1@example.com',
          password: 'hashed-password',
          createdAt: new Date(),
        },
      },
      {
        id: 2,
        title: 'Test Issue 2',
        description: null,
        status: 'in_progress' as Status,
        priority: 'high' as Priority,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user2',
        user: {
          id: 'user2',
          email: 'user2@example.com',
          password: 'hashed-password',
          createdAt: new Date(),
        },
      },
    ]

    // Setup the mock
    vi.mocked(getIssues).mockResolvedValue(mockIssues)

    // Render the component (await it since it's an RSC)
    const Component = await DashboardPage()
    render(Component)

    // Assertions
    expect(screen.getByText('Issues')).toBeInTheDocument()
    expect(screen.getByText('Test Issue 1')).toBeInTheDocument()
    expect(screen.getByText('Test Issue 2')).toBeInTheDocument()
    expect(screen.getByText(ISSUE_STATUS.todo.label)).toBeInTheDocument()
    expect(screen.getByText(ISSUE_STATUS.in_progress.label)).toBeInTheDocument()
    expect(screen.getByText(ISSUE_PRIORITY.medium.label)).toBeInTheDocument()
    expect(screen.getByText(ISSUE_PRIORITY.high.label)).toBeInTheDocument()
    expect(screen.getAllByText('2 days ago')).toHaveLength(2)
  })

  it('renders the empty state when no issues are available', async () => {
    // Setup the mock to return an empty array
    vi.mocked(getIssues).mockResolvedValue([])

    // Render the component (await it since it's an RSC)
    const Component = await DashboardPage()
    render(Component)

    // Assertions
    expect(screen.getByText('No issues found')).toBeInTheDocument()
    expect(
      screen.getByText('Get started by creating your first issue.')
    ).toBeInTheDocument()
    expect(screen.getByText('Create Issue')).toBeInTheDocument()
  })
})
```
