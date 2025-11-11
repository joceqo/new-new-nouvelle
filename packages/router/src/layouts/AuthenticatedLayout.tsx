import {
  Outlet,
  useNavigate,
  useRouter,
  useLocation,
} from "@tanstack/react-router";
import {
  Sidebar,
  InboxSheet,
  CreateWorkspaceDialog,
  InviteMembersDialog,
  WorkspaceSettingsDialog,
  PageTree,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  Button,
} from "@nouvelle/ui";
import { useAuth } from "../lib/auth-context";
import { useWorkspace } from "../lib/workspace-context";
import { usePage } from "../lib/page-context";
import { createPageSlug, extractPageId } from "../lib/notion-url";
import { getRecentPages } from "../lib/recent-pages";
import { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Home,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
} from "lucide-react";

export function AuthenticatedLayout() {
  const navigate = useNavigate();
  const router = useRouter();
  const location = useLocation();
  const { user, logout, isLoading } = useAuth();
  const {
    workspaces,
    activeWorkspace,
    switchWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    inviteMember,
  } = useWorkspace();
  const {
    pages,
    createPage,
    toggleFavorite,
    deletePage,
    updatePage,
    duplicatePage,
    copyPageLink,
  } = usePage();

  console.log("pages", pages);

  // Dialog states
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string | null>(
    null
  );

  // Command and Inbox states
  const [showCommand, setShowCommand] = useState(false);
  const [showInbox, setShowInbox] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");

  // Sidebar states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarSize, setSidebarSize] = useState(20); // 20% default

  // Handlers
  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  const handleCreateWorkspace = async (name: string, icon?: string) => {
    await createWorkspace(name, icon);
  };

  const handleInviteMembers = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    setShowInviteDialog(true);
  };

  const handleInviteMember = async (email: string) => {
    if (!selectedWorkspaceId)
      return { success: false, error: "No workspace selected" };
    return await inviteMember(selectedWorkspaceId, email);
  };

  const handleWorkspaceSettings = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
    setShowSettingsDialog(true);
  };

  const handleUpdateWorkspace = async (
    workspaceId: string,
    updates: { name?: string; icon?: string }
  ): Promise<boolean> => {
    const result = await updateWorkspace(workspaceId, updates);
    return result.success;
  };

  const handleDeleteWorkspace = async (
    workspaceId: string
  ): Promise<boolean> => {
    const result = await deleteWorkspace(workspaceId);
    return result.success;
  };

  const selectedWorkspace = workspaces.find(
    (w) => w.id === selectedWorkspaceId
  );

  // Helper function to navigate to a page with Notion-style URL
  const navigateToPage = (pageId: string) => {
    // Close inbox when navigating to a page
    setShowInbox(false);

    // Find the page in the tree (flattened search)
    const findPageById = (pages: any[], id: string): any => {
      for (const page of pages) {
        if (page.id === id) return page;
        if (page.children) {
          const found = findPageById(page.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    const page = findPageById(pages, pageId);
    if (page) {
      const slug = createPageSlug(page.title, page.id);
      navigate({ to: "/$pageSlug", params: { pageSlug: slug } });
    }
  };

  // Handle page creation with navigation
  const handleCreatePage = async (
    title: string = "Untitled",
    parentId?: string
  ) => {
    const result = await createPage(title, parentId);
    if (result.success && result.pageId) {
      // Navigate to the newly created page
      const slug = createPageSlug(title, result.pageId);
      navigate({ to: "/$pageSlug", params: { pageSlug: slug } });
    }
  };

  // Toggle inbox (for sidebar item click)
  const handleInboxToggle = () => {
    setShowInbox(!showInbox);
  };

  // Close inbox when clicking main content
  const handleMainContentClick = () => {
    if (showInbox) {
      setShowInbox(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowCommand(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !isLoading) {
      console.log("🔒 [REDIRECT] User not authenticated, redirecting to login");
      navigate({ to: "/login" });
    }
  }, [user, isLoading, navigate]);

  // Track last visited page in localStorage
  useEffect(() => {
    const currentPath = router.state.location.pathname;
    // Save current path to localStorage, but exclude login and onboarding
    if (
      currentPath &&
      currentPath !== "/login" &&
      currentPath !== "/onboarding" &&
      currentPath !== "/"
    ) {
      localStorage.setItem("nouvelle_last_visited_page", currentPath);
    }
  }, [router.state.location.pathname]);

  // Helper function to flatten page tree
  const flattenPages = (pages: any[]): any[] => {
    const result: any[] = [];
    for (const page of pages) {
      result.push(page);
      if (page.children) {
        result.push(...flattenPages(page.children));
      }
    }
    return result;
  };

  // Helper function to find all favorited pages recursively
  const findFavoritedPages = (pages: any[]): any[] => {
    const favorites: any[] = [];

    const traverse = (pageList: any[]) => {
      for (const page of pageList) {
        // If this page is favorited, add it with its children
        if (page.isFavorite) {
          favorites.push(page);
        }
        // Continue searching in children
        if (page.children && page.children.length > 0) {
          traverse(page.children);
        }
      }
    };

    traverse(pages);
    return favorites;
  };

  // Filter pages for Private and Favorites sections
  const allPages = pages;
  const privatePages = allPages.filter(
    (page) => page.visibility === "private" || !page.visibility // Default to private if no visibility set
  );
  const favoritePages = findFavoritedPages(allPages);

  // Get active page ID from current URL
  const [activePageId, setActivePageId] = useState<string | undefined>(
    undefined
  );

  // Update active page ID when route changes
  useEffect(() => {
    const pathname = location.pathname;
    const newActivePageId =
      pathname.startsWith("/") && pathname !== "/" && pathname !== "/home"
        ? extractPageId(pathname.slice(1)) // Remove leading slash
        : undefined;

    setActivePageId(newActivePageId);
  }, [location.pathname]);

  // Filter pages based on search query
  const filteredPages = allPages.filter((page) =>
    page.title.toLowerCase().includes(commandQuery.toLowerCase())
  );

  // Get recent pages for Command K when query is empty
  const recentPagesForCommand = useMemo(() => {
    const visitedPages = getRecentPages();
    const pageMap = new Map(allPages.map((p) => [p.id, p]));

    return visitedPages
      .slice(0, 6)
      .map((visited) => pageMap.get(visited.pageId))
      .filter(Boolean);
  }, [allPages]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background" data-testid="authenticated-layout">
      <ResizablePanelGroup direction="horizontal" className="h-full w-full">
        {/* Resizable Sidebar Panel */}
        <ResizablePanel
          id="sidebar-panel"
          defaultSize={sidebarCollapsed ? 0 : 20}
          minSize={sidebarCollapsed ? 0 : 10}
          maxSize={sidebarCollapsed ? 0 : 40}
          collapsible={false}
          onResize={(size: number) => {
            console.log("[Sidebar Resize]", size);
            setSidebarSize(size);
          }}
          className="min-w-[140px]"
        >
          {!sidebarCollapsed && (
            <Sidebar
              workspaces={workspaces}
              activeWorkspace={activeWorkspace}
              onWorkspaceChange={switchWorkspace}
              onCreateWorkspace={() => setShowCreateDialog(true)}
              onWorkspaceSettings={handleWorkspaceSettings}
              onInviteMembers={handleInviteMembers}
              userEmail={user?.email}
              onLogout={handleLogout}
              onSearchClick={() => {
                setShowInbox(false); // Close inbox when opening search
                setShowCommand(true);
              }}
              onHomeClick={() => {
                setShowInbox(false); // Close inbox when going home
                navigate({ to: "/home" });
              }}
              onInboxClick={handleInboxToggle} // Toggle inbox instead of just opening
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
              isSidebarCollapsed={sidebarCollapsed}
            >
              <div className="mt-4 space-y-6">
                {/* Favorites Section - Always visible */}
                {!!favoritePages.length && (
                  <PageTree
                    title="Favorites"
                    pages={favoritePages}
                    activePageId={activePageId}
                    maxItems={10}
                    showCreateButton={false}
                    onPageSelect={navigateToPage}
                    onToggleFavorite={(pageId: string) =>
                      toggleFavorite(pageId)
                    }
                    onPageDelete={(pageId: string) => deletePage(pageId)}
                    onPageRename={(pageId: string) => {
                      const newTitle = prompt("Enter new title:");
                      if (newTitle) updatePage(pageId, { title: newTitle });
                    }}
                    onDuplicate={(pageId: string) => duplicatePage(pageId)}
                    onCopyLink={(pageId: string) => copyPageLink(pageId)}
                  />
                )}
                {/* Private Pages Section - Always visible */}
                <PageTree
                  title="Private"
                  pages={privatePages}
                  activePageId={activePageId}
                  maxItems={10}
                  onPageSelect={navigateToPage}
                  onPageCreate={(parentId?: string) =>
                    handleCreatePage("Untitled", parentId)
                  }
                  onToggleFavorite={(pageId: string) => toggleFavorite(pageId)}
                  onPageDelete={(pageId: string) => deletePage(pageId)}
                  onPageRename={(pageId: string) => {
                    const newTitle = prompt("Enter new title:");
                    if (newTitle) updatePage(pageId, { title: newTitle });
                  }}
                  onDuplicate={(pageId: string) => duplicatePage(pageId)}
                  onCopyLink={(pageId: string) => copyPageLink(pageId)}
                />
              </div>
            </Sidebar>
          )}
        </ResizablePanel>

        {/* Hamburger menu when collapsed */}
        {sidebarCollapsed && (
          <div className="fixed top-4 left-4 z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Resizable Handle */}
        {!sidebarCollapsed && (
          <ResizableHandle withHandle className="bg-border hover:bg-accent" />
        )}

        {/* Main Content Panel */}
        <ResizablePanel
          id="main-panel"
          defaultSize={sidebarCollapsed ? 100 : 80}
        >
          <div className="flex flex-col h-full">
            {/* Main Content */}
            <div
              className="flex-1 overflow-auto"
              onClick={handleMainContentClick}
            >
              <Outlet />
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Workspace Dialogs */}
      {showCreateDialog && (
        <CreateWorkspaceDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onCreateWorkspace={handleCreateWorkspace}
        />
      )}

      {showInviteDialog && (
        <InviteMembersDialog
          open={showInviteDialog}
          onOpenChange={setShowInviteDialog}
          workspaceName={selectedWorkspace?.name || ""}
          onInviteMember={handleInviteMember}
        />
      )}

      {showSettingsDialog && (
        <WorkspaceSettingsDialog
          open={showSettingsDialog}
          onOpenChange={setShowSettingsDialog}
          workspace={selectedWorkspace || null}
          onUpdateWorkspace={handleUpdateWorkspace}
          onDeleteWorkspace={handleDeleteWorkspace}
        />
      )}

      {/* Command Palette */}
      <Command open={showCommand} onOpenChange={setShowCommand}>
        <CommandInput
          placeholder="Search pages..."
          value={commandQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setCommandQuery(e.target.value)
          }
        />
        <CommandList>
          {filteredPages.length === 0 && commandQuery && (
            <CommandEmpty>No pages found</CommandEmpty>
          )}

          {filteredPages.length > 0 && (
            <CommandGroup heading="Pages">
              {filteredPages.map((page) => (
                <CommandItem
                  key={page.id}
                  onSelect={() => {
                    navigateToPage(page.id);
                    setCommandQuery("");
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  <span>{page.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {!commandQuery && (
            <>
              {/* Recent Pages Section */}
              {recentPagesForCommand.length > 0 && (
                <CommandGroup heading="Recently Visited">
                  {recentPagesForCommand.map((page: any) => (
                    <CommandItem
                      key={page.id}
                      onSelect={() => {
                        navigateToPage(page.id);
                        setShowCommand(false);
                      }}
                    >
                      {page.icon ? (
                        <span className="mr-2 text-base">{page.icon}</span>
                      ) : (
                        <FileText className="mr-2 h-4 w-4" />
                      )}
                      <span>{page.title}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {/* Quick Actions Section */}
              <CommandGroup heading="Quick Actions">
                <CommandItem onSelect={() => navigate({ to: "/home" })}>
                  <Home className="mr-2 h-4 w-4" />
                  <span>Go to Home</span>
                </CommandItem>
                <CommandItem onSelect={() => handleCreatePage("Untitled")}>
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Create new page</span>
                </CommandItem>
                <CommandItem onSelect={() => setShowSettingsDialog(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Workspace settings</span>
                </CommandItem>
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>

      {/* Floating Inbox Sheet */}
      <InboxSheet open={showInbox} onOpenChange={setShowInbox} />
    </div>
  );
}
