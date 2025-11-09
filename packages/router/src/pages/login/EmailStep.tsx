import {
  Button,
  Input,
  Label,
  Alert,
  AlertDescription,
  IconWrapper,
} from "@nouvelle/ui";
import { Loader2, Mail } from "lucide-react";

interface EmailStepProps {
  email: string;
  loading: boolean;
  error: string;
  isDev: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EmailStep({
  email,
  loading,
  error,
  isDev,
  onEmailChange,
  onSubmit,
}: EmailStepProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEmailChange(e.target.value)}
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
          Dev mode: The verification code will appear in the server console
        </p>
      )}
    </form>
  );
}
