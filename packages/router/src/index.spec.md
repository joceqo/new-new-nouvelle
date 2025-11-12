# Module: index.ts

Status: stable
Intent: Public API barrel export for @nouvelle/router package, providing clean import paths for all router functionality, context providers, types, and utilities.

## Purpose & Behavior

### Core Functionality

- **Barrel exports**: Single entry point for all router package exports
- **Organized exports**: Groups exports by domain (routing, auth, workspace, page, theme)
- **Type re-exports**: Provides TypeScript types alongside runtime exports
- **Third-party re-exports**: Re-exports commonly used TanStack Router utilities

### Export Categories

1. **Routing**: Router instance, route tree, individual routes
2. **React Query**: Query client configuration
3. **Types**: Type definitions for routes and parameters
4. **TanStack Router**: Commonly used hooks and components
5. **Auth**: Authentication context, hooks, API clients, types
6. **Workspace**: Workspace management context, hooks, types
7. **Page**: Page management context, hooks, types
8. **Theme**: Theme management context, hooks

## Exports

### Routing Exports

```ts
// Router instance
export { router } from "./router";
export type { Router } from "./router";

// Route tree
export { routeTree } from "./route-tree";
export type { RouteTree } from "./route-tree";

// Individual routes
export {
  rootRoute,
  appRoute,
  indexRoute,
  aboutRoute,
  documentRoute,
  editorRoute,
  loginRoute,
  onboardingRoute,
  magicLinkRoute,
  gettingStartedRoute,
  inviteRoute,
} from "./route-tree";

// Route types
export type { RouteIds, RouteById, RouteParams, RouteSearch } from "./types";
```

### React Query Exports

```ts
export { queryClient } from "./lib/query-client";
```

### TanStack Router Re-exports

```ts
export {
  Link,
  Outlet,
  RouterProvider,
  useNavigate,
  useParams,
  useSearch,
  useRouter,
  useRouterState,
  useMatch,
  useMatches,
} from "@tanstack/react-router";
```

### Auth Exports

```ts
// Context and hooks
export { AuthProvider, useAuth } from "./lib/auth-context";

// API clients
export {
  authApiClient,
  AuthApiClient,
  workspaceApiClient,
  WorkspaceApiClient,
} from "./lib/api-client";

// Types
export type {
  User,
  AuthState,
  SendCodeResponse,
  VerifyCodeResponse,
  GetMeResponse,
} from "./lib/types";
```

### Workspace Exports

```ts
// Context and hooks
export { WorkspaceProvider, useWorkspace } from "./lib/workspace-context";

// Types
export type {
  Workspace,
  WorkspaceMember,
  WorkspaceInvite,
  WorkspaceState,
  ListWorkspacesResponse,
  CreateWorkspaceResponse,
  WorkspaceDetailsResponse,
} from "./lib/types";
```

### Page Exports

```ts
export { PageProvider, usePage, type Page } from "./lib/page-context";
```

### Theme Exports

```ts
export { ThemeProvider, useTheme } from "./lib/theme-context";
```

## Usage Examples

### Clean Imports

```tsx
// ✅ Good - Import from package
import {
  router,
  RouterProvider,
  useAuth,
  useWorkspace,
  usePage,
  useNavigate,
} from '@nouvelle/router';

// ❌ Bad - Deep imports
import { router } from '@nouvelle/router/src/router';
import { useAuth } from '@nouvelle/router/src/lib/auth-context';
```

### App Setup

```tsx
import { RouterProvider, router, AuthProvider, WorkspaceProvider, PageProvider, ThemeProvider } from '@nouvelle/router';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WorkspaceProvider>
          <PageProvider>
            <RouterProvider router={router} />
          </PageProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
```

### Component Usage

```tsx
import { useAuth, useWorkspace, usePage, useNavigate, Link } from '@nouvelle/router';

function MyComponent() {
  const { user } = useAuth();
  const { activeWorkspace } = useWorkspace();
  const { pages } = usePage();
  const navigate = useNavigate();

  return (
    <div>
      <h1>{user?.email}</h1>
      <h2>{activeWorkspace?.name}</h2>
      <ul>
        {pages.map(page => (
          <li key={page.id}>
            <Link to={`/page/${page.id}`}>{page.title}</Link>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate({ to: '/home' })}>
        Go Home
      </button>
    </div>
  );
}
```

### Type-Safe Navigation

```tsx
import { useNavigate, type RouteIds } from '@nouvelle/router';

function Navigation() {
  const navigate = useNavigate();

  const goTo = (routeId: RouteIds) => {
    navigate({ to: routeId });  // Type-safe!
  };

  return (
    <nav>
      <button onClick={() => goTo('/home')}>Home</button>
      <button onClick={() => goTo('/about')}>About</button>
      {/* <button onClick={() => goTo('/invalid')}>Invalid</button>  // ❌ Type error */}
    </nav>
  );
}
```

### API Client Usage (Testing/Scripts)

```tsx
import { authApiClient, workspaceApiClient } from '@nouvelle/router';

// Testing or scripts only - not for components!
const response = await authApiClient.sendCode('test@example.com');
const workspaces = await workspaceApiClient.listWorkspaces(token);
```

## Design Rationale

### Barrel Export Pattern

**Benefits**:
- Single import source for consumers
- Hides internal file structure
- Easy to refactor internals without breaking imports
- Groups related functionality

**Trade-offs**:
- Larger import bundle (but tree-shaking mitigates this)
- All exports must be named (no default exports)

### Third-Party Re-exports

TanStack Router utilities are re-exported for convenience:

```tsx
// ✅ Good - Import from @nouvelle/router
import { Link, useNavigate } from '@nouvelle/router';

// ❌ Less convenient - Import from TanStack Router directly
import { Link, useNavigate } from '@tanstack/react-router';
```

**Benefits**:
- Consistent import source
- Easier to swap routing library in future
- Better DX (Developer Experience)

### Individual Route Exports

Specific routes are exported for advanced use cases:

```tsx
import { homeRoute, loginRoute } from '@nouvelle/router';

// Advanced: Programmatic route matching
if (router.state.matches.some(match => match.routeId === homeRoute.id)) {
  console.log('Currently on home route');
}
```

## Package Structure

```
@nouvelle/router/
├── index.ts          ← Public API (THIS FILE)
├── router.tsx        ← Router configuration
├── route-tree.tsx    ← Route definitions
├── types.ts          ← Route types
└── lib/
    ├── auth-context.tsx
    ├── workspace-context.tsx
    ├── page-context.tsx
    ├── theme-context.tsx
    ├── api-client.ts
    ├── query-client.ts
    └── types.ts
```

## Dependencies

- All internal modules (via relative imports)
- `@tanstack/react-router` - Router utilities re-export

## Tree-Shaking

### ESM Module Format

The package should be built as ESM for optimal tree-shaking:

```json
// package.json
{
  "type": "module",
  "exports": {
    ".": "./dist/index.js"
  }
}
```

### Unused Export Elimination

Bundlers like Vite/Rollup will eliminate unused exports:

```tsx
// If component only uses useAuth:
import { useAuth } from '@nouvelle/router';

// Bundler eliminates: useWorkspace, usePage, router, etc.
```

## Future Improvements

- **Subpath exports**: Allow `@nouvelle/router/auth`, `@nouvelle/router/workspace` imports
- **Documentation**: JSDoc comments on all exports for IDE hover documentation
- **Export groups**: Group related exports with namespace objects
- **Lazy loading**: Code-split context providers for better initial bundle size

## Subpath Exports (Future)

```json
// package.json
{
  "exports": {
    ".": "./dist/index.js",
    "./auth": "./dist/lib/auth-context.js",
    "./workspace": "./dist/lib/workspace-context.js",
    "./page": "./dist/lib/page-context.js",
    "./theme": "./dist/lib/theme-context.js"
  }
}
```

Usage:
```tsx
import { useAuth } from '@nouvelle/router/auth';
import { useWorkspace } from '@nouvelle/router/workspace';
```

**Benefits**: Smaller bundles, clearer imports

## Related Files

- Exports: Everything in `src/` directory
- Used by: All consuming applications (@nouvelle/web, @nouvelle/desktop)
- Package manifest: `package.json` defines exports

Last updated: 2025-11-12
