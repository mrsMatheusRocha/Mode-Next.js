# Edge Functions and Runtime

## What is Edge Runtime?

Edge Runtime is a lightweight JavaScript runtime environment provided by Vercel and integrated into Next.js. It allows you to run code at the "edge" of the network—meaning on servers that are geographically closer to your users—rather than in a centralized data center. Edge Runtime executes your code on Vercel's global edge network, which spans hundreds of locations worldwide.

Unlike traditional server environments, Edge Runtime is designed to be lightweight and fast-starting, with minimal cold starts. It's optimized for functions that need to execute quickly and close to the user, such as authentication, personalization, A/B testing, and other request-time operations.

## Edge Runtime vs. Node.js Runtime

| Feature            | Edge Runtime                                            | Node.js Runtime                         |
| ------------------ | ------------------------------------------------------- | --------------------------------------- |
| **Startup Time**   | Milliseconds (cold start)                               | Seconds (cold start)                    |
| **Location**       | Distributed globally                                    | Centralized regions                     |
| **API Support**    | Limited subset of Web APIs                              | Full Node.js APIs                       |
| **Memory Limit**   | Lower (typically 128MB)                                 | Higher (up to several GB)               |
| **Execution Time** | Short (seconds)                                         | Longer (minutes)                        |
| **Use Cases**      | Authentication, personalization, simple transformations | Complex processing, database operations |

## When to Use Edge Runtime

Edge Runtime is ideal for:

1. **Authentication & Authorization**: Validating tokens or checking permissions
2. **Personalization**: Customizing content based on user location or preferences
3. **A/B Testing**: Serving different versions of content to different users
4. **Geolocation Services**: Providing location-specific content or functionality
5. **Simple API Routes**: Handling lightweight API requests
6. **Middleware**: Processing requests before they reach your application
7. **Content Transformation**: Modifying responses on-the-fly

## Using Edge Runtime in Next.js

### In Middleware

Middleware in Next.js automatically runs on the Edge Runtime. As we saw in the previous lesson, middleware allows you to execute code before a request is completed:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // This code runs on the Edge Runtime
  const country = request.geo?.country || 'US'

  // Customize response based on user's country
  if (country === 'GB') {
    return NextResponse.rewrite(new URL('/uk', request.url))
  }

  return NextResponse.next()
}
```

### In API Routes

You can explicitly set an API route to use the Edge Runtime:

```typescript
// app/api/edge-example/route.ts
import { NextResponse } from 'next/server'

export const runtime = 'edge' // Set Edge Runtime

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || 'world'

  return NextResponse.json({
    message: `Hello, ${query}!`,
    location: request.geo?.city || 'Unknown',
    timestamp: new Date().toISOString(),
  })
}
```

### In Server Components

You can also use Edge Runtime in your page or layout components:

```typescript
// app/edge-page/page.tsx
export const runtime = 'edge' // Set Edge Runtime

export default function EdgePage() {
  return (
    <div>
      <h1>This page is rendered at the Edge!</h1>
      <p>Generated at: {new Date().toISOString()}</p>
    </div>
  )
}
```

## Available APIs in Edge Runtime

Edge Runtime provides a subset of Web APIs, including:

- `fetch` and Request/Response objects
- `URLSearchParams` and `URL`
- `Headers`
- `TextEncoder` and `TextDecoder`
- `crypto` (including subtle crypto)
- `setTimeout` and `setInterval`
- `atob` and `btoa`
- `ReadableStream` and `WritableStream`
- `console` methods
- `structuredClone`

Additionally, Next.js provides special objects like:

- `NextRequest` and `NextResponse` with enhanced functionality
- `cookies()` for reading and setting cookies
- `headers()` for accessing request headers
- `userAgent()` for client information
- `geolocation` data via `request.geo`

## Limitations of Edge Runtime

While powerful, Edge Runtime has some limitations:

1. **Limited API Access**: No access to Node.js-specific APIs like `fs` for file system operations
2. **No Native Modules**: Cannot use modules that require compilation
3. **Memory Constraints**: Limited memory compared to Node.js environments
4. **Execution Time Limits**: Functions must complete within seconds, not minutes
5. **Bundle Size Limits**: Your code and dependencies must be relatively small
6. **No Long-Lived Connections**: WebSockets and similar technologies aren't supported

## Edge Config: A Companion to Edge Functions

Vercel provides Edge Config, a key-value data store designed to work with Edge Functions:

```typescript
// Example using Edge Config with Edge Runtime
import { NextResponse } from 'next/server'
import { get } from '@vercel/edge-config'

export const runtime = 'edge'

export async function GET() {
  // Fetch configuration from Edge Config
  const featureFlags = await get('featureFlags')

  return NextResponse.json({
    features: featureFlags,
    timestamp: Date.now(),
  })
}
```

## Performance Benefits

Edge Runtime offers significant performance benefits:

1. **Reduced Latency**: Code runs closer to users, reducing network travel time
2. **Faster Cold Starts**: Edge functions initialize in milliseconds
3. **Global Distribution**: Automatic deployment to hundreds of locations worldwide
4. **Scalability**: Handles traffic spikes without manual scaling
5. **Cost Efficiency**: Pay only for what you use, with no idle server costs

## Best Practices

1. **Keep Functions Small**: Edge functions should be focused and lightweight
2. **Minimize Dependencies**: Large dependencies increase bundle size and cold start times
3. **Use Caching**: Leverage caching headers to reduce function executions
4. **Monitor Performance**: Use Vercel Analytics to track Edge Function performance
5. **Consider Fallbacks**: Have fallback strategies for regions where Edge may not be available
6. **Test Globally**: Test your Edge functions from different geographic locations
