import { createRootRoute, createRoute } from "@tanstack/react-router";
import { LoginPage } from "./pages/login/LoginPage";
import { OnboardingPage } from "./pages/onboarding/OnboardingPage";
import { MagicLinkPage } from "./pages/auth/MagicLinkPage";
import { GettingStartedPage } from "./pages/getting-started/GettingStartedPage";
import { InvitePage } from "./pages/invite/InvitePage";
import { PageView } from "./pages/page/PageView";
import { HomePage } from "./pages/home/HomePage";
import { RootLayout, AuthenticatedLayout } from "./layouts";

// Root route - base layout wrapper for all routes
export const rootRoute = createRootRoute({
  component: RootLayout,
});

// Auth layout route - pathless layout for authenticated app routes with sidebar
// Using id instead of path creates a pathless layout route
export const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "app",
  component: AuthenticatedLayout,
});

// Public routes (no sidebar)
// Index route - login page
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

// Login route
export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
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
