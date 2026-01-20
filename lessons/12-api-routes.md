# Building API Routes

To create API routes in Next.js, you can create directories in the `/app/api` directory with a `route` file. All route conventions are the same as with pages as they are with routes. So dynamic params, catch all, etc.

## What are API Routes?

API routes provide a solution to build your API directly within your Next.js application. They allow you to create serverless functions that can be accessed via HTTP requests. This means you can handle form submissions, create RESTful endpoints, or build a full API without needing a separate backend server.

## Creating a Basic API Route

To create an API route in Next.js 13+ (App Router), you need to:

1. Create a directory inside the `/app/api` folder
2. Add a `route.js` or `route.ts` file that exports HTTP methods

Here's a simple example:

```typescript
// app/api/hello/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello, World!' })
}
```

This creates an API endpoint at `/api/hello` that returns a JSON response when accessed with a GET request.

## HTTP Methods

You can export functions for different HTTP methods in your route file:

```typescript
// app/api/todos/route.ts
import { NextResponse } from 'next/server'

// GET request handler
export async function GET() {
  const todos = [
    { id: 1, text: 'Learn Next.js', completed: false },
    { id: 2, text: 'Build an app', completed: false },
  ]

  return NextResponse.json(todos)
}

// POST request handler
export async function POST(request: Request) {
  const data = await request.json()

  // Process the data (in a real app, you would save to a database)
  console.log('Received data:', data)

  return NextResponse.json(
    {
      message: 'Todo created successfully',
      todo: data,
    },
    { status: 201 }
  )
}

// Other HTTP methods you can implement:
// export async function PUT(request: Request) { ... }
// export async function DELETE(request: Request) { ... }
// export async function PATCH(request: Request) { ... }
```

## Working with Request Data

### Query Parameters

You can access query parameters from the URL:

```typescript
// app/api/search/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const limit = searchParams.get('limit') || '10'

  return NextResponse.json({
    message: `Searching for: ${query}`,
    limit: parseInt(limit),
  })
}
```

This handles requests like `/api/search?q=nextjs&limit=5`.

### Request Body

For POST, PUT, and PATCH requests, you can access the request body:

```typescript
// app/api/submit/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  // Parse JSON body
  const body = await request.json()

  // Or for form data
  // const formData = await request.formData();
  // const name = formData.get('name');

  return NextResponse.json({
    received: body,
    success: true,
  })
}
```

## Dynamic API Routes

You can create dynamic API routes using the same folder structure as page routes:

```typescript
// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id

  // In a real app, fetch user data from a database
  const userData = {
    id,
    name: 'John Doe',
    email: 'john@example.com',
  }

  return NextResponse.json(userData)
}
```

This handles requests like `/api/users/123`.

## Catch-All API Routes

For more flexible routing, you can use catch-all segments:

```typescript
// app/api/posts/[...slug]/route.ts
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  const slug = params.slug

  return NextResponse.json({
    slug,
    message: `Handling route: /api/posts/${slug.join('/')}`,
  })
}
```

This handles requests like `/api/posts/2023/01/hello-world`.

## Error Handling

You can handle errors and return appropriate status codes:

```typescript
// app/api/protected/route.ts
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET() {
  const headersList = headers()
  const token = headersList.get('authorization')

  if (!token || token !== 'Bearer valid-token') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Protected data or operations
    return NextResponse.json({ data: 'Protected content' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
```

## CORS and Headers

You can set custom headers for your API responses:

```typescript
// app/api/cors-example/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { message: 'This endpoint supports CORS' },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  )
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  )
}
```

## Best Practices

1. **Validation**: Always validate input data before processing
2. **Error Handling**: Provide meaningful error messages and appropriate status codes
3. **Rate Limiting**: Implement rate limiting for public APIs
4. **Authentication**: Secure sensitive endpoints with proper authentication
5. **Logging**: Log API requests and errors for debugging
6. **Testing**: Write tests for your API routes

## Adding Swagger/OpenAPI Documentation

You can enhance your API routes with Swagger/OpenAPI documentation using the `next-swagger-doc` package. This allows you to generate interactive API documentation that makes it easier for developers to understand and use your API.

```bash
npm install next-swagger-doc swagger-ui-react
```

The `next-swagger-doc` package reads JSDoc comments in your API route files to generate OpenAPI specifications. You can then display these specifications using Swagger UI.

For detailed implementation instructions and examples, check out the official package documentation:
[next-swagger-doc on npm](https://www.npmjs.com/package/next-swagger-doc)

Here's a simple example of how to document an API route:

```typescript
// app/api/hello/route.ts
import { NextResponse } from 'next/server'

/**
 * @swagger
 * /api/hello:
 *   get:
 *     description: Returns a hello world message
 *     responses:
 *       200:
 *         description: Hello World response
 */
export async function GET() {
  return NextResponse.json({ message: 'Hello, World!' })
}
```

## Create routes

/api/issue/route.ts

```ts
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { issues } from '@/db/schema'

export async function GET() {
  try {
    const allIssues = await db.query.issues.findMany()
    return NextResponse.json(allIssues)
  } catch (error) {
    console.error('Error fetching issues:', error)
    return NextResponse.json(
      { error: 'Failed to fetch issues' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.userId) {
      return NextResponse.json(
        { error: 'Title and userId are required' },
        { status: 400 }
      )
    }

    // Create the issue
    const newIssue = await db
      .insert(issues)
      .values({
        title: data.title,
        description: data.description || null,
        status: data.status || 'backlog',
        priority: data.priority || 'medium',
        userId: data.userId,
      })
      .returning()

    return NextResponse.json(
      { message: 'Issue created successfully', issue: newIssue[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating issue:', error)
    return NextResponse.json(
      { error: 'Failed to create issue' },
      { status: 500 }
    )
  }
}
```

/app/api/issue/[id]/route.ts

```ts
import { NextResponse } from 'next/server'
import { db } from '@/db'
import { issues } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: { id: any } }
) {
  try {
    const id = params.id

    const issue = await db.query.issues.findFirst({
      where: eq(issues.id, id),
    })

    if (!issue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 })
    }

    return NextResponse.json(issue)
  } catch (error) {
    console.error('Error fetching issue:', error)
    return NextResponse.json(
      { error: 'Failed to fetch issue' },
      { status: 500 }
    )
  }
}
```
