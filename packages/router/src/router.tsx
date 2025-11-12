import { createRouter } from '@tanstack/react-router';
import { routeTree } from './route-tree';

// Define the router context interface
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

// Create and export the router instance
export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  context: undefined!, // Context will be provided by RouterProvider
});

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }

  interface RouterContext extends AppRouterContext {}
}

// Export the router type
export type Router = typeof router;
