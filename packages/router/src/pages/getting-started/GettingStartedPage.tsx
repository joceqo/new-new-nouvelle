import { useParams } from "@tanstack/react-router";
import { Sidebar, SidebarItem } from "@nouvelle/ui";
import { FileText, List, CalendarDays, User } from "lucide-react";

export function GettingStartedPage() {
  const { pageId } = useParams({ strict: false });

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        workspaceName="My Workspace"
        icon={<span className="text-lg">👋</span>}
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
        <div className="max-w-4xl mx-auto px-12 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-5xl">👋</span>
            </div>
            <h1 className="text-4xl font-semibold text-foreground mb-4">
              Getting Started
            </h1>
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
