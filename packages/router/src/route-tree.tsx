import { RootRoute, Route, Outlet, createRoute } from "@tanstack/react-router";
import { LoginPage } from "./pages/login/LoginPage";
import { OnboardingPage } from "./pages/onboarding/OnboardingPage";
import { MagicLinkPage } from "./pages/auth/MagicLinkPage";
import { GettingStartedPage } from "./pages/getting-started/GettingStartedPage";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Alert,
  AlertDescription,
  Typography,
} from "@nouvelle/ui";
import {
  Mail,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

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

// Test component showcasing UI components
function TestComponent() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <Typography variant="heading" size="8">
            Nouvelle UI Components
          </Typography>
          <Typography variant="text" size="4" className="text-muted-foreground">
            Testing Tailwind CSS and UI component library
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card with form elements */}
          <Card>
            <CardHeader>
              <CardTitle>Form Example</CardTitle>
              <CardDescription>Input and button components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="Your name" />
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button className="w-full">Submit</Button>
              <Button variant="secondary" className="w-full">
                Cancel
              </Button>
            </CardFooter>
          </Card>

          {/* Card with alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Examples</CardTitle>
              <CardDescription>Different alert variants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Success! Your changes have been saved.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Error! Something went wrong.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Card with color examples */}
          <Card>
            <CardHeader>
              <CardTitle>Color System</CardTitle>
              <CardDescription>Design system tokens</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                Primary
              </div>
              <div className="p-3 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium">
                Secondary
              </div>
              <div className="p-3 bg-accent text-accent-foreground rounded-lg text-sm font-medium">
                Accent
              </div>
              <div className="p-3 bg-muted text-muted-foreground rounded-lg text-sm font-medium">
                Muted
              </div>
            </CardContent>
          </Card>

          {/* Card with buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>Different button styles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">Default</Button>
              <Button variant="secondary" className="w-full">
                Secondary
              </Button>
              <Button variant="outline" className="w-full">
                Outline
              </Button>
              <Button variant="ghost" className="w-full">
                Ghost
              </Button>
              <Button variant="destructive" className="w-full">
                Destructive
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Full width card */}
        <Card>
          <CardHeader>
            <CardTitle>Tailwind Utilities Test</CardTitle>
            <CardDescription>
              Testing various Tailwind CSS utility classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-500 text-white rounded-lg text-center">
                Tailwind Blue
              </div>
              <div className="p-4 bg-green-500 text-white rounded-lg text-center">
                Tailwind Green
              </div>
              <div className="p-4 bg-purple-500 text-white rounded-lg text-center">
                Tailwind Purple
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Index route - the home page
export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: TestComponent,
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
