import * as React from "react";
import { ChevronDown, Settings, Users, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export interface Workspace {
  id: string;
  name: string;
  icon?: string;
  plan?: string;
  role: "owner" | "admin" | "member" | "guest";
  memberCount?: number;
}

export interface WorkspaceSwitcherProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  onWorkspaceChange: (workspaceId: string) => void;
  onCreateWorkspace?: () => void;
  onWorkspaceSettings?: (workspaceId: string) => void;
  onInviteMembers?: (workspaceId: string) => void;
  onLogout?: () => void;
  userEmail?: string;
  className?: string;
}

export const WorkspaceSwitcher = React.forwardRef<
  HTMLDivElement,
  WorkspaceSwitcherProps
>(
  (
    {
      workspaces,
      activeWorkspace,
      onWorkspaceChange,
      onCreateWorkspace,
      onWorkspaceSettings,
      onInviteMembers,
      onLogout,
      userEmail,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const getPlanDisplay = (workspace: Workspace) => {
      const plan = workspace.plan || "free";
      const memberCount = workspace.memberCount || 1;
      return `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan • ${memberCount} member${memberCount > 1 ? "s" : ""}`;
    };

    return (
      <div ref={ref} className={cn("relative", className)}>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                "hover:bg-sidebar-accent transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              )}
            >
              <Avatar
                src={activeWorkspace?.icon}
                fallback={activeWorkspace?.name || "W"}
                size="sm"
                className="shrink-0"
              />
              <span className="flex-1 truncate text-left font-medium text-sidebar-foreground">
                {activeWorkspace?.name || "Select workspace"}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  open && "rotate-180"
                )}
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-80">
            {/* Workspace Header */}
            {activeWorkspace && (
              <div className="p-4 border-b border-border">
                <div className="flex items-start gap-3">
                  <Avatar
                    src={activeWorkspace.icon}
                    fallback={activeWorkspace.name}
                    size="default"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate text-foreground">
                      {activeWorkspace.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {getPlanDisplay(activeWorkspace)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  {onWorkspaceSettings && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onWorkspaceSettings(activeWorkspace.id);
                        setOpen(false);
                      }}
                      className="flex-1"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Settings
                    </Button>
                  )}
                  {onInviteMembers && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInviteMembers(activeWorkspace.id);
                        setOpen(false);
                      }}
                      className="flex-1"
                    >
                      <Users className="h-3 w-3 mr-1" />
                      Invite
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* User Email */}
            {userEmail && (
              <div className="px-4 py-3 border-b border-border">
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
            )}

            {/* Workspace List */}
            {workspaces.length > 0 && (
              <div className="py-2">
                <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                {workspaces.map((workspace) => (
                  <DropdownMenuItem
                    key={workspace.id}
                    onSelect={() => {
                      onWorkspaceChange(workspace.id);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Avatar
                      src={workspace.icon}
                      fallback={workspace.name}
                      size="sm"
                    />
                    <span className="flex-1 truncate">{workspace.name}</span>
                    {activeWorkspace?.id === workspace.id && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
            )}

            {/* Create New Workspace */}
            {onCreateWorkspace && (
              <>
                <DropdownMenuSeparator />
                <div className="py-2">
                  <DropdownMenuItem
                    onSelect={onCreateWorkspace}
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <Plus className="h-4 w-4" />
                    <span>New workspace</span>
                  </DropdownMenuItem>
                </div>
              </>
            )}

            {/* Logout */}
            {onLogout && (
              <>
                <DropdownMenuSeparator />
                <div className="py-2">
                  <DropdownMenuItem
                    onSelect={onLogout}
                    className="text-red-600"
                  >
                    Log out
                  </DropdownMenuItem>
                </div>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

WorkspaceSwitcher.displayName = "WorkspaceSwitcher";
