import * as React from "react";
import { Smile } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

// Common emoji icons for workspaces
const WORKSPACE_ICONS = ["🏢", "💼", "🚀", "⭐", "🎯", "💡", "🔥", "✨", "🌟", "🎨", "📚", "🏠", "👤", "👥", "🌍"];

export interface CreateWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateWorkspace: (name: string, icon?: string) => Promise<void>;
}

export const CreateWorkspaceDialog = React.forwardRef<HTMLDivElement, CreateWorkspaceDialogProps>(
  ({ open, onOpenChange, onCreateWorkspace }, ref) => {
    const [name, setName] = React.useState("");
    const [selectedIcon, setSelectedIcon] = React.useState("🏢");
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Reset form when dialog opens/closes
    React.useEffect(() => {
      if (!open) {
        setName("");
        setSelectedIcon("🏢");
        setError(null);
        setIsLoading(false);
      }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!name.trim()) {
        setError("Workspace name is required");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await onCreateWorkspace(name.trim(), selectedIcon);
        onOpenChange(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create workspace");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref}>
          <DialogHeader>
            <DialogTitle>Create new workspace</DialogTitle>
            <DialogDescription>
              Workspaces help you organize your content and collaborate with others.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <DialogBody className="space-y-4">
              {/* Workspace Name */}
              <div className="space-y-2">
                <Label htmlFor="workspace-name">Workspace name</Label>
                <Input
                  id="workspace-name"
                  placeholder="e.g., My Team, Personal, Acme Inc"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  autoFocus
                />
              </div>

              {/* Icon Picker */}
              <div className="space-y-2">
                <Label>
                  <Smile className="inline h-4 w-4 mr-1" />
                  Choose an icon
                </Label>
                <div className="grid grid-cols-8 gap-2">
                  {WORKSPACE_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      disabled={isLoading}
                      className={`
                        flex items-center justify-center h-10 w-10 rounded-md text-xl
                        transition-all hover:bg-accent
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                        disabled:opacity-50 disabled:pointer-events-none
                        ${
                          selectedIcon === icon
                            ? "bg-primary/10 ring-2 ring-primary"
                            : "bg-muted"
                        }
                      `}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                  {error}
                </div>
              )}
            </DialogBody>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !name.trim()}>
                {isLoading ? "Creating..." : "Create workspace"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);

CreateWorkspaceDialog.displayName = "CreateWorkspaceDialog";
