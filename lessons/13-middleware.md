# Implementing Middleware

Next.js Middleware is a powerful feature that allows you to run code before a request is completed. It sits between the client and your Next.js application, enabling you to modify responses, redirect users, rewrite URLs, or add headers based on incoming requests.

## What is Next.js Middleware?

Middleware in Next.js is a special function that executes before a request is completed. It runs on the Edge runtime, which means it's executed close to your users, making it extremely fast and efficient. Middleware can:

- Execute code before a request is completed
- Modify the response by rewriting, redirecting, or adding headers
- Access and modify the request and response objects

## Why Use Middleware?

Middleware provides several key benefits that make it an essential tool in many Next.js applications:

1. **Authentication & Authorization**: Protect routes by checking if users are authenticated before allowing access to certain pages.

2. **Internationalization (i18n)**: Detect a user's language preference and redirect them to the appropriate localized version of your site.

3. **A/B Testing**: Direct different users to different versions of your site to test new features or designs.

4. **Bot Protection**: Identify and block malicious bots from accessing your application.

5. **Custom Headers**: Add security headers or other custom headers to all responses.

6. **URL Rewrites**: Change the URL structure without changing the actual page structure.

7. **Edge Functionality**: Run code at the edge (closer to users) for better performance.

## Creating Middleware

To implement middleware in Next.js, create a file named `middleware.ts` (or `.js`) in the root of your project:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Your middleware logic here
  return NextResponse.next()
}
```

## Middleware Examples

### Basic Authentication Check

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if user is authenticated (e.g., via a cookie)
  const isAuthenticated = request.cookies.has('auth-token')

  // If trying to access a protected route and not authenticated
  if (request.nextUrl.pathname.startsWith('/dashboard') && !isAuthenticated) {
    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
```

### Adding Custom Headers

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next()

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  return response
}
```

### Language Detection and Redirection

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the preferred language from the Accept-Language header
  const acceptLanguage = request.headers.get('Accept-Language') || ''
  const preferredLanguage = acceptLanguage.split(',')[0].split('-')[0]

  // Check if the URL already includes a language prefix
  const { pathname } = request.nextUrl
  const pathnameHasLanguage = /^\/[a-z]{2}\//.test(pathname)

  // If no language in URL, redirect based on preferred language
  if (!pathnameHasLanguage) {
    const supportedLanguages = ['en', 'fr', 'es']
    const language = supportedLanguages.includes(preferredLanguage)
      ? preferredLanguage
      : 'en'

    return NextResponse.redirect(
      new URL(`/${language}${pathname}`, request.url)
    )
  }

  return NextResponse.next()
}
```

## Configuring Middleware

By default, middleware runs on all routes in your application. You can limit it to specific paths using the `config` export:

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Middleware logic
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
}
```

## Best Practices

1. **Keep it Light**: Middleware runs on every request to matched routes, so keep the code efficient.

2. **Error Handling**: Implement proper error handling to prevent your middleware from crashing.

3. **Testing**: Test your middleware thoroughly to ensure it behaves as expected.

4. **Use the Edge Runtime**: Middleware runs on the Edge runtime, which has limitations compared to Node.js. Make sure your code is compatible.

5. **Caching Considerations**: Be aware of how your middleware might affect caching strategies.

## Add middleware

Let's add some middleware to protect our API

middleware.ts

```ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for the API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization')

    // If no Authorization header is present, return a 401 Unauthorized response
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: 'Authorization header is required' },
        { status: 401 }
      )
    }

    // You can add additional authorization logic here
    // For example, validate JWT tokens, check specific auth schemes, etc.
  }

  // Continue with the request for non-API routes or if authorization is valid
  return NextResponse.next()
}

// Configure the middleware to only run on API routes
export const config = {
  matcher: '/api/:path*',
}
```
