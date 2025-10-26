# @nouvelle/router

Centralized routing package for the Nouvelle monorepo using TanStack Router.

## Overview

This package provides a shared routing configuration for both the web and desktop applications. It uses TanStack Router to provide type-safe, file-system-like routing with excellent TypeScript support.

## Features

- Type-safe routing with full TypeScript support
- Shared route definitions across web and desktop apps
- Type-safe navigation with `RouteIds`
- Type-safe params and search params
- Centralized route management

## Installation

This package is part of the monorepo and is automatically linked via pnpm workspaces.

```bash
pnpm install
```

## Usage

### In your app (e.g., apps/web or apps/desktop)

```tsx
import { RouterProvider, router } from '@nouvelle/router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
```

### Type-safe navigation

```tsx
import { useNavigate, Link, type RouteIds } from '@nouvelle/router';

function MyComponent() {
  const navigate = useNavigate();

  // Type-safe navigation
  const handleClick = () => {
    navigate({ to: '/documents/$documentId', params: { documentId: '123' } });
  };

  return (
    <div>
      {/* Type-safe Link */}
      <Link to="/about">About</Link>

      {/* Dynamic route with params */}
      <Link to="/documents/$documentId" params={{ documentId: '456' }}>
        View Document
      </Link>
    </div>
  );
}
```

### Using route params

```tsx
import { useParams } from '@nouvelle/router';

function DocumentView() {
  const { documentId } = useParams({ from: '/documents/$documentId' });

  return <div>Viewing document: {documentId}</div>;
}
```

## Adding New Routes

To add a new route:

1. Open `src/route-tree.tsx`
2. Create a new route using the `Route` class:

```tsx
export const myNewRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/my-new-path',
  component: () => <div>My New Page</div>,
});
```

3. Add the route to the route tree:

```tsx
export const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  documentRoute,
  editorRoute,
  myNewRoute, // Add your new route here
]);
```

## Structure

```
packages/router/
├── src/
│   ├── index.ts        # Main exports
│   ├── route-tree.tsx  # Route definitions
│   ├── router.tsx      # Router instance
│   └── types.ts        # TypeScript types
├── package.json
├── tsconfig.json
└── README.md
```

## Exported Types

- `Router` - The router instance type
- `RouteTree` - The route tree type
- `RouteIds` - Union of all valid route paths
- `RouteById<TId>` - Get a specific route by ID
- `RouteParams<TPath>` - Get params for a specific route
- `RouteSearch<TPath>` - Get search params for a specific route

## Best Practices

1. **Avoid circular dependencies**: Don't import components from feature packages directly into route definitions. Instead, lazy load them or pass them as props.

2. **Co-locate route-specific logic**: While the route definitions live here, route-specific components can live in feature packages (like `@nouvelle/ui` or `@nouvelle/editor`).

3. **Use type-safe navigation**: Always use the exported types (`RouteIds`, `RouteParams`, etc.) for type-safe navigation.

4. **Lazy loading**: For larger apps, consider lazy loading route components:

```tsx
export const myRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/my-path',
  component: lazy(() => import('./MyComponent')),
});
```

## Learn More

- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [TanStack Router Monorepo Example](https://tanstack.com/router/latest/docs/framework/react/examples/router-monorepo-simple)
