import type { Meta, StoryObj } from "@storybook/react";
import { PageTreeItem, Page } from "@/components/Sidebar/PageTree/PageTreeItem";
import { useState } from "react";

const meta = {
  title: "Components/Domain/Sidebar/PageTreeItem",
  component: PageTreeItem,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
# PageTreeItem Component

A Notion-inspired hierarchical page tree item component with nested children, favorites, and contextual actions.

## Features

- **Custom Icons**: Support for emoji or default file icon
- **Hierarchical Structure**: Nested pages with automatic indentation
- **Expandable/Collapsible**: Chevron toggles for parent pages
- **Favorites**: Star indicator for favorite pages
- **Hover Actions**: Plus button and dropdown menu visible on hover
- **Active State**: Visual indication of currently selected page
- **Context Menu**: Rename, delete, add to favorites, and create child pages

## Usage

\`\`\`tsx
import { PageTreeItem } from '@nouvelle/ui';

<PageTreeItem
  page={{
    id: '1',
    title: 'My Page',
    icon: '📄',
    isFavorite: false,
    children: []
  }}
  level={0}
  isActive={false}
  onSelect={(pageId) => console.log('Selected:', pageId)}
  onToggleFavorite={(pageId) => console.log('Toggle favorite:', pageId)}
  onCreateChild={(parentId) => console.log('Create child for:', parentId)}
  onDelete={(pageId) => console.log('Delete:', pageId)}
  onRename={(pageId) => console.log('Rename:', pageId)}
/>
\`\`\`
        `,
      },
    },
  },
  decorators: [(Story) => <Story />],
  tags: ["autodocs"],
} satisfies Meta<typeof PageTreeItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const samplePage: Page = {
  id: "1",
  title: "Getting Started",
  icon: "📚",
};

const samplePageWithChildren: Page = {
  id: "1",
  title: "Documentation",
  icon: "📖",
  hasChildren: true,
  children: [
    {
      id: "1-1",
      title: "Introduction",
      icon: "👋",
    },
    {
      id: "1-2",
      title: "API Reference",
      icon: "⚡",
    },
    {
      id: "1-3",
      title: "Examples",
      icon: "💡",
      hasChildren: true,
      children: [
        {
          id: "1-3-1",
          title: "Basic Example",
        },
        {
          id: "1-3-2",
          title: "Advanced Example",
        },
      ],
    },
  ],
};

export const Default: Story = {
  args: {
    page: samplePage,
    level: 0,
    onSelect: (pageId) => console.log("Selected:", pageId),
  },
};

export const WithDefaultIcon: Story = {
  args: {
    page: {
      id: "1",
      title: "Untitled Page",
    },
    level: 0,
  },
};

export const Active: Story = {
  args: {
    page: {
      id: "1",
      title: "Current Page",
      icon: "✨",
    },
    level: 0,
    isActive: true,
  },
};

export const Favorite: Story = {
  args: {
    page: {
      id: "1",
      title: "Important Document",
      icon: "📋",
      isFavorite: true,
    },
    level: 0,
  },
};

export const WithChildren: Story = {
  args: {
    page: samplePageWithChildren,
    level: 0,
    onSelect: (pageId) => console.log("Selected:", pageId),
    onToggleFavorite: (pageId) => console.log("Toggle favorite:", pageId),
    onCreateChild: (parentId) => console.log("Create child for:", parentId),
    onDelete: (pageId) => console.log("Delete:", pageId),
    onRename: (pageId) => console.log("Rename:", pageId),
  },
};

export const NestedStructure: Story = {
  render: () => {
    const complexPage: Page = {
      id: "root",
      title: "Project Documentation",
      icon: "🚀",
      hasChildren: true,
      children: [
        {
          id: "design",
          title: "Design System",
          icon: "🎨",
          isFavorite: true,
          hasChildren: true,
          children: [
            {
              id: "design-colors",
              title: "Colors",
              icon: "🌈",
            },
            {
              id: "design-typography",
              title: "Typography",
              icon: "✍️",
            },
          ],
        },
        {
          id: "components",
          title: "Components",
          icon: "🧩",
          hasChildren: true,
          children: [
            {
              id: "components-buttons",
              title: "Buttons",
            },
            {
              id: "components-inputs",
              title: "Inputs",
            },
          ],
        },
        {
          id: "guides",
          title: "Guides",
          icon: "📖",
        },
      ],
    };

    return (
      <PageTreeItem
        page={complexPage}
        level={0}
        onSelect={(pageId) => console.log("Selected:", pageId)}
        onToggleFavorite={(pageId) => console.log("Toggle favorite:", pageId)}
        onCreateChild={(parentId) => console.log("Create child for:", parentId)}
        onDelete={(pageId) => console.log("Delete:", pageId)}
        onRename={(pageId) => console.log("Rename:", pageId)}
      />
    );
  },
};

export const InteractiveExample: Story = {
  render: () => {
    const [pages, setPages] = useState<Page[]>([
      {
        id: "1",
        title: "Team Wiki",
        icon: "📚",
        isFavorite: false,
        hasChildren: true,
        children: [
          {
            id: "1-1",
            title: "Meeting Notes",
            icon: "📝",
            isFavorite: true,
          },
          {
            id: "1-2",
            title: "Projects",
            icon: "🎯",
          },
        ],
      },
      {
        id: "2",
        title: "Personal",
        icon: "👤",
        isFavorite: false,
      },
    ]);
    const [activePage, setActivePage] = useState<string | null>("1-1");

    const handleToggleFavorite = (pageId: string) => {
      const toggleFavoriteRecursive = (pages: Page[]): Page[] => {
        return pages.map((page) => {
          if (page.id === pageId) {
            return { ...page, isFavorite: !page.isFavorite };
          }
          if (page.children) {
            return {
              ...page,
              children: toggleFavoriteRecursive(page.children),
            };
          }
          return page;
        });
      };
      setPages(toggleFavoriteRecursive(pages));
    };

    const handleDelete = (pageId: string) => {
      const deleteRecursive = (pages: Page[]): Page[] => {
        return pages
          .filter((page) => page.id !== pageId)
          .map((page) => ({
            ...page,
            children: page.children
              ? deleteRecursive(page.children)
              : undefined,
          }));
      };
      setPages(deleteRecursive(pages));
      if (activePage === pageId) {
        setActivePage(null);
      }
    };

    const handleRename = (pageId: string) => {
      const newTitle = prompt("Enter new title:");
      if (!newTitle) return;

      const renameRecursive = (pages: Page[]): Page[] => {
        return pages.map((page) => {
          if (page.id === pageId) {
            return { ...page, title: newTitle };
          }
          if (page.children) {
            return {
              ...page,
              children: renameRecursive(page.children),
            };
          }
          return page;
        });
      };
      setPages(renameRecursive(pages));
    };

    const handleCreateChild = (parentId: string) => {
      const title = prompt("Enter page title:");
      if (!title) return;

      const newChild: Page = {
        id: `${parentId}-${Date.now()}`,
        title,
        icon: "📄",
        isFavorite: false,
      };

      const addChildRecursive = (pages: Page[]): Page[] => {
        return pages.map((page) => {
          if (page.id === parentId) {
            return {
              ...page,
              hasChildren: true,
              children: [...(page.children || []), newChild],
            };
          }
          if (page.children) {
            return {
              ...page,
              children: addChildRecursive(page.children),
            };
          }
          return page;
        });
      };
      setPages(addChildRecursive(pages));
    };

    return (
      <div className="space-y-1">
        {pages.map((page) => (
          <PageTreeItem
            key={page.id}
            page={page}
            level={0}
            isActive={activePage === page.id}
            onSelect={setActivePage}
            onToggleFavorite={handleToggleFavorite}
            onCreateChild={handleCreateChild}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        ))}
      </div>
    );
  },
};

export const DifferentLevels: Story = {
  render: () => {
    const pages = [
      { id: "1", title: "Level 0", icon: "1️⃣" },
      { id: "2", title: "Level 1", icon: "2️⃣" },
      { id: "3", title: "Level 2", icon: "3️⃣" },
      { id: "4", title: "Level 3", icon: "4️⃣" },
    ];

    return (
      <div className="space-y-1">
        {pages.map((page, index) => (
          <PageTreeItem key={page.id} page={page} level={index} />
        ))}
      </div>
    );
  },
};

export const MixedStates: Story = {
  render: () => {
    const pages: Page[] = [
      {
        id: "1",
        title: "Active Page",
        icon: "✅",
      },
      {
        id: "2",
        title: "Favorite Page",
        icon: "⭐",
        isFavorite: true,
      },
      {
        id: "3",
        title: "Page with Children",
        icon: "📁",
        hasChildren: true,
        children: [
          {
            id: "3-1",
            title: "Child Page",
            icon: "📄",
          },
        ],
      },
      {
        id: "4",
        title: "Active + Favorite",
        icon: "💎",
        isFavorite: true,
      },
      {
        id: "5",
        title: "No Icon",
      },
    ];

    return (
      <div className="space-y-1">
        {pages.map((page, index) => (
          <PageTreeItem
            key={page.id}
            page={page}
            level={0}
            isActive={page.id === "1" || page.id === "4"}
          />
        ))}
      </div>
    );
  },
};

export const LongTitles: Story = {
  render: () => {
    const pages: Page[] = [
      {
        id: "1",
        title: "This is a very long page title that should be truncated",
        icon: "📄",
      },
      {
        id: "2",
        title:
          "Another extremely long page title that demonstrates text overflow behavior in the component",
        icon: "📝",
        isFavorite: true,
      },
      {
        id: "3",
        title: "Short",
        icon: "✨",
      },
    ];

    return (
      <div className="space-y-1">
        {pages.map((page) => (
          <PageTreeItem key={page.id} page={page} level={0} />
        ))}
      </div>
    );
  },
};
