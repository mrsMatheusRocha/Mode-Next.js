# Caching and Memoizing Data

## Caching

Next.js offers several ways to optimize data fetching and rendering. One approach is to use the `'use cache'` directive within Server Components. This directive, combined with `unstable_cacheTag`, allows us to cache the results of data fetching functions, significantly improving performance. Let's apply this to our `getIssues` function, which is used on the /dashboard page. We must cache any dynamic server component, or suspend it.

/app/lib/dal.ts

```ts
const getIssues = async () => {
  'use cache'
  // ...rest
}
```

That's it! By adding `'use cache'`, we've instructed Next.js to cache the results of the `getIssues` function. Now, after the initial load of the dashboard, subsequent renders won't trigger a database query, resulting in faster loading times. You'll notice the loading skeleton only appears on the first load or after a hard refresh.

However, this caching introduces a new challenge. When we create a new issue and redirect back to the dashboard, the new issue won't immediately appear because the cached data is stale. To address this, we need a way to invalidate the cache when new issues are created. We achieve this by tagging our cache and then revalidating that tag when necessary. First, let's tag our cache so we can reference it later for revalidation.

/app/lib/dal.ts

```ts
import { unstable_cacheTag as cacheTag } from 'next/cache'

const getIssues = async () => {
  'use cache'
  cacheTag('issues')
  // ...rest
}
```

Then inside the createIssue server action.

/app/actions/issues.ts

```ts
import { revalidateTag } from 'next/cache'

export const createIssue = async () => {
  // after issue db insert
  revalidateTag('issues')
}
```

## Memoizing Data in RSC

Next.js provides powerful caching mechanisms to optimize performance. One of the most useful is the `cache` function from React, which allows us to memoize function results for the duration of a request.

## Using the `cache` Function

All we have to do is import and wrap any function we use in a RSC with the cache fn. Lets memoize the getCurrentUser function:

```ts
import { cache } from 'react'
export const getCurrentUser = cache(async () => {
  console.log('getting user')
  //.. rest of the function
})
```

To illustrate how `cache` works, let's add a call to `getCurrentUser` within the `/dashboard` route. This creates a scenario where `getCurrentUser` is called twice per request: once directly in `DashboardPage`, and another time within the `<Navigation>` component (which is rendered on all pages, including `/`).

```tsx
export default async function DashboardPage() {
  await getCurrentUser()
  const issues = await getIssues()

  //.. rest of the function
}
```

If you refresh the page, you might expect to see the "getting user" log only once, indicating that the function is being cached. However, in development mode, you'll likely see it multiple times. This is because Next.js, with React Fast Refresh, may re-render components more frequently, and each render is treated as a separate request, thus invalidating the memoization provided by `cache`. The `cache` function memoizes the result of a function _for the duration of a single request_, not across multiple renders in development.

To accurately observe the caching behavior, you'll need to create a production build and run the application in production mode.

Also, you might encounter TypeScript or ESLint errors during the build process. You can configure Next.js to ignore these errors temporarily by modifying the `next.config.js` file. _Note: It is generally recommended to fix these errors rather than ignoring them._

```js
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    dynamicIO: true,
  },
  // ignore ts errors
  typescript: {
    ignoreBuildErrors: true,
  },
  // ignore eslint errors
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
```

```
npm run build
npm start
```

You should now, just see one log.
