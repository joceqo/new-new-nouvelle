import type { Router } from './router';
import type { RouteTree } from './route-tree';

// Export useful types for consuming packages
export type { Router, RouteTree };

// Type-safe route IDs - all valid route paths
export type RouteIds = Parameters<Router['navigate']>[0]['to'];

// Get route by ID with proper typing
export type RouteById<TId extends string> = Extract<
  Router['routesByPath'][keyof Router['routesByPath']],
  { id: TId }
>;

// Type-safe params for a specific route
// Note: These types are complex and may need adjustment based on your specific routes
export type RouteParams<_TPath extends string = string> = any;

// Type-safe search params for a specific route
export type RouteSearch<_TPath extends string = string> = any;
