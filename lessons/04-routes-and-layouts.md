# Creating Routes and Layouts

Next.js simplifies routing through its intuitive file system-based router. To define a route, you create a directory within the `app` directory and include a `page.tsx` (or `.js`) file. For example, `app/settings/page.tsx` will create a route accessible at `/settings`. This convention extends to layouts and other special files, forming the basis of Next.js's opinionated approach to web development.

## Static Routes

Static routes are the most basic type of route in Next.js. As demonstrated above, simply placing a `page.tsx` file within a directory creates a static route. Next.js will automatically make this file accessible as a route. Only files named `page` are treated as route components within a directory, with a few exceptions for special files like `layout` and `loading`.

## Dynamic Routes

For dynamic routes, use square brackets `[]` to define parameters within your directory structure. For instance, `app/users/[id]/page.tsx` creates a dynamic route where `[id]` is a parameter. This route would match paths like `/users/123`, `/users/abc`, etc.

**Catch-all Segments:**

Next.js also supports catch-all segments using `[...paramName]`. For example, `app/docs/[...topic]/page.tsx` will match any path starting with `/docs/`, such as `/docs/a/b/c`.

**Optional Catch-all Segments:**

To make a catch-all segment optional (i.e., also match the base route), use `[[...paramName]]`. `app/docs/[[...topic]]/page.tsx` would match both `/docs` and `/docs/a/b`.

## Layouts

Layouts are React components that wrap page components, providing a consistent UI structure across routes. To create a layout, add a `layout.tsx` file within a directory. A root layout is required in the `app` directory to wrap all routes. Layouts persist across page transitions, meaning they do not re-render when navigating between routes that share the same layout.

To render the current page within a layout, use the `{children}` prop.

**Templates:**

If you need a layout-like component that re-renders on every route change, use a `template.tsx` file instead of `layout.tsx`. Templates behave similarly to layouts but are not persistent. Routes will use the nearest `layout` or `template` in their ancestor directory structure.

## Route Groups

Route groups allow you to organize routes without affecting the URL path structure. By wrapping a directory name in parentheses, like `(group-name)`, you create a route group. This is useful for applying layouts to multiple routes without segmenting the URL.

For example, you might use route groups to separate marketing pages from application pages within the `app` directory, like `app/(marketing)/` and `app/(app)/`. This allows you to define different layouts for each group (e.g., a marketing layout and an application layout) without `/marketing/` or `/app/` appearing in the URL paths.

## Routing

Use the `<Link>` component. It performs prefetching of routes and client side routing. If you don't use this you will be navigating with full page loads from the server.

There's much more to explore in the [official documentation](https://nextjs.org/docs/app/building-your-application/routing).

## Exercise

Look at the routes below. Create each one of them. Remember to export a React component as the default export in each `page.tsx` file. The component can render `null` if you just want to test the routing. For layouts, be sure to render `{children}`.

```
* root layout
/(auth)
  /sigin
  /signup
/(marketing)
  * layout
  /
/dashboard
  * layout
  /
/issues
  /new
  /[id]
    /edit
```
