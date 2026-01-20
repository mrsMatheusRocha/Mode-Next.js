# Project Structure and Configuration

## Next.js App Directory Structure

Next.js 13+ introduced the App Router with a new `app/` directory structure. Let's explore the file and folder organization in a Next.js project:

> **Important Note**: Next.js only enforces conventions for the `app/`, `public/`, and `api/` directories. Everything else is up to you.

### Next.js Enforced Conventions

- **`app/`**: The main directory for your application code using the App Router

  - **`page.tsx`**: Defines the UI for a route
  - **`layout.tsx`**: Shared UI wrapper for a segment and its children
  - **`loading.tsx`**: Loading UI for a segment
  - **`error.tsx`**: Error handling UI for a segment
  - **`not-found.tsx`**: 404 UI for a segment

- **`app/api/`**: API routes for creating endpoints

  - Example: `app/api/users/route.ts`

- **`public/`**: Static assets like images, fonts, and files
  - Served at the root path (e.g., `/logo.svg`)
  - Not processed by the build system

### Common Organizational Patterns (Not Enforced)

The following are common patterns but are **not required** by Next.js:

- **Component Organization**

  - `app/components/`: Reusable UI components
  - `app/ui/`: Basic UI elements

- **Route Organization**

  - `app/(group)/`: Route groups for organizational purposes (doesn't affect URL)

- **Other Common Folders**
  - `app/lib/` or `lib/`: Utility functions and shared code
  - `app/styles/`: Component or page-specific styles
  - `app/hooks/`: Custom React hooks
  - `app/context/`: React context providers
  - `app/types/` or `types/`: TypeScript type definitions

### File Placement Flexibility

Next.js gives you freedom in where you place most files. For example:

- You can put components directly in route folders or in a central components directory
- Utility functions can live in the route where they're used or in a shared directory
- Styles can be colocated with components or centralized

## Summary

Next.js only cares about:

1. **`app/`**: For App Router pages and routing
2. **`public/`**: For static assets
3. **`app/api/`**: For API routes

Everything else—how you organize components, utilities, styles, and other code—is entirely up to you. Choose a structure that makes sense for your project and team.
