import { QueryClient } from '@tanstack/react-query';

/**
 * Global QueryClient configuration for React Query
 *
 * Cache Strategy: Aggressive
 * - staleTime: 1 minute - Data is considered fresh for 1 minute
 * - gcTime: 5 minutes - Unused data is garbage collected after 5 minutes
 * - retry: Smart retry logic that doesn't retry auth errors (401)
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on auth errors
        const status = (error as any)?.status || (error as any)?.response?.status;
        if (status === 401 || status === 403) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      refetchOnWindowFocus: true, // Refetch when user returns to tab
      refetchOnReconnect: true, // Refetch when internet reconnects
    },
    mutations: {
      retry: false, // Don't retry mutations by default
    },
  },
});
