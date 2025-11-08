import type { Meta, StoryObj } from "@storybook/react";
import { WorkspaceHeader, Workspace } from "@/components/Sidebar/WorkspaceSwitcher/WorkspaceHeader";

const meta = {
  title: "Components/Domain/WorkspaceSwitcher/WorkspaceHeader",
  component: WorkspaceHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    workspaces: {
      description: "Array of available workspaces",
    },
    activeWorkspace: {
      description: "Currently active workspace",
    },
    onWorkspaceChange: {
      description: "Callback when workspace is changed",
    },
    onCreateWorkspace: {
      description: "Callback to create new workspace",
    },
    onNewPage: {
      description: "Callback to create new page",
    },
    onToggleSidebar: {
      description: "Callback to toggle sidebar collapse",
    },
    isSidebarCollapsed: {
      description: "Whether sidebar is collapsed",
      control: "boolean",
    },
    className: {
      description: "Additional CSS classes",
    },
  },
  args: {
    onWorkspaceChange: (workspaceId: string) =>
      console.log("Workspace changed:", workspaceId),
    onCreateWorkspace: () => console.log("Create workspace clicked"),
    onNewPage: () => console.log("New page clicked"),
    onToggleSidebar: () => console.log("Toggle sidebar clicked"),
  },
} satisfies Meta<typeof WorkspaceHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample workspace data with various icon types
const workspaces: Workspace[] = [
  {
    id: "1",
    name: "Acme Corporation",
    icon: "a", // Letter
    plan: "pro",
    role: "owner",
    memberCount: 12,
  },
  {
    id: "2",
    name: "Design Team",
    icon: "🎨", // Emoji
    plan: "team",
    role: "admin",
    memberCount: 5,
  },
  {
    id: "3",
    name: "Marketing Hub",
    icon: "https://api.dicebear.com/7.x/initials/svg?seed=MH", // Image URL
    plan: "pro",
    role: "member",
    memberCount: 8,
  },
  {
    id: "4",
    name: "Personal Projects",
    icon: "🚀", // Emoji
    plan: "free",
    role: "owner",
    memberCount: 1,
  },
];

/**
 * Default workspace header with Notion-style clean design.
 * Hover over the header to see the chevron down appear.
 */
export const Default: Story = {
  args: {
    workspaces,
    activeWorkspace: workspaces[0],
    isSidebarCollapsed: false,
  },
};

/**
 * Workspace header with emoji icon for the active workspace
 */
export const WithEmoji: Story = {
  args: {
    workspaces,
    activeWorkspace: workspaces[1],
    isSidebarCollapsed: false,
  },
};

/**
 * Workspace header with sidebar collapsed
 */
export const SidebarCollapsed: Story = {
  args: {
    workspaces,
    activeWorkspace: workspaces[0],
    isSidebarCollapsed: true,
  },
};

/**
 * Minimal workspace header with only workspace switching
 */
export const MinimalFeatures: Story = {
  args: {
    workspaces,
    activeWorkspace: workspaces[0],
    isSidebarCollapsed: false,
    // No onToggleSidebar, onNewPage, or onCreateWorkspace
  },
};
