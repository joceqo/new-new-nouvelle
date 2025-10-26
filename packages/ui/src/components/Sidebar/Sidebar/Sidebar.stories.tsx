import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";
import { SidebarSection } from "../SidebarSection/SidebarSection";
import { SidebarItem } from "../SidebarItem/SidebarItem";
import { IconWrapper } from "@/components/IconWrapper";
import {
  Home,
  FileText,
  Wrench,
  Building2,
  Box,
  BookOpen,
  Rocket,
  Zap,
} from "lucide-react";
import { Flex, Text } from "@radix-ui/themes";

const meta = {
  title: "Components/Sidebar/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <IconWrapper icon={Home} />,
    workspaceName: "My Workspace",
    onToggleSidebar: () => console.log("Toggle sidebar"),
    onCreateNewPage: () => console.log("Create new page"),
    onWorkspaceClick: () => console.log("Workspace clicked"),
  },
};

export const WithContent: Story = {
  args: {
    icon: <span>🏠</span>,
    workspaceName: "My Workspace",
    onToggleSidebar: () => console.log("Toggle sidebar"),
    onCreateNewPage: () => console.log("Create new page"),
    onWorkspaceClick: () => console.log("Workspace clicked"),
    children: (
      <Flex direction="column" gap="3">
        {/* Favorites Section */}
        <SidebarSection title="Favorites">
          <Flex align="center" justify="center" py="4">
            <Text size="2" className="text-[var(--sidebar-item-text-muted)]">
              No pages yet
            </Text>
          </Flex>
        </SidebarSection>

        {/* Documents Section */}
        <SidebarSection title="Documents">
          <SidebarItem
            icon={FileText}
            label="Nouvelle Documentation Hub"
            isExpandable
            showActions
            onAdd={(e) => console.log("Add page")}
            onMore={(e) => console.log("More options")}
          />

          <SidebarItem
            icon={Wrench}
            label="API Routes Documentation (1)"
            level={1}
          />

          <SidebarItem
            icon={Building2}
            label="Architecture & Tech Stack"
            level={1}
          />

          <SidebarItem
            icon={Box}
            label="Components & UI System"
            level={1}
          />

          <SidebarItem
            icon={BookOpen}
            label="Developer Guide"
            level={1}
          />

          <SidebarItem
            icon={Rocket}
            label="Enhancement Opportunities"
            level={1}
          />

          <SidebarItem
            icon={Zap}
            label="Features & Functionality"
            level={1}
          />
        </SidebarSection>
      </Flex>
    ),
  },
};

export const WithNestedItems: Story = {
  args: {
    icon: <span>📚</span>,
    workspaceName: "Documentation",
    onToggleSidebar: () => console.log("Toggle sidebar"),
    onCreateNewPage: () => console.log("Create new page"),
    onWorkspaceClick: () => console.log("Workspace clicked"),
    children: (
      <Flex direction="column" gap="3">
        <SidebarSection title="Projects" defaultCollapsed={false}>
          <SidebarItem
            icon={FileText}
            label="Getting Started"
            isExpandable
            isExpanded
          />
          <SidebarItem
            icon={FileText}
            label="Introduction"
            level={1}
            isActive
          />
          <SidebarItem
            icon={FileText}
            label="Installation"
            level={1}
          />
          <SidebarItem
            icon={FileText}
            label="Configuration"
            level={1}
          />

          <SidebarItem
            icon={FileText}
            label="Advanced Topics"
            isExpandable
            showActions
            onAdd={(e) => console.log("Add")}
            onMore={(e) => console.log("More")}
          />
        </SidebarSection>
      </Flex>
    ),
  },
};
