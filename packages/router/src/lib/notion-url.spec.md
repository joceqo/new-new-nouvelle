# Module: lib/notion-url.ts

Status: stable
Intent: Notion-inspired URL utilities for creating human-readable page URLs with IDs and extracting IDs from URL slugs.

## Exports

```ts
export function extractPageId(slug: string): string;
export function createPageSlug(title: string, id: string): string;
export function looksLikePageId(str: string): boolean;
```

## Purpose & Behavior

### Core Functionality

- **Notion-style URLs**: Support URLs like `/Getting-Started-abc123` (human-readable + ID)
- **ID extraction**: Parse page IDs from slugs or standalone IDs
- **Slug creation**: Generate SEO-friendly URLs from page titles and IDs
- **ID validation**: Heuristic check if string is a page ID

### URL Format

Notion supports two URL formats:

1. **ID only**: `/2b4b306eed8f440891cac95e1c903111`
2. **Slug + ID**: `/Getting-Started-29864713e0928051ac41db65ee505`

**Key rule**: ID is always after the last dash (or entire string if no dash)

## Methods

### extractPageId(slug)

**Purpose**: Extract page ID from Notion-style URL slug

**Algorithm**:
1. Find last dash in slug
2. If no dash found, return entire slug (it's just an ID)
3. Otherwise, return everything after last dash

**Examples**:
```ts
extractPageId("2b4b306eed8f440891cac95e1c903111")
// → "2b4b306eed8f440891cac95e1c903111"

extractPageId("Getting-Started-29864713e0928051ac41db65ee505")
// → "29864713e0928051ac41db65ee505"

extractPageId("My-Page-Title-abc123def456")
// → "abc123def456"

extractPageId("Some-Page-With-Dashes-xyz789")
// → "xyz789"
```

**Edge cases**:
- Empty string → "" (no validation)
- No dashes → returns entire string
- Multiple dashes → only last dash matters

### createPageSlug(title, id)

**Purpose**: Create Notion-style URL slug from page title and ID

**Algorithm**:
1. If no title, return just the ID
2. Convert title to slug:
   - Trim whitespace
   - Replace spaces with dashes
   - Remove special characters (keep only a-z, A-Z, 0-9, -)
   - Collapse multiple dashes to single dash
   - Remove leading/trailing dashes
3. Combine: `{titleSlug}-{id}`

**Examples**:
```ts
createPageSlug("Getting Started", "abc123")
// → "Getting-Started-abc123"

createPageSlug("My Page", "def456")
// → "My-Page-def456"

createPageSlug("", "abc123")
// → "abc123"

createPageSlug("  Spaces   Everywhere  ", "xyz")
// → "Spaces-Everywhere-xyz"

createPageSlug("Special@#$Characters!", "id123")
// → "SpecialCharacters-id123"

createPageSlug("Multiple---Dashes", "id456")
// → "Multiple-Dashes-id456"
```

**Edge cases**:
- Empty title → returns just ID
- Whitespace-only title → returns just ID
- Unicode characters → removed (ASCII only)
- Emojis in title → removed
- Numbers in title → preserved

### looksLikePageId(str)

**Purpose**: Heuristic check if string looks like a page ID

**Algorithm**: Returns true if string matches `/^[a-zA-Z0-9]{10,}$/`

**Criteria**:
- Only alphanumeric characters (a-z, A-Z, 0-9)
- At least 10 characters long
- No dashes, spaces, or special characters

**Examples**:
```ts
looksLikePageId("2b4b306eed8f440891cac95e1c903111")  // → true (32 chars)
looksLikePageId("abc123def456")                     // → true (12 chars)
looksLikePageId("short123")                         // → false (8 chars, < 10)
looksLikePageId("has-dashes-abc123")                // → false (contains dashes)
looksLikePageId("Getting-Started-abc123")           // → false (contains dashes)
looksLikePageId("")                                 // → false (empty)
```

**Use case**: Determine if URL param is just an ID or a slug+ID

## Dependencies

None - vanilla JavaScript utilities

## Usage Examples

### Route Parameter Parsing

```tsx
import { extractPageId } from '@nouvelle/router';

// In TanStack Router route
export const Route = createFileRoute('/page/$pageSlug')({
  loader: async ({ params }) => {
    const pageId = extractPageId(params.pageSlug);
    return fetchPage(pageId);
  },
});

// Works with both formats:
// /page/abc123 → pageId = "abc123"
// /page/My-Page-abc123 → pageId = "abc123"
```

### Creating Shareable Links

```tsx
import { createPageSlug } from '@nouvelle/router';

function ShareButton({ page }: { page: Page }) {
  const slug = createPageSlug(page.title, page.id);
  const url = `${window.location.origin}/page/${slug}`;

  const handleShare = () => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  };

  return <Button onClick={handleShare}>Share</Button>;
}

// Example output:
// page.title = "Meeting Notes", page.id = "abc123"
// → https://example.com/page/Meeting-Notes-abc123
```

### Navigation with Pretty URLs

```tsx
import { createPageSlug } from '@nouvelle/router';
import { useNavigate } from '@tanstack/react-router';

function PageLink({ page }: { page: Page }) {
  const navigate = useNavigate();
  const slug = createPageSlug(page.title, page.id);

  return (
    <button onClick={() => navigate({ to: `/page/${slug}` })}>
      {page.icon} {page.title}
    </button>
  );
}
```

### Route Guard with ID Validation

```tsx
import { extractPageId, looksLikePageId } from '@nouvelle/router';

export const Route = createFileRoute('/page/$pageSlug')({
  beforeLoad: ({ params }) => {
    const pageId = extractPageId(params.pageSlug);

    if (!looksLikePageId(pageId)) {
      throw new Error('Invalid page ID');
    }

    return { pageId };
  },
});
```

### URL Update on Title Change

```tsx
import { createPageSlug } from '@nouvelle/router';
import { useNavigate, useParams } from '@tanstack/react-router';

function PageEditor({ page }: { page: Page }) {
  const navigate = useNavigate();
  const params = useParams({ from: '/page/$pageSlug' });

  const handleTitleChange = (newTitle: string) => {
    updatePage(page.id, { title: newTitle });

    // Update URL to reflect new title
    const newSlug = createPageSlug(newTitle, page.id);
    if (newSlug !== params.pageSlug) {
      navigate({
        to: `/page/${newSlug}`,
        replace: true  // Don't add to history
      });
    }
  };

  return <input value={page.title} onChange={e => handleTitleChange(e.target.value)} />;
}
```

## Performance Characteristics

- **extractPageId**: O(n) for finding last dash in string
- **createPageSlug**: O(n) for regex replacements on title
- **looksLikePageId**: O(n) for regex test
- **Memory**: Minimal, creates new strings but no large allocations

## SEO Benefits

### Human-Readable URLs

```
❌ Bad:  /page/2b4b306eed8f440891cac95e1c903111
✅ Good: /page/Getting-Started-Guide-2b4b306eed8f440891cac95e1c903111
```

**Benefits**:
- Users can see page topic in URL
- Search engines index page title in URL
- Shareable links are more descriptive
- Browser history is more readable

### URL Stability

**ID remains constant** even if title changes:
- Old bookmarks still work
- Shared links never break
- Search engine rankings preserved
- Only the human-readable part changes

## Edge Cases & Limitations

### Special Characters in Titles

```ts
createPageSlug("Émojis 🎉 & Special™ Chars", "abc")
// → "mojis-Special-Chars-abc"
// Note: Unicode and emojis removed
```

**Limitation**: Non-ASCII characters are stripped

**Workaround**: Keep important info in ASCII, or accept romanization

### Title Collisions

```ts
createPageSlug("My Page", "id1")  // → "My-Page-id1"
createPageSlug("My Page", "id2")  // → "My-Page-id2"
```

**ID ensures uniqueness** even with identical titles

### Very Long Titles

```ts
const longTitle = "A".repeat(200);
createPageSlug(longTitle, "abc");
// → "A-A-A-A-...-abc" (very long URL)
```

**No length limit** on slug generation

**Consider**: Add max length truncation if needed

### Empty or Whitespace Titles

```ts
createPageSlug("", "abc123")          // → "abc123"
createPageSlug("   ", "abc123")       // → "abc123"
createPageSlug("   \n\t  ", "abc123") // → "abc123"
```

**Graceful fallback** to ID-only format

## Future Improvements

- **Length limiting**: Truncate very long title slugs (e.g., max 50 chars)
- **Unicode support**: Preserve international characters with proper encoding
- **Custom separators**: Support _ or other separators besides -
- **Slug uniqueness check**: Ensure generated slug doesn't conflict
- **Case preservation**: Option to preserve original casing
- **Stop word removal**: Remove common words (the, a, an) for cleaner URLs
- **Automatic redirects**: Redirect old slugs to new slugs when title changes

## Comparison to Notion

### Similarities

- ID always at end after last dash
- Human-readable title slugs
- Works with ID-only or slug+ID format

### Differences

- **Notion**: Uses base62-encoded UUIDs (32 chars, no hyphens)
- **This implementation**: Accepts any alphanumeric ID format
- **Notion**: May preserve some Unicode characters
- **This implementation**: Strips all non-ASCII characters

## Related Files

- Used by: Route loaders, page navigation components
- Used by: Share link generation, URL building utilities
- Independent of: No dependencies on other router modules

Last updated: 2025-11-12
