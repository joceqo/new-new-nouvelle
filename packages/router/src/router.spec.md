# Module: router.tsx

Status: stable
Intent: TanStack Router configuration with context type definitions and type-safe registration for auth and workspace state.

## Exports

```ts
export const router: Router;
export type Router = typeof router;

export interface AppRouterContext {
  auth: {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: any | null;
  };
  workspace: {
    workspaces: any[];
    activeWorkspace: any | null;
    isLoading: boolean;
  };
}
```

## Purpose & Behavior

### Core Functionality

- **Router instance**: Singleton router configured with route tree
- **Context typing**: Type-safe context for auth and workspace state
- **Intent preloading**: Preloads routes on hover/focus for instant navigation
- **TypeScript registration**: Extends TanStack Router types for full type safety

## Router Configuration

### createRouter Options

```ts
export const router = createRouter({
  routeTree,                    // Route definitions
  defaultPreload: 'intent',     // Preload on hover/focus
  defaultPreloadStaleTime: 0,   // Preload immediately (no staleness threshold)
  context: undefined!,          // Context provided by RouterProvider at runtime
});
```

### Configuration Options Explained

#### defaultPreload: 'intent'

**Options**: `'intent'` | `'viewport'` | `false`

**Chosen**: `'intent'` - Preload when user hovers or focuses link

**Benefits**:
- Near-instant navigation on click
- Balances preloading with bandwidth usage
- Better UX than `false` (no preload)
- More conservative than `'viewport'` (preload all visible links)

#### defaultPreloadStaleTime: 0

**Value**: `0` milliseconds

**Meaning**: Always preload, even if data was recently fetched

**Benefits**:
- Ensures fresh data on navigation
- Works well with React Query caching strategy (1min stale time)

**Trade-off**: May refetch data unnecessarily, but React Query deduplication helps

## AppRouterContext

### Context Shape

```ts
{
  auth: {
    isAuthenticated: boolean,  // True if user logged in
    isLoading: boolean,        // True during auth check
    user: any | null,          // User object if authenticated
  },
  workspace: {
    workspaces: any[],         // List of user's workspaces
    activeWorkspace: any | null,  // Currently selected workspace
    isLoading: boolean,        // True during workspace fetch
  }
}
```

### Context Usage in Routes

Routes can access context in `beforeLoad`:

```tsx
export const protectedRoute = createRoute({
  beforeLoad: async ({ context }) => {
    const { auth, workspace } = context as AppRouterContext;

    // Wait for loading to complete
    if (auth.isLoading || workspace.isLoading) {
      return;  // Don't redirect while loading
    }

    // Check authentication
    if (!auth.isAuthenticated) {
      throw redirect({ to: '/login' });
    }

    // Check workspace
    if (workspace.workspaces.length === 0) {
      throw redirect({ to: '/onboarding' });
    }
  },
});
```

## TypeScript Module Augmentation

### Router Registration

```ts
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }

  interface RouterContext extends AppRouterContext {}
}
```

**Purpose**: Extend TanStack Router types with application-specific types

**Benefits**:
- Type-safe navigation: `navigate({ to: '/home' })` is validated
- Type-safe params: `useParams()` returns correct types
- Type-safe search: `useSearch()` returns correct types
- IDE autocomplete for routes

### Type Safety Example

```tsx
// ✅ Type-safe - route exists
navigate({ to: '/home' });

// ❌ Type error - route doesn't exist
navigate({ to: '/nonexistent' });

// ✅ Type-safe params
const { pageId } = useParams({ from: '/page/$pageId' });
// pageId is typed as string

// ✅ Type-safe context
const context = useRouterState().location.state.context;
// context has AppRouterContext shape
```

## Dependencies

- `@tanstack/react-router` - Router library
- `./route-tree` - Route definitions

## Usage Examples

### App Setup with Context

```tsx
import { RouterProvider } from '@tanstack/react-router';
import { router } from '@nouvelle/router';
import { useAuth } from '@nouvelle/router';
import { useWorkspace } from '@nouvelle/router';

function App() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { workspaces, activeWorkspace, isLoading: workspaceLoading } = useWorkspace();

  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          isAuthenticated,
          isLoading: authLoading,
          user,
        },
        workspace: {
          workspaces,
          activeWorkspace,
          isLoading: workspaceLoading,
        },
      }}
    />
  );
}
```

### Type-Safe Navigation

```tsx
import { router } from '@nouvelle/router';

// Programmatic navigation
router.navigate({ to: '/home' });
router.navigate({ to: '/page/$pageId', params: { pageId: 'abc123' } });

// With search params
router.navigate({
  to: '/search',
  search: { query: 'hello', filter: 'pages' }
});

// With state
router.navigate({
  to: '/page/$pageId',
  params: { pageId: 'abc123' },
  state: { from: 'sidebar' }
});
```

### Access Router State

```tsx
import { useRouterState } from '@nouvelle/router';

function CurrentRoute() {
  const { location, matches } = useRouterState();

  return (
    <div>
      <p>Current path: {location.pathname}</p>
      <p>Matched routes: {matches.map(m => m.routeId).join(' → ')}</p>
    </div>
  );
}
```

## Preloading Behavior

### Intent Preloading

```tsx
<Link to="/page/$pageId" params={{ pageId: 'abc123' }}>
  {/* On hover or focus: */}
  {/* 1. Router calls route loader */}
  {/* 2. Data fetched and cached */}
  {/* 3. On click: instant navigation with cached data */}
</Link>
```

### Preload API

```tsx
// Manual preloading
router.preloadRoute({ to: '/page/$pageId', params: { pageId: 'abc123' } });

// Preload on mount for faster navigation
useEffect(() => {
  router.preloadRoute({ to: '/home' });
}, []);
```

## Context vs Hooks

### Why Both?

**Context**: Passed to router for route guards (`beforeLoad`)

**Hooks**: Used in components for reactive state

```tsx
// Route uses context (snapshot)
beforeLoad: ({ context }) => {
  if (!context.auth.isAuthenticated) {
    throw redirect({ to: '/login' });
  }
},

// Component uses hooks (reactive)
function MyComponent() {
  const { isAuthenticated } = useAuth();  // Re-renders on change

  return <div>{isAuthenticated ? 'Logged in' : 'Logged out'}</div>;
}
```

**Key difference**: Context is passed once per navigation, hooks are reactive

## Performance Considerations

### Intent Preloading Trade-offs

**Pros**:
- Near-instant navigation
- Better perceived performance
- Minimal bandwidth waste

**Cons**:
- May fetch data user doesn't click
- Increased API calls for hover-heavy UI

**Mitigation**: React Query deduplicates requests, caches results

### Context Updates

Router context is **not reactive**. Updates don't trigger navigation.

**Correct**: Use hooks in components for reactive state

**Incorrect**: Expect router to re-evaluate `beforeLoad` when context changes

## Future Improvements

- **Lazy route loading**: Code-split routes for smaller initial bundle
- **Viewport preloading**: Option for aggressive preloading
- **Custom preload strategy**: Per-route preload configuration
- **Context reactivity**: Explore making context reactive (TanStack Router v2?)
- **Error boundaries**: Global error handling configuration
- **Loading states**: Global loading state management
- **SSR support**: Server-side rendering configuration

## Troubleshooting

### "context is undefined!" Error

**Symptom**: TypeScript error or runtime crash

**Cause**: RouterProvider not wrapping app or missing context prop

**Solution**:
```tsx
<RouterProvider
  router={router}
  context={{ auth: {...}, workspace: {...} }}  // ← Required!
/>
```

### Route Guards Not Working

**Symptom**: Protected routes accessible without auth

**Cause**: Context has stale data or loading state not handled

**Solution**: Check context values in route guards:
```tsx
beforeLoad: ({ context }) => {
  console.log('Context:', context);  // Debug context values

  if (context.auth.isLoading) {
    return;  // Wait for loading
  }

  if (!context.auth.isAuthenticated) {
    throw redirect({ to: '/login' });
  }
}
```

### Type Errors After Updating Routes

**Symptom**: TypeScript errors about invalid routes

**Cause**: Module augmentation cached by TypeScript

**Solution**: Restart TypeScript server in IDE

## Related Files

- Uses: `route-tree.tsx` - Route definitions
- Configured in: App component with `RouterProvider`
- Augments: `@tanstack/react-router` types
- Used by: All navigation hooks and components

Last updated: 2025-11-12
