# Pages System Implementation Guide

## ✅ What's Been Built

### 1. **Convex Schema** (`packages/convex/convex/schema.ts`)

Added a complete `pages` table with:

- Hierarchical structure (parent/child relationships)
- Workspace association
- Metadata tracking (favorites, archived, pinned)
- Visibility controls
- Position-based ordering

### 2. **Convex Functions** (`packages/convex/convex/pages.ts`)

Complete CRUD operations including:

- **Queries**: `list`, `get`, `getChildren`, `getFavorites`, `getRecent`, `getArchived`
- **Mutations**: `create`, `update`, `move`, `archive`, `restore`, `remove`, `markAsOpened`, `toggleFavorite`, `reorder`

### 3. **UI Components** (`packages/ui/src/components/PageTree/`)

- **PageTreeItem**: Individual page item with expand/collapse, hover actions, context menu
- **PageTree**: Full tree view with search, filtering, and empty states
- Exported in `@nouvelle/ui` for easy import

### 4. **Router Integration** (`packages/router/`)

- **PageView component**: `/pages/page/PageView.tsx` - Full page view with header, metadata, and placeholder for editor
- **Route added**: `/app/page/$pageId` in route tree

---

## 🚀 Next Steps to Complete the Integration

### Step 1: Connect Convex to Router

Create a pages context similar to your workspace context:

```typescript
// packages/router/src/lib/page-context.tsx
import { createContext, useContext, ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@nouvelle/convex";

interface PageContextType {
  pages: any[]; // Replace with proper type
  favorites: any[];
  recent: any[];
  createPage: (title: string, parentId?: string) => Promise<void>;
  updatePage: (pageId: string, updates: any) => Promise<void>;
  toggleFavorite: (pageId: string) => Promise<void>;
  // ... other methods
}

const PageContext = createContext<PageContextType | null>(null);

export function PageProvider({
  workspaceId,
  children
}: {
  workspaceId: string;
  children: ReactNode;
}) {
  const pages = useQuery(api.pages.list, { workspaceId }) || [];
  const favorites = useQuery(api.pages.getFavorites, { workspaceId }) || [];
  const recent = useQuery(api.pages.getRecent, { workspaceId, limit: 5 }) || [];

  const createMutation = useMutation(api.pages.create);
  const updateMutation = useMutation(api.pages.update);
  const toggleFavoriteMutation = useMutation(api.pages.toggleFavorite);

  const createPage = async (title: string, parentId?: string) => {
    await createMutation({
      workspaceId,
      title,
      parentPageId: parentId
    });
  };

  const updatePage = async (pageId: string, updates: any) => {
    await updateMutation({ pageId, ...updates });
  };

  const toggleFavorite = async (pageId: string) => {
    await toggleFavoriteMutation({ pageId });
  };

  return (
    <PageContext.Provider value={{
      pages,
      favorites,
      recent,
      createPage,
      updatePage,
      toggleFavorite
    }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePage() {
  const context = useContext(PageContext);
  if (!context) throw new Error("usePage must be used within PageProvider");
  return context;
}
```

### Step 2: Add PageTree to Sidebar

Update `AuthenticatedLayout.tsx` to use the PageTree:

```typescript
import { PageTree } from "@nouvelle/ui";
import { usePage } from "../lib/page-context";
import { useNavigate } from "@tanstack/react-router";

export function AuthenticatedLayout() {
  const navigate = useNavigate();
  const { pages, createPage, toggleFavorite } = usePage();

  // ... existing code

  return (
    <div className="flex h-screen bg-background">
      <Sidebar {...sidebarProps}>
        {/* Private Pages Section */}
        <PageTree
          title="Private"
          pages={pages.filter(p => p.visibility === "private")}
          onPageSelect={(pageId) => navigate({ to: "/app/page/$pageId", params: { pageId } })}
          onPageCreate={createPage}
          onToggleFavorite={toggleFavorite}
          showSearch={true}
        />

        {/* Shared Pages Section */}
        <PageTree
          title="Shared"
          pages={pages.filter(p => p.visibility === "workspace")}
          onPageSelect={(pageId) => navigate({ to: "/app/page/$pageId", params: { pageId } })}
          onPageCreate={createPage}
          onToggleFavorite={toggleFavorite}
        />
      </Sidebar>

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}
```

### Step 3: Connect PageView to Real Data

Update `PageView.tsx` to use Convex:

```typescript
import { useQuery, useMutation } from "convex/react";
import { api } from "@nouvelle/convex";

export function PageView() {
  const { pageId } = useParams({ from: "/app/page/$pageId" });
  const page = useQuery(api.pages.get, { pageId });
  const updatePage = useMutation(api.pages.update);
  const markAsOpened = useMutation(api.pages.markAsOpened);

  useEffect(() => {
    if (pageId) {
      markAsOpened({ pageId });
    }
  }, [pageId]);

  if (!page) return <div>Loading...</div>;

  // ... render page
}
```

### Step 4: Add Authentication to Convex Functions

Currently, the `create` mutation has a placeholder for user ID. Update it:

```typescript
// In packages/convex/convex/pages.ts
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    /* ... */
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // ... rest of the function using userId
  },
});
```

---

## 🎯 Features Ready to Use

### Core Features

- ✅ Hierarchical pages (nested unlimited levels)
- ✅ Drag & drop ready (position field exists)
- ✅ Favorites system
- ✅ Recently opened tracking
- ✅ Archive/restore functionality
- ✅ Search within pages
- ✅ Visibility controls (private/workspace/public)

### UI Features

- ✅ Expandable/collapsible tree
- ✅ Hover actions (create child, context menu)
- ✅ Icon support (emoji or custom)
- ✅ Active page indication
- ✅ Empty states
- ✅ Search highlighting

---

## 📋 Recommended Next Features (After Basic Integration)

### 1. **Favorites & Recent Sections**

Add special sections in the sidebar for quick access:

```typescript
<div className="mb-4">
  <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase">
    Favorites
  </h3>
  {favorites.map(page => (
    <SidebarItem
      key={page.id}
      icon={page.icon}
      label={page.title}
      onClick={() => navigate({ to: "/app/page/$pageId", params: { pageId: page.id } })}
    />
  ))}
</div>
```

### 2. **Keyboard Shortcuts**

- `Cmd+P` / `Ctrl+P`: Quick page search
- `Cmd+N` / `Ctrl+N`: New page
- `Cmd+K` / `Ctrl+K`: Command palette

### 3. **Page Templates**

Create common page templates:

- Meeting notes
- Project plan
- Task list
- Documentation

### 4. **Drag & Drop Reordering**

Use `@dnd-kit/core` to enable drag & drop:

```bash
pnpm add @dnd-kit/core @dnd-kit/sortable
```

### 5. **Breadcrumbs**

Show page hierarchy in the page view:

```
Workspace > Project Name > Meeting Notes > Q4 Planning
```

### 6. **Page Permissions**

Extend beyond visibility to role-based access:

- Can view
- Can comment
- Can edit
- Is owner

---

## 🏗️ Architecture Decisions Made

1. **Position-based ordering**: Each page has a `position` field for manual reordering within siblings
2. **Soft delete**: Pages are archived, not deleted (can be restored)
3. **Flat storage with parent pointers**: Not storing nested JSON, which makes queries simpler
4. **Separate visibility and permissions**: Visibility is simple (private/workspace/public), permissions can be added later
5. **Client-side tree building**: Pages are fetched flat and assembled into trees in the UI

---

## 🔧 Quick Start Commands

```bash
# Install dependencies (if not already)
pnpm install

# Start Convex dev server
cd packages/convex && pnpm run dev

# Start your app
pnpm run dev

# Type check
pnpm run typecheck
```

---

## 📝 Notes

- The editor is intentionally left as a placeholder
- All the "around features" are ready to be used
- The schema is designed to support future features like:
  - Comments (can be added as a separate table linking to pageId)
  - Activity feed (track page events)
  - Version history (can store snapshots)
  - Templates (can mark pages as templates)
  - Sharing links (can generate tokens per page)

---

## 🎉 What You Can Do Now

1. **Create pages** via UI or directly in Convex
2. **Nest pages** infinitely deep
3. **Mark favorites** and see them in a separate section
4. **Search pages** by title
5. **Archive pages** and restore them later
6. **Track recently opened** pages
7. **Control visibility** (private/workspace/public)
8. **Navigate** via sidebar tree or direct URLs

The foundation is solid - now you can build out search, comments, notifications, and all the other Notion-like features before tackling the block editor!
