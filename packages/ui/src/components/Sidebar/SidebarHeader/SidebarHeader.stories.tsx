import type { Meta, StoryObj } from "@storybook/react";
import { IconWrapper } from "@/components/IconWrapper";
import { Home, Building2, Briefcase } from "lucide-react";
import { SidebarHeader } from "./SidebarHeader";
import { useState } from "react";

const meta = {
  title: "Components/Domain/Sidebar/SidebarHeader",
  component: SidebarHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-80 bg-[var(--sidebar-bg)] p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SidebarHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <IconWrapper icon={Home} />,
    label: "My Workspace",
    onToggleSidebar: () => console.log("Toggle sidebar clicked"),
    onCreateNewPage: () => console.log("Create new page clicked"),
    onLabelClick: () => console.log("Label clicked"),
  },
};

export const WithEmoji: Story = {
  args: {
    icon: <span className="text-xl">🏠</span>,
    label: "My Workspace",
    onToggleSidebar: () => console.log("Toggle sidebar clicked"),
    onCreateNewPage: () => console.log("Create new page clicked"),
    onLabelClick: () => console.log("Label clicked"),
  },
};

export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <SidebarHeader
        icon={<IconWrapper icon={Building2} />}
        label="Documentation"
        isOpen={isOpen}
        onLabelClick={() => {
          setIsOpen(!isOpen);
          console.log("Workspace switcher toggled:", !isOpen);
        }}
        onToggleSidebar={() => console.log("Toggle sidebar")}
        onCreateNewPage={() => console.log("Create new page")}
      />
    );
  },
};

export const NoDivider: Story = {
  args: {
    icon: <IconWrapper icon={Briefcase} />,
    label: "Projects",

    onToggleSidebar: () => console.log("Toggle sidebar"),
    onCreateNewPage: () => console.log("Create new page"),
  },
};

export const MinimalActions: Story = {
  args: {
    icon: <span className="text-xl">📚</span>,
    label: "Knowledge Base",
    onCreateNewPage: () => console.log("Create new page"),
    // No onToggleSidebar - will hide that button
  },
};

export const LongName: Story = {
  args: {
    icon: <IconWrapper icon={Home} />,
    label: "Super Long Workspace Name That Should Truncate Properly",
    onToggleSidebar: () => console.log("Toggle sidebar"),
    onCreateNewPage: () => console.log("Create new page"),
    onLabelClick: () => console.log("Label clicked"),
  },
};
