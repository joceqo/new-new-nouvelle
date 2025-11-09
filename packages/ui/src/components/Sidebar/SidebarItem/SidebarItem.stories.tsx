import type { Meta, StoryObj } from "@storybook/react";
import { Flex } from "@radix-ui/themes";
import {
  FileText,
  Folder,
  Settings,
  Home,
  User,
  Bell,
  Star,
  Trash2,
  Edit,
  BookOpen,
  Code,
} from "lucide-react";
import { SidebarItem } from "@/components/Sidebar/SidebarItem/SidebarItem";

const meta = {
  title: "Components/Domain/Sidebar/SidebarItem",
  component: SidebarItem,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# SidebarItem Component

A Notion-inspired sidebar item component with hover states, badges, actions, and nesting support.

## Features

- **Icons**: Lucide icon support
- **Hover/Active States**: CSS variable-based theming
- **Badges**: Optional badges with "default" or "accent" variants
- **Actions**: Hidden action buttons (ellipsis, plus) shown on hover
- **Expandable**: Chevron for collapsible items
- **Nesting**: Support for hierarchical structures with indentation
- **Links**: Can render as \`<a>\` or \`<div>\`

## Usage

\`\`\`tsx
import { SidebarItem } from '@nouvelle/ui';
import { FileText } from 'lucide-react';

<SidebarItem
  icon={FileText}
  label="Documents"
  isActive={true}
  badge="New"
  showActions
  onAdd={() => {}}
  onMore={() => {}}
/>
\`\`\`
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80 bg-[var(--sidebar-bg)] p-4">
        <Story />
      </div>
    ),
  ],
  tags: ["autodocs"],
} satisfies Meta<typeof SidebarItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: FileText,
    label: "Documents",
  },
};

export const Active: Story = {
  args: {
    icon: Home,
    label: "Home",
    isActive: true,
  },
};

export const WithBadge: Story = {
  args: {
    icon: Bell,
    label: "Notifications",
    badge: "3",
  },
};

export const WithAccentBadge: Story = {
  args: {
    icon: Star,
    label: "What's New",
    badge: "New",
    badgeVariant: "accent",
  },
};

export const Expandable: Story = {
  args: {
    icon: Folder,
    label: "Projects",
    isExpandable: true,
    isExpanded: false,
  },
};

export const ExpandableExpanded: Story = {
  args: {
    icon: Folder,
    label: "Projects",
    isExpandable: true,
    isExpanded: true,
  },
};

export const WithActions: Story = {
  args: {
    icon: FileText,
    label: "Project Files",
    showActions: true,
    onAdd: (e) => console.log("Add clicked"),
    onMore: (e) => console.log("More clicked"),
  },
};

export const Nested: Story = {
  render: () => (
    <Flex direction="column" gap="0.5">
      <SidebarItem
        icon={Folder}
        label="Parent Folder"
        level={0}
        isExpandable
        isExpanded
      />
      <SidebarItem icon={FileText} label="Child Document 1" level={1} />
      <SidebarItem icon={FileText} label="Child Document 2" level={1} />
      <SidebarItem
        icon={Folder}
        label="Nested Folder"
        level={1}
        isExpandable
        isExpanded
      />
      <SidebarItem icon={FileText} label="Grandchild" level={2} />
    </Flex>
  ),
};

export const NavigationList: Story = {
  render: () => (
    <Flex direction="column" gap="0.5">
      <SidebarItem icon={Home} label="Home" isActive />
      <SidebarItem icon={FileText} label="Documents" />
      <SidebarItem icon={User} label="Profile" />
      <SidebarItem icon={Settings} label="Settings" />
      <SidebarItem icon={Trash2} label="Trash" badge="11" />
    </Flex>
  ),
};

export const WithAllFeatures: Story = {
  render: () => (
    <Flex direction="column" gap="0.5">
      <SidebarItem
        icon={BookOpen}
        label="Documentation Hub"
        isExpandable
        isExpanded
        showActions
        onAdd={(e) => console.log("Add page")}
        onMore={(e) => console.log("More options")}
      />
      <SidebarItem
        icon={Code}
        label="API Reference"
        level={1}
        badge="Updated"
        badgeVariant="accent"
      />
      <SidebarItem icon={FileText} label="Getting Started" level={1} isActive />
      <SidebarItem
        icon={FileText}
        label="Advanced Topics"
        level={1}
        showActions
        onAdd={(e) => console.log("Add")}
        onMore={(e) => console.log("More")}
      />
    </Flex>
  ),
};

export const AsLink: Story = {
  args: {
    icon: Home,
    label: "Go Home",
    href: "/home",
  },
};

export const InteractiveStates: Story = {
  render: () => (
    <Flex direction="column" gap="2">
      <div>
        <div className="mb-1 px-2 text-xs text-[var(--sidebar-item-text-muted)]">
          Default State
        </div>
        <SidebarItem icon={FileText} label="Default Item" />
      </div>
      <div>
        <div className="mb-1 px-2 text-xs text-[var(--sidebar-item-text-muted)]">
          Active State
        </div>
        <SidebarItem icon={FileText} label="Active Item" isActive />
      </div>
      <div>
        <div className="mb-1 px-2 text-xs text-[var(--sidebar-item-text-muted)]">
          With Badge
        </div>
        <SidebarItem icon={Bell} label="Notifications" badge="5" />
      </div>
      <div>
        <div className="mb-1 px-2 text-xs text-[var(--sidebar-item-text-muted)]">
          With Actions (hover to see)
        </div>
        <SidebarItem
          icon={Folder}
          label="Hover Me"
          showActions
          onAdd={(e) => console.log("Add")}
          onMore={(e) => console.log("More")}
        />
      </div>
    </Flex>
  ),
};

export const HoverDemo: Story = {
  name: "Hover Behavior Demo",
  render: () => (
    <Flex direction="column" gap="3">
      <div className="rounded-md bg-[var(--sidebar-item-bg-active)] p-3">
        <div className="mb-2 text-sm font-semibold text-[var(--sidebar-item-text)]">
          💡 Hover over the items below to see interactions
        </div>
        <div className="text-xs text-[var(--sidebar-item-text-muted)]">
          • Icons become brighter on hover
          <br />
          • Action buttons appear on hover
          <br />• Background changes on hover
        </div>
      </div>

      <Flex direction="column" gap="0.5">
        <SidebarItem
          icon={FileText}
          label="Document with Actions"
          showActions
          onAdd={(e) => console.log("Add clicked")}
          onMore={(e) => console.log("More clicked")}
        />
        <SidebarItem
          icon={Folder}
          label="Expandable Folder"
          isExpandable
          onToggleExpand={() => console.log("Toggle")}
          showActions
          onAdd={(e) => console.log("Add")}
          onMore={(e) => console.log("More")}
        />
        <SidebarItem
          icon={Star}
          label="Favorite Item"
          badge="New"
          badgeVariant="accent"
          showActions
          onAdd={(e) => console.log("Add")}
          onMore={(e) => console.log("More")}
        />
      </Flex>
    </Flex>
  ),
};
