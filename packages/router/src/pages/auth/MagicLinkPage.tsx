import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Alert,
  AlertDescription,
} from "@nouvelle/ui";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { authApiClient } from "../../lib/api-client";
import { useAuth } from "../../lib/auth-context";

type MagicLinkSearch = {
  token?: string;
};

export function MagicLinkPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth/magic-link" }) as MagicLinkSearch;
  const { login } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      const token = search.token;

      if (!token) {
        setStatus("error");
        setErrorMessage("Missing verification token");
        return;
      }

      try {
        const result = await authApiClient.verifyMagicLink(token);

        if (!result.success || !result.token || !result.user) {
          setStatus("error");
          setErrorMessage(result.error || "Invalid or expired link");
        } else {
          // Login successful
          login(result.token, result.user);
          setStatus("success");

          // Redirect to onboarding after a brief delay
          setTimeout(() => {
            navigate({ to: "/onboarding" });
          }, 1000);
        }
      } catch (error) {
        console.error("Magic link verification error:", error);
        setStatus("error");
        setErrorMessage("Failed to verify link. Please try again.");
      }
    };

    verifyToken();
  }, [search.token, login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md md:max-w-sm w-full">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Verifying...
            </CardTitle>
            <CardDescription className="text-center">
              Please wait while we verify your authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "loading" && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Verifying your link...
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Authentication successful!</h3>
                  <p className="text-sm text-muted-foreground">
                    Redirecting to onboarding...
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
                <div className="text-center">
                  <button
                    onClick={() => navigate({ to: "/login" })}
                    className="text-sm text-primary hover:underline"
                  >
                    Return to login
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
