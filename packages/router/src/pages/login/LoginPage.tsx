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
        // User has workspaces, redirect to main app
        navigate({ to: "/getting-started/$pageId", params: { pageId: "home" } });
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
