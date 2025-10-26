import { RootRoute, Route, Outlet } from '@tanstack/react-router';

// Root route - this is the layout wrapper for all routes
export const rootRoute = new RootRoute({
  component: Outlet,
});

// Index route - the home page
export const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <div>Home Page</div>,
});

// Example: About route
export const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: () => <div>About Page</div>,
});

// Example: Dynamic route with params
export const documentRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/documents/$documentId',
  component: () => <div>Document View</div>,
});

// Example: Editor route
export const editorRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/editor',
  component: () => <div>Editor</div>,
});

// Create the route tree
export const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  documentRoute,
  editorRoute,
]);

// Export route IDs type for type-safe navigation
export type RouteTree = typeof routeTree;
