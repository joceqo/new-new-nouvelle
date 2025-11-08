import type { Meta, StoryObj } from "@storybook/react";
import { WorkspaceIcon } from "@/components/Sidebar/WorkspaceSwitcher/WorkspaceIcon";

const meta = {
  title: "Components/Domain/WorkspaceSwitcher/WorkspaceIcon",
  component: WorkspaceIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      description: "The workspace identifier - can be a URL, emoji, character, or workspace name",
      control: "text",
    },
    alt: {
      description: "Alt text for image when value is a URL",
      control: "text",
    },
  },
} satisfies Meta<typeof WorkspaceIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default workspace icon showing a 'c' character.
 * The icon size adapts to the parent's font-size (1.4em).
 */
export const Default: Story = {
  args: {
    value: "c",
  },
};

/**
 * Workspace icon with an emoji
 */
export const WithEmoji: Story = {
  args: {
    value: "🚀",
  },
};

/**
 * Workspace icon with an image URL
 */
export const WithImage: Story = {
  args: {
    value: "https://api.dicebear.com/7.x/initials/svg?seed=AC",
    alt: "Acme Corporation",
  },
};

/**
 * Workspace name (takes first letter)
 */
export const FromWorkspaceName: Story = {
  args: {
    value: "Code Projects",
  },
};

/**
 * The icon automatically scales with font-size.
 * Set different font sizes on the parent to control icon size.
 */
export const AdaptiveSize: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <div style={{ fontSize: "12px" }}>
        <WorkspaceIcon value="c" />
      </div>
      <div style={{ fontSize: "16px" }}>
        <WorkspaceIcon value="c" />
      </div>
      <div style={{ fontSize: "24px" }}>
        <WorkspaceIcon value="c" />
      </div>
      <div style={{ fontSize: "32px" }}>
        <WorkspaceIcon value="c" />
      </div>
    </div>
  ),
};

/**
 * Mixed content examples showing all supported types.
 * All icons scale with the parent font-size (16px in this example).
 */
export const AllTypes: Story = {
  render: () => (
    <div className="flex flex-col gap-6" style={{ fontSize: "16px" }}>
      <div>
        <p className="mb-2 text-sm text-gray-500">Letters</p>
        <div className="flex items-center gap-4">
          <WorkspaceIcon value="a" />
          <WorkspaceIcon value="z" />
          <WorkspaceIcon value="m" />
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-500">Emojis</p>
        <div className="flex items-center gap-4">
          <WorkspaceIcon value="🎨" />
          <WorkspaceIcon value="🔥" />
          <WorkspaceIcon value="⚡" />
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-500">Workspace Names</p>
        <div className="flex items-center gap-4">
          <WorkspaceIcon value="Design Team" />
          <WorkspaceIcon value="Marketing" />
          <WorkspaceIcon value="Personal" />
        </div>
      </div>
      <div>
        <p className="mb-2 text-sm text-gray-500">Images</p>
        <div className="flex items-center gap-4">
          <WorkspaceIcon value="https://api.dicebear.com/7.x/initials/svg?seed=AC" />
          <WorkspaceIcon value="https://api.dicebear.com/7.x/initials/svg?seed=DT" />
          <WorkspaceIcon value="https://api.dicebear.com/7.x/initials/svg?seed=MH" />
        </div>
      </div>
    </div>
  ),
};
