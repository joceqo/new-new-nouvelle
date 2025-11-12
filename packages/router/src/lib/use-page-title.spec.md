# Module: lib/use-page-title.tsx

Status: stable
Intent: React hook for managing browser document title with Notion-style emoji icons and automatic cleanup on unmount.

## Exports

```ts
export function usePageTitle(options: UsePageTitleOptions): void;

interface UsePageTitleOptions {
  title?: string;
  icon?: string;
  suffix?: string;
}
```

## Purpose & Behavior

### Core Functionality

- **Dynamic document title**: Update `document.title` based on page content
- **Icon support**: Prepend emoji or icon to title (Notion-style)
- **Suffix support**: Append workspace/app name to title
- **Automatic cleanup**: Reset to default title on unmount
- **Reactive updates**: Re-runs when title, icon, or suffix changes

### Title Format

```
{icon} {title} - {suffix}
```

**Examples**:
- Icon + Title: `"📝 Meeting Notes"`
- Title + Suffix: `"Home - My Workspace"`
- Full: `"📝 Meeting Notes - My Workspace"`
- Icon only: `"📝"`
- Default: `"Nouvelle"`

## Hook Signature

### usePageTitle(options)

**Parameters**:
- `title` - Main page title text (optional)
- `icon` - Emoji or icon to prepend (optional)
- `suffix` - Text to append after separator (optional)

**Returns**: `void` (side effect only)

**Behavior**:
1. Builds title from parts: `{icon} {title} - {suffix}`
2. Sets `document.title` to built string
3. Falls back to "Nouvelle" if no parts provided
4. On unmount, resets to "Nouvelle"

## Title Building Logic

### Step-by-Step

```ts
const parts: string[] = [];

// 1. Add icon if provided
if (icon) parts.push(icon);  // ["📝"]

// 2. Add title if provided
if (title) parts.push(title);  // ["📝", "Meeting Notes"]

// 3. Join icon and title with space
let fullTitle = parts.join(" ");  // "📝 Meeting Notes"

// 4. Add suffix with separator if provided
if (suffix) {
  fullTitle = fullTitle ? `${fullTitle} - ${suffix}` : suffix;
}
// "📝 Meeting Notes - My Workspace"

// 5. Set title (or default)
document.title = fullTitle || "Nouvelle";
```

## Dependencies

- `react` - useEffect hook

## Usage Examples

### Basic Page Title

```tsx
import { usePageTitle } from '@nouvelle/router';

function HomePage() {
  usePageTitle({ title: "Home" });
  // document.title = "Home"

  return <div>Welcome</div>;
}
```

### With Icon (Notion-style)

```tsx
import { usePageTitle } from '@nouvelle/router';

function MeetingNotesPage() {
  usePageTitle({
    title: "Meeting Notes",
    icon: "📝"
  });
  // document.title = "📝 Meeting Notes"

  return <div>...</div>;
}
```

### With Workspace Suffix

```tsx
import { usePageTitle } from '@nouvelle/router';
import { useWorkspace } from '@nouvelle/router';

function PageView({ page }: { page: Page }) {
  const { activeWorkspace } = useWorkspace();

  usePageTitle({
    title: page.title,
    icon: page.icon,
    suffix: activeWorkspace?.name
  });
  // document.title = "📄 Project Plan - My Workspace"

  return <div>...</div>;
}
```

### Dynamic Title Updates

```tsx
import { usePageTitle } from '@nouvelle/router';
import { useState } from 'react';

function EditablePage() {
  const [title, setTitle] = useState("Untitled");
  const [icon, setIcon] = useState("📄");

  usePageTitle({ title, icon });
  // Updates document.title whenever title or icon changes

  return (
    <div>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <input value={icon} onChange={e => setIcon(e.target.value)} />
    </div>
  );
}
```

### Route-Level Title

```tsx
import { usePageTitle } from '@nouvelle/router';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  usePageTitle({ title: "Settings", icon: "⚙️" });

  return <div>Settings content...</div>;
}
```

### Conditional Title

```tsx
import { usePageTitle } from '@nouvelle/router';

function PageEditor({ page, isLoading }: { page?: Page; isLoading: boolean }) {
  usePageTitle({
    title: isLoading ? "Loading..." : (page?.title || "Untitled"),
    icon: page?.icon
  });

  if (isLoading) return <Spinner />;
  return <div>{page?.title}</div>;
}
```

## Behavior Details

### Cleanup on Unmount

```tsx
// On component unmount
return () => {
  document.title = "Nouvelle";
};
```

**Effect**: When navigating away from page, title resets to default

**Use case**: Prevents stale titles when navigating quickly

### Dependency Array

```ts
useEffect(() => {
  // ... title logic
}, [title, icon, suffix]);
```

**Triggers**: Hook re-runs whenever `title`, `icon`, or `suffix` changes

**Optimization**: Only updates when necessary (no constant re-renders)

### Empty Values

```ts
usePageTitle({ title: "" });  // → "Nouvelle"
usePageTitle({ icon: "" });  // → "Nouvelle"
usePageTitle({});  // → "Nouvelle"
```

**Fallback**: Empty or missing values default to "Nouvelle"

### Whitespace Handling

```ts
usePageTitle({ title: "  " });  // → "   " (preserved)
usePageTitle({ title: "  My Page  " });  // → "  My Page  " (preserved)
```

**No trimming**: Whitespace is preserved in title

## Title Format Examples

| Input | Output |
|-------|--------|
| `{ title: "Home" }` | `"Home"` |
| `{ icon: "🏠" }` | `"🏠"` |
| `{ title: "Home", icon: "🏠" }` | `"🏠 Home"` |
| `{ title: "Home", suffix: "App" }` | `"Home - App"` |
| `{ icon: "🏠", title: "Home", suffix: "App" }` | `"🏠 Home - App"` |
| `{ suffix: "App" }` | `"App"` |
| `{}` | `"Nouvelle"` |

## Browser Tab Behavior

### Favicon + Title

```html
<link rel="icon" href="/favicon.ico" />
```

**Combined effect**: Browser tab shows favicon + document title

**Example tab**: `[📝] 📝 Meeting Notes - My Workspace`

**Note**: Emoji in title separate from favicon

### Tab Truncation

Long titles are truncated by browser:

```
Full: "📝 Very Long Meeting Notes About Q4 Planning - My Workspace"
Tab:  "📝 Very Long Meeting ..."
```

**Recommendation**: Keep titles concise for better tab UX

### Multiple Tabs

Each tab maintains its own `document.title`:

- Tab 1: `"📝 Meeting Notes"`
- Tab 2: `"📊 Dashboard"`
- Tab 3: `"⚙️ Settings"`

## SEO Considerations

### Title Tag = document.title

```html
<title>📝 Meeting Notes - My Workspace</title>
```

**SEO impact**:
- Search engines index this title
- Shown in search results
- Important for page discovery

### Best Practices

- **Length**: 50-60 characters for Google (including emojis)
- **Keywords**: Front-load important keywords
- **Branding**: Include app/workspace name in suffix
- **Uniqueness**: Each page should have unique title

### Emoji in SEO

**Pros**: Eye-catching in search results, improves CTR
**Cons**: Not all search engines display emojis correctly

**Recommendation**: Use emojis for app UX, but don't rely on them for SEO

## Accessibility

### Screen Readers

Screen readers announce `document.title` when page loads:

```
"📝 Meeting Notes - My Workspace"
```

**Emoji handling**: Most screen readers skip or announce emoji names

**Best practice**: Don't rely on emoji for critical information

## Performance Characteristics

- **Render impact**: None (side effect only, doesn't cause re-renders)
- **DOM operations**: Single `document.title` assignment per update
- **Memory**: Minimal - no state, just effect cleanup
- **Bundle size**: <0.5KB

## Known Limitations

### SSR/Static Generation

```tsx
usePageTitle({ title: "Home" });
// ⚠️ document is undefined during SSR
```

**Issue**: `document` doesn't exist on server

**Current**: No SSR handling (runtime error if executed on server)

**Workaround**: Ensure hook only runs on client (useEffect prevents this)

### Multiple usePageTitle Calls

```tsx
function App() {
  usePageTitle({ title: "App" });

  return (
    <Child />  // Also calls usePageTitle
  );
}
```

**Behavior**: Last call wins (child overwrites parent)

**Recommendation**: Only use hook once per route/page component

## Future Improvements

- **Template support**: `usePageTitle({ template: "{icon} {title} | {app}" })`
- **SSR support**: Use `<title>` tag in head for SSR compatibility
- **Title history**: Track previous titles for breadcrumb navigation
- **Debouncing**: Debounce rapid title changes for performance
- **Transition announcements**: Announce page changes to screen readers
- **Meta description sync**: Update meta description alongside title
- **Analytics integration**: Track page views with title changes

## Alternative Approaches

### React Helmet

```tsx
import { Helmet } from 'react-helmet';

function Page() {
  return (
    <Helmet>
      <title>📝 Meeting Notes</title>
    </Helmet>
  );
}
```

**Pros**: SSR support, manages other head tags
**Cons**: External dependency, more complex

### TanStack Router Meta

```tsx
export const Route = createFileRoute('/page')({
  meta: () => [{ title: 'My Page' }]
});
```

**Pros**: Declarative, router-integrated
**Cons**: Less dynamic, no icon support

**This hook**: Simple, dynamic, custom format support

## Related Files

- Used by: All page components that need custom titles
- Independent of: No dependencies on other router modules
- Complements: Browser tab UX, SEO optimization

Last updated: 2025-11-12
