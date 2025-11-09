import * as React from "react";
import { Settings, Trash2, AlertTriangle, Smile } from "lucide-react";
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
import { Avatar } from "@/components/ui/avatar";

// Common emoji icons for workspaces
const WORKSPACE_ICONS = ["🏢", "💼", "🚀", "⭐", "🎯", "💡", "🔥", "✨", "🌟", "🎨", "📚", "🏠", "👤", "👥", "🌍"];

export interface Workspace {
  id: string;
  name: string;
  icon?: string;
  plan?: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  memberCount?: number;
}

export interface WorkspaceSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspace: Workspace | null;
  onUpdateWorkspace: (workspaceId: string, updates: { name?: string; icon?: string }) => Promise<boolean>;
  onDeleteWorkspace: (workspaceId: string) => Promise<boolean>;
}

export const WorkspaceSettingsDialog = React.forwardRef<HTMLDivElement, WorkspaceSettingsDialogProps>(
  ({ open, onOpenChange, workspace, onUpdateWorkspace, onDeleteWorkspace }, ref) => {
    const [name, setName] = React.useState("");
    const [selectedIcon, setSelectedIcon] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = React.useState("");

    // Load workspace data when dialog opens
    React.useEffect(() => {
      if (open && workspace) {
        setName(workspace.name);
        setSelectedIcon(workspace.icon || "🏢");
        setError(null);
        setShowDeleteConfirm(false);
        setDeleteConfirmText("");
      }
    }, [open, workspace]);

    const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!workspace) return;

      if (!name.trim()) {
        setError("Workspace name is required");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const success = await onUpdateWorkspace(workspace.id, {
          name: name.trim(),
          icon: selectedIcon,
        });

        if (success) {
          onOpenChange(false);
        } else {
          setError("Failed to update workspace");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update workspace");
      } finally {
        setIsLoading(false);
      }
    };

    const handleDelete = async () => {
      if (!workspace) return;

      if (deleteConfirmText !== workspace.name) {
        setError("Workspace name doesn't match");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const success = await onDeleteWorkspace(workspace.id);

        if (success) {
          onOpenChange(false);
        } else {
          setError("Failed to delete workspace");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete workspace");
      } finally {
        setIsLoading(false);
      }
    };

    if (!workspace) return null;

    const canDelete = workspace.role === 'owner';
    const canEdit = workspace.role === 'owner' || workspace.role === 'admin';

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent ref={ref}>
          <DialogHeader>
            <DialogTitle>
              <Settings className="inline h-5 w-5 mr-2" />
              Workspace settings
            </DialogTitle>
            <DialogDescription>
              Manage your workspace settings and preferences.
            </DialogDescription>
          </DialogHeader>

          {!showDeleteConfirm ? (
            <form onSubmit={handleUpdate}>
              <DialogBody className="space-y-4">
                {/* Current Workspace Info */}
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Avatar
                    src={workspace.icon}
                    fallback={workspace.name}
                    size="default"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-foreground">{workspace.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {workspace.plan || 'Free'} Plan • {workspace.memberCount || 1} member(s)
                    </p>
                  </div>
                </div>

                {/* Workspace Name */}
                <div className="space-y-2">
                  <Label htmlFor="workspace-name">Workspace name</Label>
                  <Input
                    id="workspace-name"
                    placeholder="Workspace name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading || !canEdit}
                    autoFocus
                  />
                </div>

                {/* Icon Picker */}
                <div className="space-y-2">
                  <Label>
                    <Smile className="inline h-4 w-4 mr-1" />
                    Workspace icon
                  </Label>
                  <div className="grid grid-cols-8 gap-2">
                    {WORKSPACE_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setSelectedIcon(icon)}
                        disabled={isLoading || !canEdit}
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

                {!canEdit && (
                  <div className="rounded-md bg-yellow-500/10 p-3 text-sm text-yellow-700 dark:text-yellow-400 border border-yellow-500/20">
                    Only owners and admins can edit workspace settings.
                  </div>
                )}

                {/* Delete Section */}
                {canDelete && (
                  <div className="pt-4 border-t border-border space-y-2">
                    <Label className="text-destructive">
                      <Trash2 className="inline h-4 w-4 mr-1" />
                      Danger zone
                    </Label>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isLoading}
                      className="w-full"
                    >
                      Delete workspace
                    </Button>
                  </div>
                )}

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
                {canEdit && (
                  <Button type="submit" disabled={isLoading || !name.trim()}>
                    {isLoading ? "Saving..." : "Save changes"}
                  </Button>
                )}
              </DialogFooter>
            </form>
          ) : (
            /* Delete Confirmation */
            <div>
              <DialogBody className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="font-medium text-destructive">Delete workspace permanently?</p>
                    <p className="text-sm text-destructive/90">
                      This action cannot be undone. All workspace data, pages, and settings will be permanently deleted.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delete-confirm">
                    Type <span className="font-mono font-bold">{workspace.name}</span> to confirm
                  </Label>
                  <Input
                    id="delete-confirm"
                    placeholder={workspace.name}
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>

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
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText("");
                    setError(null);
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading || deleteConfirmText !== workspace.name}
                >
                  {isLoading ? "Deleting..." : "Delete workspace"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    );
  }
);

WorkspaceSettingsDialog.displayName = "WorkspaceSettingsDialog";
