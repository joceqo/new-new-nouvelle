import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Alert,
  AlertDescription,
  Button,
} from "@nouvelle/ui";
import { Loader2, CheckCircle, AlertCircle, Users } from "lucide-react";
import { workspaceApiClient } from "../../lib/api-client";
import { useAuth } from "../../lib/auth-context";
import { useWorkspace } from "../../lib/workspace-context";

type InviteParams = {
  token: string;
};

export function InvitePage() {
  const navigate = useNavigate();
  const params = useParams({ from: "/invite/$token" }) as InviteParams;
  const { token: authToken, isAuthenticated, isLoading: authLoading } = useAuth();
  const { refreshWorkspaces, switchWorkspace } = useWorkspace();

  const [status, setStatus] = useState<"loading" | "checking_auth" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  // Check authentication first
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      // Redirect to login with return URL
      navigate({
        to: "/login",
        search: { redirect: `/invite/${params.token}` },
      });
      return;
    }

    setStatus("loading");
  }, [isAuthenticated, authLoading, params.token, navigate]);

  // Accept invite when authenticated
  useEffect(() => {
    if (!isAuthenticated || !authToken || authLoading) return;

    const acceptInvite = async () => {
      try {
        const result = await workspaceApiClient.acceptInvite(params.token, authToken);

        if (!result.success || !result.workspaceId) {
          setStatus("error");
          setErrorMessage(result.error || "Invalid or expired invite link");
        } else {
          // Invite accepted successfully
          setStatus("success");

          // Refresh workspaces list
          await refreshWorkspaces();

          // Switch to the newly joined workspace
          switchWorkspace(result.workspaceId);

          // Redirect to home after a brief delay
          setTimeout(() => {
            navigate({ to: "/" });
          }, 2000);
        }
      } catch (error) {
        console.error("Invite acceptance error:", error);
        setStatus("error");
        setErrorMessage("Failed to accept invite. Please try again.");
      }
    };

    acceptInvite();
  }, [isAuthenticated, authToken, authLoading, params.token, refreshWorkspaces, switchWorkspace, navigate]);

  if (authLoading || status === "checking_auth") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md md:max-w-sm w-full">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Checking authentication...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md md:max-w-sm w-full">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              {status === "loading" ? "Accepting invite..." : status === "success" ? "Welcome!" : "Invite"}
            </CardTitle>
            <CardDescription className="text-center">
              {status === "loading" && "Please wait while we add you to the workspace"}
              {status === "success" && "You've successfully joined the workspace"}
              {status === "error" && "There was a problem with your invite"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "loading" && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Joining workspace...</p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Successfully joined!</h3>
                  <p className="text-sm text-muted-foreground">Welcome to your new workspace</p>
                  <p className="text-xs text-muted-foreground">Redirecting...</p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-center text-muted-foreground">
                    The invite link may have expired or already been used.
                  </p>
                  <Button
                    onClick={() => navigate({ to: "/" })}
                    variant="outline"
                    className="w-full"
                  >
                    Go to home
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
