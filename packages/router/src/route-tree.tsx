import { RootRoute, Outlet, createRoute } from "@tanstack/react-router";
import { LoginPage } from "./pages/login/LoginPage";
import { OnboardingPage } from "./pages/onboarding/OnboardingPage";
import { MagicLinkPage } from "./pages/auth/MagicLinkPage";
import { GettingStartedPage } from "./pages/getting-started/GettingStartedPage";

// Layout component with Sidebar
function AppLayout() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

// Root route - this is the layout wrapper for all routes
export const rootRoute = new RootRoute({
  component: AppLayout,
});

// Index route - redirect to login page
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

// Example: About route
export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: () => <div>About Page</div>,
});

// Example: Dynamic route with params
export const documentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/documents/$documentId",
  component: () => <div>Document View</div>,
});

// Example: Editor route
export const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/editor",
  component: () => <div>Editor</div>,
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

// Getting Started route
export const gettingStartedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/getting-started/$pageId",
  component: GettingStartedPage,
});

// Create the route tree
export const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  documentRoute,
  editorRoute,
  loginRoute,
  onboardingRoute,
  magicLinkRoute,
  gettingStartedRoute,
]);

// Export route IDs type for type-safe navigation
export type RouteTree = typeof routeTree;
