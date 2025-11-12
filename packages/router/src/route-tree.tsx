import { createRootRoute, createRoute, redirect } from "@tanstack/react-router";
import { LoginForm } from "./pages/login/LoginForm";
import { OnboardingPage } from "./pages/onboarding/OnboardingPage";
import { MagicLinkPage } from "./pages/auth/MagicLinkPage";
import { GettingStartedPage } from "./pages/getting-started/GettingStartedPage";
import { InvitePage } from "./pages/invite/InvitePage";
import { PageView } from "./pages/page/PageView";
import { HomePage } from "./pages/home/HomePage";
import { RootLayout, AuthenticatedLayout } from "./layouts";
import type { AppRouterContext } from "./router";

// Root route - base layout wrapper for all routes
export const rootRoute = createRootRoute({
  component: RootLayout,
});

// Auth layout route - pathless layout for authenticated app routes with sidebar
// Using id instead of path creates a pathless layout route
export const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  beforeLoad: async ({ context }) => {
    const { auth, workspace } = context as AppRouterContext;

    // Wait for auth AND workspace to finish loading
    if (auth.isLoading || workspace.isLoading) {
      return;
    }

    // Redirect to login if not authenticated
    if (!auth.isAuthenticated) {
      throw redirect({ to: "/login" });
    }

    // Redirect to onboarding if no workspaces (after loading is complete)
    if (workspace.workspaces.length === 0) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: AuthenticatedLayout,
});

// Public routes (no sidebar)
// Index route - login page with smart redirect
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: async ({ context }) => {
    const { auth, workspace } = context as AppRouterContext;

    // Wait for auth and workspace to finish loading
    if (auth.isLoading || workspace.isLoading) {
      return;
    }

    if (auth.isAuthenticated) {
      if (workspace.workspaces.length > 0) {
        // User has workspaces, check for last visited page or go to home
        const lastVisitedPage = localStorage.getItem('nouvelle_last_visited_page');
        if (lastVisitedPage && lastVisitedPage !== '/login' && lastVisitedPage !== '/onboarding') {
          throw redirect({ to: lastVisitedPage as any });
        } else {
          throw redirect({ to: "/home" });
        }
      } else {
        // New user, redirect to onboarding
        throw redirect({ to: "/onboarding" });
      }
    }
    // If not authenticated, continue to render LoginForm
  },
  component: LoginForm,
});

// Login route with smart redirect
export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: async ({ context }) => {
    const { auth, workspace } = context as AppRouterContext;

    // Wait for auth and workspace to finish loading
    if (auth.isLoading || workspace.isLoading) {
      return;
    }

    if (auth.isAuthenticated) {
      if (workspace.workspaces.length > 0) {
        // User has workspaces, check for last visited page or go to home
        const lastVisitedPage = localStorage.getItem('nouvelle_last_visited_page');
        if (lastVisitedPage && lastVisitedPage !== '/login' && lastVisitedPage !== '/onboarding') {
          throw redirect({ to: lastVisitedPage as any });
        } else {
          throw redirect({ to: "/home" });
        }
      } else {
        // New user, redirect to onboarding
        throw redirect({ to: "/onboarding" });
      }
    }
    // If not authenticated, continue to render LoginForm
  },
  component: LoginForm,
});

// Onboarding route
export const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/onboarding",
  component: OnboardingPage,
});

// Magic link verification route
export const magicLinkRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auth/magic-link",
  component: MagicLinkPage,
});

// Workspace invite acceptance route
export const inviteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/invite/$token",
  component: InvitePage,
});

// Authenticated routes (with sidebar)
// Home route - default landing page for authenticated users
export const homeRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/home",
  component: HomePage,
});

// Getting Started route
export const gettingStartedRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/getting-started/$pageId",
  component: GettingStartedPage,
});

// About route
export const aboutRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/about",
  component: () => <div>About Page</div>,
});

// Dynamic route with params
export const documentRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/documents/$documentId",
  component: () => <div>Document View</div>,
});

// Editor route
export const editorRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/editor",
  component: () => <div>Editor</div>,
});

// Page view route
export const pageRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/page/$pageId",
  component: PageView,
});

// Notion-style catch-all page route
// Matches any URL like /Getting-Started-abc123 or /abc123
export const notionPageRoute = createRoute({
  getParentRoute: () => appRoute,
  path: "/$pageSlug",
  component: PageView,
});

// Create the route tree
export const routeTree = rootRoute.addChildren([
  // Public routes
  indexRoute,
  loginRoute,
  onboardingRoute,
  magicLinkRoute,
  inviteRoute,
  // Authenticated routes under /app layout
  appRoute.addChildren([
    homeRoute,
    gettingStartedRoute,
    aboutRoute,
    documentRoute,
    editorRoute,
    pageRoute,
    notionPageRoute, // Catch-all must be last
  ]),
]);

// Export route IDs type for type-safe navigation
export type RouteTree = typeof routeTree;
