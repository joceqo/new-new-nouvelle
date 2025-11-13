# Module: types.ts

Status: stable
Intent: Type exports and type utilities for router integration, providing type-safe navigation and route parameter access.

## Type Contract

```ts
// Re-exported router types
export type { Router, RouteTree };

// Type-safe route identifiers
export type RouteIds = Parameters<Router['navigate']>[0]['to'];

// Extract specific route by ID
export type RouteById<TId extends string> = Extract<
  Router['routesByPath'][keyof Router['routesByPath']],
  { id: TId }
>;

// Route parameter types (placeholder - needs implementation)
export type RouteParams<_TPath extends string = string> = any;

// Route search parameter types (placeholder - needs implementation)
export type RouteSearch<_TPath extends string = string> = any;
```

## Purpose & Behavior

- **Type re-exports**: Provides centralized access to Router and RouteTree types
- **RouteIds**: Extracts all valid route paths from Router navigate function
- **RouteById**: Type-safe route lookup by string identifier
- **RouteParams**: Generic type for route parameters (currently untyped)
- **RouteSearch**: Generic type for search/query parameters (currently untyped)

## Type Safety Features

- **Navigate type safety**: RouteIds ensures only valid routes can be navigated to
- **Route extraction**: RouteById provides compile-time verification of route existence
- **Generic parameters**: Placeholder types allow for future strong typing of route params

## Dependencies

- `./router` - Router type import
- `./route-tree` - RouteTree type import
- TypeScript utility types: `Parameters`, `Extract`, `keyof`

## Known Limitations

- **RouteParams**: Currently typed as `any` - needs route-specific implementation
- **RouteSearch**: Currently typed as `any` - needs route-specific implementation
- **Generic constraints**: Type parameters are not fully constrained to actual route paths

## Usage Examples

### Type-safe navigation

```ts
import type { RouteIds } from '@nouvelle/router';

// Type error if route doesn't exist
const navigateToPage = (routeId: RouteIds) => {
  router.navigate({ to: routeId });
};
```

### Route extraction

```ts
import type { RouteById } from '@nouvelle/router';

// Get specific route type
type HomeRoute = RouteById<'/home'>;
```

### Router integration

```ts
import type { Router, RouteTree } from '@nouvelle/router';

// Use router types in components
interface NavigationProps {
  router: Router;
  routeTree: RouteTree;
}
```

## Future Improvements

- **Implement RouteParams**: Generate specific parameter types for each route
- **Implement RouteSearch**: Generate specific search param types for each route
- **Add route metadata**: Include route metadata in type definitions
- **Path parameter extraction**: Automatic extraction of path parameters from route strings
- **Query parameter validation**: Runtime validation matching TypeScript types

## Related Files

- `router.tsx` - Router implementation and type source
- `route-tree.tsx` - Route tree structure and configuration
- `index.ts` - Public API exports

Last updated: 2025-11-12