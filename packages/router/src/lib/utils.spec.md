# Module: lib/utils.ts

Status: stable
Intent: Re-export utility functions from UI package for convenient access within router package.

## Exports

```ts
export { cn } from "@nouvelle/ui";
```

## Purpose & Behavior

- **Utility re-export**: Provides direct access to `cn` utility without importing from `@nouvelle/ui`
- **Package abstraction**: Isolates direct dependency on UI package implementation
- **Import convenience**: Allows router package code to use `@/lib/utils` pattern

## Dependencies

- `@nouvelle/ui` - Source of `cn` utility function

## Usage Examples

### Conditional className merging

```ts
import { cn } from '@/lib/utils';

// Instead of: import { cn } from '@nouvelle/ui';
const MyComponent = ({ className, isActive }) => (
  <div className={cn('base-class', isActive && 'active-class', className)} />
);
```

## Design Rationale

- **Consistency**: Matches common pattern of having local `lib/utils` import path
- **Flexibility**: Easy to add router-specific utilities in future
- **Abstraction**: Can switch UI library without updating all import paths

## Future Improvements

- **Add router-specific utilities**: Path manipulation, URL building helpers
- **Add type utilities**: Type guards, type transformations
- **Add validation utilities**: Runtime validation helpers

## Related Files

- Uses: `@nouvelle/ui/src/lib/utils.ts` - Source of cn function
- Used by: All router components needing className manipulation

Last updated: 2025-11-12
