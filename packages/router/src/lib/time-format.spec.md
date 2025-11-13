# Module: lib/time-format.ts

Status: stable
Intent: Format Unix timestamps as human-readable relative time strings (e.g., "Edited 5 minutes ago") with proper pluralization.

## Exports

```ts
export function formatRelativeTime(timestamp: number | undefined): string;
```

## Purpose & Behavior

### Core Functionality

- **Relative time formatting**: Convert timestamps to "X time ago" format
- **Proper pluralization**: Handles singular/plural correctly (1 minute vs 2 minutes)
- **Multiple time units**: Seconds, minutes, hours, days, weeks, months, years
- **Graceful defaults**: Returns "Never edited" for undefined/null timestamps
- **Notion-inspired**: Mimics Notion's "Edited X ago" pattern

## Method

### formatRelativeTime(timestamp)

**Purpose**: Format Unix timestamp as relative time string

**Parameters**: `timestamp` - Unix timestamp in milliseconds (or undefined)

**Returns**: String with format "Edited X {unit} ago" or "Edited just now"

**Algorithm**:
1. If timestamp undefined/null, return "Never edited"
2. Calculate diff between now and timestamp
3. Convert to appropriate unit (seconds → years)
4. Return formatted string with proper pluralization

## Time Unit Ranges

| Time Range | Output Format | Example |
|------------|---------------|---------|
| < 60 seconds | "Edited just now" | - |
| 1-59 minutes | "Edited X minute(s) ago" | "Edited 5 minutes ago" |
| 1-23 hours | "Edited X hour(s) ago" | "Edited 2 hours ago" |
| 1-6 days | "Edited X day(s) ago" | "Edited 3 days ago" |
| 1-3 weeks | "Edited X week(s) ago" | "Edited 2 weeks ago" |
| 1-11 months | "Edited X month(s) ago" | "Edited 6 months ago" |
| 1+ years | "Edited X year(s) ago" | "Edited 2 years ago" |

## Pluralization Logic

```ts
`Edited ${count} ${count === 1 ? "minute" : "minutes"} ago`
```

**Singular**: 1 minute, 1 hour, 1 day, 1 week, 1 month, 1 year

**Plural**: 2+ minutes, hours, days, weeks, months, years

## Rounding Behavior

All units use **floor rounding** (rounds down):

```ts
Math.floor(89 seconds / 60) = 1 minute  // Not 1.48 minutes
Math.floor(25 hours / 24) = 1 day       // Not 1.04 days
```

**Effect**: "Edited 1 minute ago" covers 60-119 seconds

## Dependencies

None - vanilla JavaScript utilities

## Usage Examples

### Page Metadata Display

```tsx
import { formatRelativeTime } from '@nouvelle/router';

function PageMeta({ page }: { page: Page }) {
  return (
    <div>
      <p>{formatRelativeTime(page.updatedAt)}</p>
    </div>
  );
}

// Examples:
// updatedAt = Date.now() - 30000 → "Edited just now"
// updatedAt = Date.now() - 300000 → "Edited 5 minutes ago"
// updatedAt = Date.now() - 3600000 → "Edited 1 hour ago"
// updatedAt = undefined → "Never edited"
```

### Sidebar Recent Pages

```tsx
import { formatRelativeTime } from '@nouvelle/router';

function RecentPagesList({ pages }: { pages: Page[] }) {
  return (
    <ul>
      {pages.map(page => (
        <li key={page.id}>
          <span>{page.title}</span>
          <small>{formatRelativeTime(page.updatedAt)}</small>
        </li>
      ))}
    </ul>
  );
}
```

### Tooltip with Last Edit Time

```tsx
import { formatRelativeTime } from '@nouvelle/router';

function PageTooltip({ page }: { page: Page }) {
  return (
    <Tooltip>
      <TooltipTrigger>{page.title}</TooltipTrigger>
      <TooltipContent>
        <p>{formatRelativeTime(page.updatedAt)}</p>
        <p>By {page.lastEditedBy}</p>
      </TooltipContent>
    </Tooltip>
  );
}
```

### Activity Feed

```tsx
import { formatRelativeTime } from '@nouvelle/router';

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <div>
      <p>{activity.user} {activity.action} "{activity.pageName}"</p>
      <small>{formatRelativeTime(activity.timestamp)}</small>
    </div>
  );
}

// Example output:
// "John edited "Meeting Notes""
// "Edited 10 minutes ago"
```

### Dynamic Updates with useEffect

```tsx
import { formatRelativeTime } from '@nouvelle/router';
import { useState, useEffect } from 'react';

function LiveTimestamp({ timestamp }: { timestamp: number }) {
  const [relativeTime, setRelativeTime] = useState(() => formatRelativeTime(timestamp));

  useEffect(() => {
    // Update every minute for live timestamps
    const interval = setInterval(() => {
      setRelativeTime(formatRelativeTime(timestamp));
    }, 60000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return <span>{relativeTime}</span>;
}

// Updates from "Edited just now" → "Edited 1 minute ago" → "Edited 2 minutes ago"
```

## Time Calculation Details

### Conversion Factors

```ts
const diffSeconds = Math.floor(diffMs / 1000);        // ms → s
const diffMinutes = Math.floor(diffSeconds / 60);     // s → min
const diffHours = Math.floor(diffMinutes / 60);       // min → hr
const diffDays = Math.floor(diffHours / 24);          // hr → day
const diffWeeks = Math.floor(diffDays / 7);           // day → wk
const diffMonths = Math.floor(diffDays / 30);         // day → mo (approx)
const diffYears = Math.floor(diffDays / 365);         // day → yr (approx)
```

### Approximations

**Months**: Calculated as 30 days (not exact)
- Real months: 28-31 days
- This implementation: Always 30 days

**Years**: Calculated as 365 days (no leap years)
- Real years: 365-366 days
- This implementation: Always 365 days

**Impact**: Small inaccuracies for long time periods (months, years)

## Edge Cases

### Future Timestamps

```ts
formatRelativeTime(Date.now() + 10000)
// → "Edited just now" (negative diff treated as 0)
```

**No validation** for future timestamps - treated as current time

### Zero Timestamp

```ts
formatRelativeTime(0)
// → "Edited 55 years ago" (since Jan 1, 1970)
```

**Edge case**: Unix epoch appears as ~55+ years ago in 2025

### Very Old Timestamps

```ts
formatRelativeTime(1000000000)
// → "Edited 54 years ago"
```

**Max unit**: Years (no decades or centuries)

### Undefined/Null

```ts
formatRelativeTime(undefined)  // → "Never edited"
formatRelativeTime(null as any)  // → "Never edited"
```

**Safe defaults** for missing data

## Localization Considerations

### Current: English Only

All strings are hardcoded in English:
- "Edited just now"
- "Edited X minute(s) ago"
- "Never edited"

### Future: i18n Support

```ts
// Potential i18n structure
const translations = {
  en: { justNow: "Edited just now", neverEdited: "Never edited", ... },
  fr: { justNow: "Modifié à l'instant", neverEdited: "Jamais modifié", ... },
  es: { justNow: "Editado ahora mismo", neverEdited: "Nunca editado", ... },
};
```

## Performance Characteristics

- **Time complexity**: O(1) - simple arithmetic operations
- **Memory**: Minimal - creates single string, no allocations
- **Speed**: <1ms per call (pure calculation, no I/O)

## Comparison to Alternatives

### Built-in Intl.RelativeTimeFormat

```ts
// Standard approach
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
rtf.format(-5, 'minutes');  // → "5 minutes ago"
```

**Pros**: Native, localized, standard
**Cons**: Requires manual unit selection, more complex

**This implementation**: Simpler API, automatic unit selection, custom format

### Libraries (date-fns, dayjs, moment)

```ts
// date-fns
import { formatDistanceToNow } from 'date-fns';
formatDistanceToNow(timestamp, { addSuffix: true });  // → "5 minutes ago"
```

**Pros**: Battle-tested, localization support, timezone aware
**Cons**: External dependency, larger bundle size

**This implementation**: Zero dependencies, smaller bundle, custom format

## Future Improvements

- **i18n support**: Accept locale parameter for translations
- **Custom format strings**: Allow customization of output format
- **Precise month/year**: Use actual calendar calculations
- **Rounding strategies**: Options for floor/ceil/round
- **Future timestamp handling**: Detect and format "in X time" for future dates
- **Timezone awareness**: Consider user timezone for "today"/"yesterday"
- **Shorter formats**: "5m ago" instead of "Edited 5 minutes ago" option
- **Hover tooltips**: Return both relative and absolute time

## Related Files

- Used by: Page components, activity feeds, metadata displays
- Independent of: No dependencies on other router modules
- Similar to: Notion's timestamp formatting behavior

Last updated: 2025-11-12
