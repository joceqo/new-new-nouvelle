# Module: lib/page-context.tsx

Status: stable
Intent: Page management system with hierarchical tree structure, CRUD operations, and React Query integration for workspace pages.

## Exports

```ts
export function PageProvider({ children }: { children: React.ReactNode }): JSX.Element;
export function usePage(): PageContextValue;

export interface Page {
  id: string;
  title: string;
  icon?: string;
  isFavorite?: boolean;
  visibility?: "private" | "workspace" | "public";
  hasChildren?: boolean;
  children?: Page[];
  createdAt?: number;
  updatedAt?: number;
}

interface PageContextValue {
  pages: Page[];
  favorites: Page[];
  recent: Page[];
  isLoading: boolean;
  error: string | null;
  createPage: (title: string, parentId?: string, icon?: string) => Promise<{ success: boolean; pageId?: string; error?: string }>;
  updatePage: (pageId: string, updates: Partial<Page>) => Promise<{ success: boolean; error?: string }>;
  deletePage: (pageId: string) => Promise<{ success: boolean; error?: string }>;
  toggleFavorite: (pageId: string) => Promise<{ success: boolean; error?: string }>;
  archivePage: (pageId: string) => Promise<{ success: boolean; error?: string }>;
  restorePage: (pageId: string) => Promise<{ success: boolean; error?: string }>;
  duplicatePage: (pageId: string) => Promise<{ success: boolean; pageId?: string; error?: string }>;
  copyPageLink: (pageId: string) => Promise<{ success: boolean; error?: string }>;
  refreshPages: () => Promise<void>;
  clearError: () => void;
}
```

## Purpose & Behavior

### Core Functionality

- **Hierarchical page tree**: Builds nested page structure from flat API data
- **Workspace-scoped**: Pages are filtered by active workspace
- **Three collections**: All pages, favorites, and recently viewed
- **Full CRUD**: Create, read, update, delete operations
- **Page actions**: Favorite, archive, restore, duplicate, copy link
- **React Query integration**: Automatic caching and revalidation

### Tree Building Algorithm

Converts flat page list to nested tree structure:

1. **First pass**: Create map of all page objects by ID
2. **Second pass**: Build parent-child relationships using `parentPageId`
3. **Result**: Array of root pages with nested children

## Component Contract

### PageProvider

```tsx
<PageProvider>
  {/* Components that need page data */}
</PageProvider>
```

**Props**: `children` - React components to wrap with page context

**Dependencies**: Must be wrapped by `AuthProvider` and `WorkspaceProvider`

**Behavior**:
- Fetches pages when workspace becomes active
- Prevents race conditions with loading state checks
- Automatically refetches on workspace switch

### usePage Hook

```ts
const { pages, favorites, recent, isLoading, createPage, updatePage, deletePage, ... } = usePage();
```

**Returns**: `PageContextValue` object with data and methods

**Throws**: Error if used outside `PageProvider`

## State Management

### React Query Configuration

```ts
{
  queryKey: ["pages", activeWorkspace?.id],
  enabled: !!token && isAuthenticated && !!activeWorkspace && !authLoading && !workspaceLoading,
  staleTime: 1 * 60 * 1000,     // 1 minute
  gcTime: 5 * 60 * 1000,        // 5 minutes
}
```

**Key insight**: Prevents race conditions by checking all loading states before enabling query

### Data Structure

```ts
{
  pages: Page[],        // Root pages with nested children
  favorites: Page[],    // User-favorited pages
  recent: Page[],       // Recently viewed pages
}
```

## Methods

### createPage(title, parentId?, icon?)

**Purpose**: Create new page in workspace

**Parameters**:
- `title` - Page title
- `parentId` - Optional parent page ID for nesting
- `icon` - Optional emoji icon

**Returns**: `{ success: boolean; pageId?: string; error?: string }`

**Side effects**: Invalidates page queries for automatic UI update

### updatePage(pageId, updates)

**Purpose**: Update existing page properties

**Parameters**:
- `pageId` - Target page ID
- `updates` - Partial page object with fields to update

**Use cases**: Rename, change icon, update visibility

### deletePage(pageId)

**Purpose**: Permanently delete page

**Warning**: Deletes page and all children (if backend supports cascading)

### toggleFavorite(pageId)

**Purpose**: Add or remove page from favorites

**Behavior**: Toggles current favorite state (idempotent)

### archivePage(pageId)

**Purpose**: Move page to trash/archive

**Behavior**: Page hidden from main tree but recoverable

### restorePage(pageId)

**Purpose**: Restore archived page to active state

### duplicatePage(pageId)

**Status**: Not implemented

**Returns**: Error with "not yet implemented" message

**TODO**: Backend endpoint needed

### copyPageLink(pageId)

**Purpose**: Copy shareable page URL to clipboard

**URL format**: `{origin}/page/{pageId}`

**Uses**: `navigator.clipboard.writeText()`

### refreshPages()

**Purpose**: Manual refetch of page data

**Use case**: After external changes or user request

### clearError()

**Purpose**: Reset query error state

**Implementation**: Calls `queryClient.resetQueries()`

## API Endpoints

```ts
GET    /workspaces/:workspaceId/pages           // All pages
GET    /workspaces/:workspaceId/pages/favorites // Favorite pages
GET    /workspaces/:workspaceId/pages/recent    // Recent pages
POST   /workspaces/:workspaceId/pages           // Create page
PATCH  /pages/:pageId                           // Update page
DELETE /pages/:pageId                           // Delete page
POST   /pages/:pageId/favorite                  // Toggle favorite
POST   /pages/:pageId/archive                   // Archive page
POST   /pages/:pageId/restore                   // Restore page
```

## Dependencies

- `react` - Context, hooks, component model
- `@tanstack/react-query` - Query and mutation management
- `./auth-context` - Token and auth state
- `./workspace-context` - Active workspace

## Usage Examples

### App Setup

```tsx
import { AuthProvider, WorkspaceProvider, PageProvider } from '@nouvelle/router';

function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <PageProvider>
          <RouterProvider router={router} />
        </PageProvider>
      </WorkspaceProvider>
    </AuthProvider>
  );
}
```

### Display Page Tree

```tsx
import { usePage } from '@nouvelle/router';

function PageTree() {
  const { pages, isLoading } = usePage();

  if (isLoading) return <Spinner />;

  return (
    <ul>
      {pages.map(page => (
        <PageTreeItem key={page.id} page={page} />
      ))}
    </ul>
  );
}
```

### Create Page

```tsx
const { createPage } = usePage();

const handleCreatePage = async () => {
  const result = await createPage('New Page', parentId, '📄');
  if (result.success) {
    navigate(`/page/${result.pageId}`);
  } else {
    toast.error(result.error);
  }
};
```

### Favorites Sidebar

```tsx
const { favorites, toggleFavorite } = usePage();

function FavoritesList() {
  return (
    <div>
      <h3>Favorites</h3>
      {favorites.map(page => (
        <div key={page.id}>
          <span>{page.icon} {page.title}</span>
          <button onClick={() => toggleFavorite(page.id)}>⭐</button>
        </div>
      ))}
    </div>
  );
}
```

### Page Actions Menu

```tsx
const { deletePage, archivePage, duplicatePage, copyPageLink } = usePage();

function PageActionsMenu({ pageId }: { pageId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuItem onClick={() => archivePage(pageId)}>
        Archive
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => duplicatePage(pageId)}>
        Duplicate
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => copyPageLink(pageId)}>
        Copy Link
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => deletePage(pageId)} danger>
        Delete
      </DropdownMenuItem>
    </DropdownMenu>
  );
}
```

## Performance Characteristics

- **Initial load**: Three parallel API requests (pages, favorites, recent)
- **Tree building**: O(n) complexity with two passes over data
- **Stale time**: 1 minute before revalidation
- **Cache persistence**: 5 minutes after component unmount
- **Mutation updates**: Automatic refetch only on success

## Known Limitations

- **Duplicate not implemented**: Backend endpoint missing
- **No offline support**: Requires network connection
- **No optimistic updates**: Waits for API confirmation before UI update
- **No pagination**: Loads all pages at once (may not scale for large workspaces)
- **No search**: Client-side filtering only

## Race Condition Prevention

The query is only enabled when:
```ts
enabled: !!token && isAuthenticated && !!activeWorkspace && !authLoading && !workspaceLoading
```

This prevents:
- Fetching pages before authentication completes
- Fetching pages before workspace is selected
- Race conditions between auth/workspace/page queries

## Error Handling

- **Network errors**: Logged and returned as error message
- **Auth errors**: Automatically handled by auth context
- **Not found errors**: Returns empty arrays, no crash
- **Mutation errors**: Caught and returned to caller for user feedback

## Future Improvements

- **Implement duplicatePage**: Add backend endpoint and frontend logic
- **Optimistic updates**: Instant UI feedback before API confirmation
- **Pagination**: Load pages in chunks for scalability
- **Search**: Full-text search across page titles and content
- **Real-time sync**: WebSocket updates for multi-user editing
- **Offline support**: Cache pages for offline access
- **Drag and drop**: Reorder and re-parent pages visually
- **Batch operations**: Select and act on multiple pages at once
- **Version history**: Track and restore page versions

## Related Files

- Uses: `lib/auth-context.tsx` - Token and auth state
- Uses: `lib/workspace-context.tsx` - Active workspace
- Used by: Page tree components, sidebar, navigation
- Used by: Page editor, page settings dialogs

Last updated: 2025-11-12
