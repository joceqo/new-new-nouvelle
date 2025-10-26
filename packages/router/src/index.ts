// Export the router instance
export { router } from './router';
export type { Router } from './router';

// Export route tree
export { routeTree } from './route-tree';
export type { RouteTree } from './route-tree';

// Export individual routes (useful for features that need to reference specific routes)
export {
  rootRoute,
  indexRoute,
  aboutRoute,
  documentRoute,
  editorRoute,
} from './route-tree';

// Export types for consumers
export type {
  RouteIds,
  RouteById,
  RouteParams,
  RouteSearch,
} from './types';

// Re-export commonly used TanStack Router utilities
export {
  Link,
  Outlet,
  RouterProvider,
  useNavigate,
  useParams,
  useSearch,
  useRouter,
  useRouterState,
  useMatch,
  useMatches,
} from '@tanstack/react-router';

// Export auth functionality
export { AuthProvider, useAuth } from './lib/auth-context';
export { authApiClient, AuthApiClient } from './lib/api-client';
export type {
  User,
  AuthState,
  SendCodeResponse,
  VerifyCodeResponse,
  GetMeResponse,
} from './lib/types';
