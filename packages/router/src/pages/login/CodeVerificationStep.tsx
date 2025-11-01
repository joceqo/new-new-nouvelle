import {
  Button,
  Label,
  Alert,
  AlertDescription,
  InputOTP,
  IconWrapper,
} from "@nouvelle/ui";
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react";

interface CodeVerificationStepProps {
  email: string;
  code: string;
  loading: boolean;
  error: string;
  isDev: boolean;
  onCodeChange: (code: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

export function CodeVerificationStep({
  email,
  code,
  loading,
  error,
  isDev,
  onCodeChange,
  onSubmit,
  onBack,
}: CodeVerificationStepProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
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
              Dev mode: Check your server console for the verification code
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
            onChange={(value) => onCodeChange(value)}
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
        onClick={onBack}
        disabled={loading}
      >
        <IconWrapper icon={ArrowLeft} size="sm" className="mr-2" />
        Use a different email
      </Button>
    </form>
  );
}
