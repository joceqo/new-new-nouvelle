import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../lib/auth-context";
import { LoginForm } from "./LoginForm";

export function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to the main app
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect to onboarding for authenticated users
      // TODO: Check if user has completed onboarding and redirect to home/dashboard instead
      navigate({ to: "/onboarding" });
    }
  }, [isAuthenticated, isLoading, navigate]);

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
