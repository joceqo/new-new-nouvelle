import { createRouter } from '@tanstack/react-router';
import { routeTree } from './route-tree';

// Create and export the router instance
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  // Add any other router configuration here
  context: {
    // You can add shared context that all routes can access
    // e.g., auth, user data, etc.
  },
});

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Export the router type
export type Router = typeof router;
