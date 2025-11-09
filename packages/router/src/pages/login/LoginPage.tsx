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
    console.log('🔀 [LOGIN PAGE] Redirect effect triggered', {
      isLoading,
      workspacesLoading,
      isAuthenticated,
      workspacesCount: workspaces.length,
      workspaces: workspaces.map(w => ({ id: w.id, name: w.name }))
    });

    if (!isLoading && !workspacesLoading && isAuthenticated) {
      console.log('🔀 [LOGIN PAGE] User is authenticated and not loading');

      // Check if user has workspaces (has completed onboarding)
      if (workspaces.length > 0) {
        console.log('🔀 [LOGIN PAGE] User has workspaces, checking for redirect...');
        // User has workspaces, check for last visited page or go to home
        const lastVisitedPage = localStorage.getItem('nouvelle_last_visited_page');
        if (lastVisitedPage && lastVisitedPage !== '/login' && lastVisitedPage !== '/onboarding') {
          console.log('🔀 [LOGIN PAGE] Redirecting to last visited page:', lastVisitedPage);
          navigate({ to: lastVisitedPage as any });
        } else {
          console.log('🔀 [LOGIN PAGE] Redirecting to /home');
          navigate({ to: "/home" });
        }
      } else {
        console.log('🔀 [LOGIN PAGE] User has NO workspaces, redirecting to /onboarding');
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
