import * as React from "react";
import { Mail, Link2, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export interface InviteMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceName: string;
  onInviteMember: (email: string) => Promise<{ success: boolean; inviteLink?: string; error?: string }>;
}

export const InviteMembersDialog = React.forwardRef<HTMLDivElement, InviteMembersDialogProps>(
  ({ open, onOpenChange, workspaceName, onInviteMember }, ref) => {
    const [email, setEmail] = React.useState("");
    const [inviteLink, setInviteLink] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);
    const [copied, setCopied] = React.useState(false);

    // Reset form when dialog opens/closes
    React.useEffect(() => {
      if (!open) {
        setEmail("");
        setInviteLink(null);
        setError(null);
        setSuccess(null);
        setIsLoading(false);
        setCopied(false);
      }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!email.trim()) {
        setError("Email address is required");
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return;
      }

      setIsLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const result = await onInviteMember(email.trim());

        if (result.success) {
          setSuccess(`Invite sent to ${email}`);
          if (result.inviteLink) {
            setInviteLink(result.inviteLink);
          }
          setEmail("");
        } else {
          setError(result.error || "Failed to send invite");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send invite");
      } finally {
        setIsLoading(false);
      }
    };

    const handleCopyLink = async () => {
      if (!inviteLink) return;

      try {
        await navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        setError("Failed to copy link");
      }
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref}>
          <DialogHeader>
            <DialogTitle>Invite members to {workspaceName}</DialogTitle>
            <DialogDescription>
              Invite team members via email or share an invite link.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-4">
            {/* Email Invite */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email address
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="colleague@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                    autoFocus
                  />
                  <Button type="submit" disabled={isLoading || !email.trim()}>
                    {isLoading ? "Sending..." : "Send invite"}
                  </Button>
                </div>
              </div>

              {/* Success Message */}
              {success && (
                <div className="rounded-md bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400 flex items-center gap-2 border border-green-500/20">
                  <Check className="h-4 w-4" />
                  {success}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                  {error}
                </div>
              )}
            </form>

            {/* Invite Link */}
            {inviteLink && (
              <div className="space-y-2 pt-4 border-t border-border">
                <Label>
                  <Link2 className="inline h-4 w-4 mr-1" />
                  Shareable invite link
                </Label>
                <div className="flex gap-2">
                  <Input
                    value={inviteLink}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCopyLink}
                    className="shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Anyone with this link can join your workspace. Link expires in 7 days.
                </p>
              </div>
            )}

            {/* Info */}
            <div className="rounded-md bg-blue-500/10 p-3 text-sm text-blue-700 dark:text-blue-400 border border-blue-500/20">
              <p className="font-medium mb-1">Member permissions</p>
              <p className="text-xs opacity-90">
                New members will join as <Badge variant="info" className="ml-1">Member</Badge> with standard access to workspace content.
              </p>
            </div>
          </DialogBody>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
);

InviteMembersDialog.displayName = "InviteMembersDialog";
