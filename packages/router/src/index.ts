// Export the router instance
export { router } from "./router";
export type { Router } from "./router";

// Export React Query client
export { queryClient } from "./lib/query-client";

// Export route tree
export { routeTree } from "./route-tree";
export type { RouteTree } from "./route-tree";

// Export individual routes (useful for features that need to reference specific routes)
export {
  rootRoute,
  appRoute,
  indexRoute,
  aboutRoute,
  documentRoute,
  editorRoute,
  loginRoute,
  onboardingRoute,
  magicLinkRoute,
  gettingStartedRoute,
  inviteRoute,
} from "./route-tree";

// Export types for consumers
export type { RouteIds, RouteById, RouteParams, RouteSearch } from "./types";

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
} from "@tanstack/react-router";

// Export auth functionality
export { AuthProvider, useAuth } from "./lib/auth-context";
export {
  authApiClient,
  AuthApiClient,
  workspaceApiClient,
  WorkspaceApiClient,
} from "./lib/api-client";
export type {
  User,
  AuthState,
  SendCodeResponse,
  VerifyCodeResponse,
  GetMeResponse,
} from "./lib/types";

// Export workspace functionality
export { WorkspaceProvider, useWorkspace } from "./lib/workspace-context";
export type {
  Workspace,
  WorkspaceMember,
  WorkspaceInvite,
  WorkspaceState,
  ListWorkspacesResponse,
  CreateWorkspaceResponse,
  WorkspaceDetailsResponse,
} from "./lib/types";

// Export page functionality
export { PageProvider, usePage, type Page } from "./lib/page-context";
