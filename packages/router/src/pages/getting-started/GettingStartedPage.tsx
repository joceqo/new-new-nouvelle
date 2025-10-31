import { useParams, useNavigate } from "@tanstack/react-router";
import { Sidebar, SidebarItem } from "@nouvelle/ui";
import { FileText, List, CalendarDays, User } from "lucide-react";
import { useAuth } from "../../lib/auth-context";

export function GettingStartedPage() {
  const { pageId } = useParams({ strict: false });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        workspaceName="My Workspace"
        icon={<span className="text-lg">👋</span>}
        onLogout={handleLogout}
      >
        {/* Private Section */}
        <div className="mb-2">
          <div className="px-2 mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Private
            </span>
          </div>
          <SidebarItem icon={FileText} label="Getting Started" isActive />
          <SidebarItem icon={List} label="To Do List" />
          <SidebarItem icon={CalendarDays} label="Weekly To-do List" />
        </div>

        {/* Shared Section */}
        <div>
          <div className="px-2 mb-1">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Shared
            </span>
          </div>
          <SidebarItem icon={User} label="Start collaborating" />
        </div>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-16 py-12">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-5xl">👋</span>
            </div>
            <h1 className="text-4xl font-semibold text-foreground mb-4">
              Getting Started
            </h1>
          </div>

          {/* User & Workspace Information */}
          <div className="mb-8 p-6 bg-muted/50 rounded-lg border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Workspace Information
            </h2>
            <div className="grid gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium w-32">Workspace:</span>
                <span className="text-foreground">My Workspace</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium w-32">User Email:</span>
                <span className="text-foreground">{user?.email || 'Not available'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium w-32">User ID:</span>
                <span className="text-foreground font-mono text-xs">{user?.id || 'Not available'}</span>
              </div>
            </div>
          </div>

          {/* Placeholder Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-muted-foreground text-lg">
              Welcome to Nouvelle! This is your Getting Started page.
            </p>
            <p className="text-muted-foreground">
              The editor is coming soon. For now, you can use the sidebar to navigate through your workspace.
            </p>

            {/* Debug info (can be removed later) */}
            <div className="mt-8 p-4 bg-muted rounded-lg text-sm">
              <p className="text-muted-foreground">
                <strong>Page ID:</strong> {pageId}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
