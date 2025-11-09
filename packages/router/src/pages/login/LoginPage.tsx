import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../lib/auth-context";
import { useWorkspace } from "../../lib/workspace-context";
import { LoginForm } from "./LoginForm";

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { workspaces, isLoading: workspacesLoading } = useWorkspace();
  const navigate = useNavigate();

  // Redirect authenticated users to the main app
  useEffect(() => {
    if (!isLoading && !workspacesLoading && isAuthenticated) {
      // Check if user has workspaces (has completed onboarding)
      if (workspaces.length > 0) {
        // User has workspaces, check for last visited page or go to home
        const lastVisitedPage = localStorage.getItem('nouvelle_last_visited_page');
        if (lastVisitedPage && lastVisitedPage !== '/login' && lastVisitedPage !== '/onboarding') {
          navigate({ to: lastVisitedPage as any });
        } else {
          navigate({ to: "/home" });
        }
      } else {
        // New user, redirect to onboarding
        navigate({ to: "/onboarding" });
      }
    }
  }, [isAuthenticated, isLoading, workspacesLoading, workspaces, navigate]);

  // Show nothing while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Only show login form if not authenticated
  return <LoginForm />;
}
