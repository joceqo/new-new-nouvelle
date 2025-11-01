import { useState } from "react";
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Alert,
  AlertDescription,
  InputOTP,
  IconWrapper,
} from "@nouvelle/ui";
import { Loader2, Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { authApiClient } from "../../lib/api-client";
import { useAuth } from "../../lib/auth-context";
import { useNavigate } from "@tanstack/react-router";

type Step = "email" | "code-sent";

export function LoginForm() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError("");
    setLoading(true);

    try {
      const result = await authApiClient.sendCode(email);

      if (!result.success) {
        setError(
          result.error || "Failed to send verification code. Please try again."
        );
      } else {
        setStep("code-sent");
      }
    } catch (err) {
      setError("Failed to send verification code. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await authApiClient.verifyCode(email, code);

      if (!result.success || !result.token || !result.user) {
        setError(result.error || "Invalid or expired code. Please try again.");
        setLoading(false);
      } else {
        // Login successful
        login(result.token, result.user, result.refreshToken);
        // Navigate to onboarding page
        navigate({ to: "/onboarding" });
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
      setLoading(false);
      console.error(err);
    }
  };

  const isDev = import.meta.env.DEV;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md md:max-w-sm">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome to Nouvelle
            </CardTitle>
            <CardDescription className="text-center">
              {step === "email" &&
                "Enter your email to receive a verification code"}
              {step === "code-sent" &&
                "Check your email for the verification code"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "email" && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-3">
                      <IconWrapper
                        icon={Mail}
                        size="sm"
                        className="text-muted-foreground"
                      />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="pl-10"
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <IconWrapper
                        icon={Loader2}
                        size="sm"
                        className="mr-2 animate-spin"
                      />
                      Sending code...
                    </>
                  ) : (
                    "Continue with Email"
                  )}
                </Button>

                {isDev && (
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Dev mode: The verification code will appear in the server
                    console
                  </p>
                )}
              </form>
            )}

            {step === "code-sent" && (
              <form onSubmit={handleCodeSubmit} className="space-y-6">
                <div className="flex items-center justify-center py-4">
                  <IconWrapper
                    icon={CheckCircle}
                    size="lg"
                    className="text-green-500 text-5xl"
                  />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-medium">Check your email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a verification code to:
                  </p>
                  <p className="font-medium">{email}</p>
                  {isDev && (
                    <Alert className="mt-4">
                      <AlertDescription className="text-xs">
                        Dev mode: Check your server console for the verification
                        code
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="space-y-4">
                  <Label htmlFor="otp" className="text-center block">
                    Verification Code
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={code}
                      onChange={(value) => setCode(value)}
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    Enter the 6-digit code
                  </p>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || code.length !== 6}
                >
                  {loading ? (
                    <>
                      <IconWrapper
                        icon={Loader2}
                        size="sm"
                        className="mr-2 animate-spin"
                      />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setStep("email");
                    setEmail("");
                    setCode("");
                    setError("");
                  }}
                  disabled={loading}
                >
                  <IconWrapper icon={ArrowLeft} size="sm" className="mr-2" />
                  Use a different email
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
