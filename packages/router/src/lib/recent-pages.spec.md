# Module: lib/recent-pages.ts

Status: stable
Intent: localStorage-based utility for tracking and retrieving recently visited pages with automatic sorting and size limits.

## Exports

```ts
export interface RecentPageEntry {
  pageId: string;
  title: string;
  icon?: string;
  lastVisited: number;  // Unix timestamp in milliseconds
}

export function getRecentPages(): RecentPageEntry[];
export function trackPageVisit(pageId: string, title: string, icon?: string): void;
export function clearRecentPages(): void;
```

## Purpose & Behavior

### Core Functionality

- **Visit tracking**: Records page visits with timestamp
- **localStorage persistence**: Survives browser restarts
- **Automatic deduplication**: Updates existing entries instead of duplicating
- **Chronological sorting**: Most recent visits first
- **Size limiting**: Keeps only 20 most recent pages
- **Error resilience**: Handles localStorage errors gracefully

## Configuration

### Constants

```ts
const RECENT_PAGES_KEY = "nouvelle_recent_pages";  // localStorage key
const MAX_RECENT_PAGES = 20;                       // Maximum tracked pages
```

## Methods

### getRecentPages()

**Purpose**: Retrieve recently visited pages from localStorage

**Returns**: `RecentPageEntry[]` - Array sorted by most recent first

**Behavior**:
- Reads from localStorage
- Parses JSON safely with try/catch
- Sorts by `lastVisited` descending
- Returns empty array on error or missing data

**Error handling**: Catches and logs errors, returns `[]`

### trackPageVisit(pageId, title, icon?)

**Purpose**: Record a page visit

**Parameters**:
- `pageId` - Unique page identifier
- `title` - Page title (current, may have changed since last visit)
- `icon` - Optional page emoji icon

**Behavior**:
1. Get existing recent pages
2. Remove any existing entry for this page (deduplication)
3. Add new entry with current timestamp to front
4. Trim to MAX_RECENT_PAGES (20)
5. Save back to localStorage

**Side effects**: Writes to localStorage

**Error handling**: Catches and logs errors, no throw

### clearRecentPages()

**Purpose**: Remove all recent page history

**Use case**: Privacy, user preference, workspace switch

**Behavior**: Removes key from localStorage

**Error handling**: Catches and logs errors, no throw

## Data Structure

### localStorage Format

```json
[
  {
    "pageId": "page-123",
    "title": "Meeting Notes",
    "icon": "📝",
    "lastVisited": 1699999999999
  },
  {
    "pageId": "page-456",
    "title": "Project Plan",
    "icon": "📋",
    "lastVisited": 1699999888888
  }
]
```

**Sorted**: Always by `lastVisited` descending (most recent first)

**Max size**: 20 entries maximum

## Algorithm Details

### Deduplication Logic

```ts
// Remove existing entry for this page (if any)
const filtered = recentPages.filter(p => p.pageId !== pageId);

// Add new entry at the front
const updated = [
  { pageId, title, icon, lastVisited: now },
  ...filtered,
];
```

**Effect**: Visiting same page multiple times updates its position and timestamp, no duplicates

### Size Limiting

```ts
// Keep only the most recent MAX_RECENT_PAGES
const trimmed = updated.slice(0, MAX_RECENT_PAGES);
```

**Effect**: Oldest entries automatically removed when exceeding 20 pages

## Dependencies

None - vanilla JavaScript utilities

## Usage Examples

### Track Page Visit (in page component)

```tsx
import { trackPageVisit } from '@nouvelle/router';
import { useEffect } from 'react';

function PageView({ pageId, title, icon }: { pageId: string; title: string; icon?: string }) {
  useEffect(() => {
    // Track visit when page mounts
    trackPageVisit(pageId, title, icon);
  }, [pageId, title, icon]);

  return <div>{title}</div>;
}
```

### Display Recent Pages (in sidebar)

```tsx
import { getRecentPages } from '@nouvelle/router';
import { useState, useEffect } from 'react';

function RecentPagesList() {
  const [recentPages, setRecentPages] = useState(getRecentPages());

  useEffect(() => {
    // Update when localStorage changes (optional)
    const handleStorageChange = () => {
      setRecentPages(getRecentPages());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <ul>
      {recentPages.map(page => (
        <li key={page.pageId}>
          <Link to={`/page/${page.pageId}`}>
            {page.icon} {page.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

### Clear History (in settings)

```tsx
import { clearRecentPages } from '@nouvelle/router';

function PrivacySettings() {
  const handleClearHistory = () => {
    clearRecentPages();
    toast.success('Recent page history cleared');
  };

  return (
    <Button onClick={handleClearHistory} variant="outline">
      Clear Recent Pages
    </Button>
  );
}
```

### Format Timestamps (display relative time)

```tsx
import { getRecentPages } from '@nouvelle/router';

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function RecentWithTimestamps() {
  const pages = getRecentPages();

  return (
    <ul>
      {pages.map(page => (
        <li key={page.pageId}>
          {page.icon} {page.title}
          <span>{formatRelativeTime(page.lastVisited)}</span>
        </li>
      ))}
    </ul>
  );
}
```

## Performance Characteristics

- **Read operation**: O(n log n) due to sorting (n ≤ 20)
- **Write operation**: O(n) for filtering + O(1) for prepend + O(1) for slice
- **localStorage I/O**: Synchronous, blocks main thread briefly
- **Data size**: ~100-500 bytes per entry, max ~10KB total

## localStorage Limitations

### Storage Capacity

- **Quota**: 5-10MB per origin (browser dependent)
- **Recent pages usage**: ~10KB maximum (negligible)
- **Shared quota**: All localStorage data counts toward quota

### Synchronous API

- **Blocking**: localStorage operations block main thread
- **Impact**: Minimal for small data like recent pages
- **Mitigation**: Operations are fast (<1ms typically)

### Privacy Mode

- **Incognito/Private**: localStorage may be disabled or cleared on close
- **Error handling**: Catches errors, falls back to empty array
- **User impact**: Recent pages won't persist in private mode

## Error Handling

### Read Errors

```ts
try {
  const stored = localStorage.getItem(RECENT_PAGES_KEY);
  const pages = JSON.parse(stored);
  return pages.sort(...);
} catch (error) {
  console.error("Error reading recent pages from localStorage:", error);
  return [];  // Safe fallback
}
```

**Possible errors**:
- localStorage disabled (privacy mode, browser settings)
- Invalid JSON (corrupted data, manual editing)
- Storage quota exceeded (unlikely for reads)

### Write Errors

```ts
try {
  localStorage.setItem(RECENT_PAGES_KEY, JSON.stringify(trimmed));
} catch (error) {
  console.error("Error tracking page visit in localStorage:", error);
  // Silent failure - don't crash app for non-critical feature
}
```

**Possible errors**:
- Storage quota exceeded (unlikely with 20-item limit)
- localStorage disabled
- Security restrictions

## Cross-Tab Synchronization

### Current Behavior

- **No automatic sync**: Each tab maintains independent state
- **Manual sync**: Listen to storage events to detect changes from other tabs

### Implementing Sync

```tsx
useEffect(() => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'nouvelle_recent_pages') {
      // Another tab updated recent pages
      setRecentPages(getRecentPages());
    }
  };

  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

## Future Improvements

- **IndexedDB storage**: Better for larger datasets, non-blocking
- **Sync across devices**: Cloud sync of recent pages
- **Per-workspace history**: Separate recent pages per workspace
- **Visit frequency**: Track visit count for smart ordering
- **Search integration**: Boost recently viewed pages in search results
- **Time-based expiry**: Auto-remove pages not visited in X days
- **Category grouping**: Group by workspace, date, or page type
- **Analytics**: Track most frequently visited pages

## Workspace Integration

### Current Limitation

Recent pages are **global across all workspaces**. Switching workspaces shows pages from all workspaces.

### Potential Improvement

```ts
// Per-workspace tracking
const RECENT_PAGES_KEY = (workspaceId: string) => `nouvelle_recent_pages_${workspaceId}`;

export function getRecentPages(workspaceId: string): RecentPageEntry[] {
  // ...
}

export function trackPageVisit(workspaceId: string, pageId: string, title: string, icon?: string): void {
  // ...
}
```

## Related Files

- Used by: Page view components - Call `trackPageVisit` on mount
- Used by: Sidebar/navigation components - Call `getRecentPages` to display
- Independent of: No dependencies on other router modules

Last updated: 2025-11-12
