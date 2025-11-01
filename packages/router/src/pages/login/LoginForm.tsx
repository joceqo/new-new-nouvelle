import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@nouvelle/ui";
import { authApiClient } from "../../lib/api-client";
import { useAuth } from "../../lib/auth-context";
import { useNavigate } from "@tanstack/react-router";
import { EmailStep } from "./EmailStep";
import { CodeVerificationStep } from "./CodeVerificationStep";

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

  const handleBackToEmail = () => {
    setStep("email");
    setEmail("");
    setCode("");
    setError("");
  };

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
              <EmailStep
                email={email}
                loading={loading}
                error={error}
                isDev={isDev}
                onEmailChange={setEmail}
                onSubmit={handleEmailSubmit}
              />
            )}

            {step === "code-sent" && (
              <CodeVerificationStep
                email={email}
                code={code}
                loading={loading}
                error={error}
                isDev={isDev}
                onCodeChange={setCode}
                onSubmit={handleCodeSubmit}
                onBack={handleBackToEmail}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
