# Module: lib/query-client.ts

Status: stable
Intent: Global React Query configuration with aggressive caching, smart retry logic, and automatic refetching strategies.

## Exports

```ts
export const queryClient: QueryClient;
```

## Purpose & Behavior

### Core Functionality

- **Global QueryClient instance**: Single shared QueryClient for entire application
- **Aggressive caching**: 1-minute stale time, 5-minute garbage collection
- **Smart retry logic**: Avoids retrying auth errors (401, 403)
- **Automatic refetching**: Refetch on window focus and network reconnection
- **No mutation retries**: Mutations are one-shot operations

## Configuration

### Query Defaults

```ts
{
  staleTime: 1 * 60 * 1000,        // 1 minute - data fresh for this long
  gcTime: 5 * 60 * 1000,           // 5 minutes - cache cleared after this
  retry: (failureCount, error) => {
    // Don't retry auth errors
    if (status === 401 || status === 403) return false;
    // Retry up to 2 times for other errors
    return failureCount < 2;
  },
  refetchOnWindowFocus: true,      // Refetch when user returns to tab
  refetchOnReconnect: true,        // Refetch when internet reconnects
}
```

### Mutation Defaults

```ts
{
  retry: false,  // Never retry mutations automatically
}
```

## Cache Strategy: Aggressive

### What "Aggressive Caching" Means

- **Short stale time (1 min)**: Data is considered "fresh" for only 1 minute
- **After 1 minute**: Data becomes "stale" but still cached
- **Stale data behavior**: Shown immediately, refetched in background
- **No data**: Loading state until fetch completes
- **After 5 minutes**: Unused cached data garbage collected

### Cache Lifecycle Example

```
Time 0:00 - Initial fetch, data cached, status: "fresh"
Time 0:30 - Data still fresh, no refetch needed
Time 1:00 - Data becomes stale, shown immediately but refetch triggered
Time 1:01 - Background refetch completes, cache updated
Time 5:00 - If not used, data garbage collected
Time 5:01 - Access after GC triggers fresh fetch
```

## Smart Retry Logic

### Auth Error Detection

```ts
const status = error?.status || error?.response?.status;
if (status === 401 || status === 403) {
  return false;  // Don't retry, let auth context handle it
}
```

**Rationale**: Auth errors should trigger logout/redirect, not endless retries

### Other Errors

- **Network errors**: Retry up to 2 times
- **5xx errors**: Retry up to 2 times
- **4xx errors (except 401/403)**: Retry up to 2 times
- **After 2 retries**: Query marked as error, can be manually refetched

## Automatic Refetching

### Window Focus Refetch

```ts
refetchOnWindowFocus: true
```

**Behavior**: When user switches back to browser tab, stale queries refetch

**Use case**: User switches to email, gets verification code, switches back → auto-refresh

### Reconnect Refetch

```ts
refetchOnReconnect: true
```

**Behavior**: When internet connection restored, stale queries refetch

**Use case**: User on train, goes through tunnel, reconnects → auto-refresh

## Mutation Behavior

### No Automatic Retry

```ts
retry: false
```

**Rationale**: Mutations have side effects (create, update, delete). Automatic retry could:
- Create duplicate entries
- Apply updates multiple times
- Delete items unexpectedly

**User control**: User can manually retry mutations via UI (e.g., "Retry" button)

## Dependencies

- `@tanstack/react-query` - React Query library

## Usage Examples

### App Setup

```tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@nouvelle/router';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

### Context Usage

```tsx
// Inside context provider
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Invalidate queries after mutation
queryClient.invalidateQueries({ queryKey: ['workspaces'] });

// Update query cache directly
queryClient.setQueryData(['auth', 'me', token], { user, token });

// Clear all queries (e.g., on logout)
queryClient.clear();
```

### Custom Query Configuration

```tsx
// Override defaults for specific query
const { data } = useQuery({
  queryKey: ['pages', workspaceId],
  queryFn: fetchPages,
  staleTime: 5 * 60 * 1000,  // Override: 5 minutes for this query
  retry: 0,                   // Override: Don't retry this query
});
```

## Performance Characteristics

### Memory Usage

- **Active queries**: Minimal overhead (~1KB per query)
- **Cached data**: Depends on API response sizes
- **Garbage collection**: Automatic cleanup after 5 minutes
- **Total overhead**: ~10-50KB for typical app (10-50 queries)

### Network Usage

- **Initial load**: All enabled queries fetch
- **Window focus**: Only stale queries refetch
- **Background refetch**: Transparent to user, updates cache
- **Deduplication**: Multiple components using same query = single request

## Cache Behavior Examples

### User Authentication

```ts
// Query: ['auth', 'me', token]
// - Stale after 1 minute
// - Refetch on window focus → ensures valid session
// - Don't retry 401 → triggers logout instead
```

### Workspace List

```ts
// Query: ['workspaces', token]
// - Stale after 1 minute
// - Refetch on window focus → shows new workspaces from other devices
// - Cached for 5 minutes → fast navigation
```

### Page Tree

```ts
// Query: ['pages', workspaceId]
// - Stale after 1 minute
// - Refetch on focus → shows changes from collaborators
// - Invalidated after mutations → manual refresh guarantee
```

## DevTools Integration

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**DevTools features**:
- View all queries and their states
- Inspect cached data
- Manually trigger refetch
- See query timelines
- Debug stale/fresh status

## Troubleshooting

### Query Never Refetches

**Problem**: Data stuck in cache, never updates

**Causes**:
- `enabled: false` prevents query from running
- Query key doesn't change when it should
- staleTime overridden to Infinity

**Solution**: Check query key dependencies, verify enabled conditions

### Too Many Refetches

**Problem**: Excessive network requests

**Causes**:
- Query key changing unnecessarily
- refetchOnWindowFocus firing too often
- Aggressive staleTime (too short)

**Solution**: Increase staleTime, memoize query key dependencies

### Auth Errors Loop

**Problem**: Query retries 401 errors repeatedly

**Expected**: Our config prevents this with smart retry logic

**If happening**: Check error object structure matches `error.status` or `error.response.status`

## Future Improvements

- **Persister**: Persist cache to localStorage/IndexedDB for offline support
- **Optimistic updates**: Update UI immediately before server confirms
- **Request batching**: Combine multiple queries into single request
- **Prefetching**: Preload data for likely next navigation
- **Streaming updates**: WebSocket integration for real-time updates
- **Selective refetch**: Only refetch queries with specific tags
- **Custom retry strategies**: Per-query retry logic with exponential backoff

## Comparison to Other Strategies

### Conservative Caching (5min stale, 30min gc)

- **Pros**: Fewer network requests, better perceived performance
- **Cons**: Stale data shown longer, delayed updates
- **Use case**: Static content, infrequent updates

### Aggressive Caching (1min stale, 5min gc) ✅ Current

- **Pros**: Balance of freshness and performance
- **Cons**: More network requests than conservative
- **Use case**: Collaborative apps with moderate update frequency

### No Caching (0ms stale, 0ms gc)

- **Pros**: Always fresh data
- **Cons**: Excessive requests, poor UX, slow performance
- **Use case**: Financial data, real-time critical apps

## Related Files

- Used by: `auth-context.tsx`, `workspace-context.tsx`, `page-context.tsx` - All contexts use this client
- Complements: `api-client.ts` - API layer called by query functions
- Configured in: `router.tsx` or `main.tsx` - QueryClientProvider wrapper

Last updated: 2025-11-12
