# Component: Alert + AlertTitle + AlertDescription

Status: stable  
Intent: Notion-inspired alert component for displaying contextual messages with semantic color variants using theme palette tokens and opacity modifiers.

## Props Contract

```ts
import { VariantProps } from "class-variance-authority";

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  variant?: "default" | "destructive" | "success" | "warning" | "info";
}

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
```

## Component Structure

```tsx
<Alert variant="info">
  <InfoIcon />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the CLI.
  </AlertDescription>
</Alert>
```

## Behavior Rules

- **ARIA role**: Automatically includes `role="alert"` for screen readers
- **Icon positioning**: SVG icons automatically positioned at top-left
- **Content offset**: Text content indented when icon present
- **Semantic variants**: Each variant uses appropriate theme palette colors
- **Composable**: Title and description are optional subcomponents

## Visual & Styling

### Base Layout

- **Container**: 
  - Width: `w-full` (full-width responsive)
  - Shape: `rounded-lg` with `border`
  - Padding: `px-4 py-3` (16px horizontal, 12px vertical)
  - Typography: `text-sm`

- **Icon positioning**:
  - Position: `[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4`
  - Alignment: `[&>svg+div]:translate-y-[-3px]` (slight upward shift)
  - Content offset: `[&>svg~*]:pl-7` (28px left padding when icon present)

### Variants

#### default
- Background: `bg-[var(--color-bg-base)]`
- Border: `border-[var(--color-border-subtle)]`
- Text: `text-[var(--color-text-primary)]`
- Icon: `[&>svg]:text-[var(--color-icon-default)]`

#### destructive (Errors, Critical Issues)
- Background: `bg-[var(--palette-red-bg)]`
- Border: `border-[var(--palette-red-text)]/20` (20% opacity)
- Text: `text-[var(--palette-red-text)]`
- Icon: `[&>svg]:text-[var(--palette-red-text)]`

#### success (Confirmations, Completions)
- Background: `bg-[var(--palette-green-bg)]`
- Border: `border-[var(--palette-green-text)]/20` (20% opacity)
- Text: `text-[var(--palette-green-text)]`
- Icon: `[&>svg]:text-[var(--palette-green-text)]`

#### warning (Cautions, Important Info)
- Background: `bg-[var(--palette-yellow-bg)]`
- Border: `border-[var(--palette-yellow-text)]/20` (20% opacity)
- Text: `text-[var(--palette-yellow-text)]`
- Icon: `[&>svg]:text-[var(--palette-yellow-text)]`

#### info (Notifications, Helpful Tips)
- Background: `bg-[var(--palette-blue-bg)]`
- Border: `border-[var(--palette-blue-text)]/20` (20% opacity)
- Text: `text-[var(--palette-blue-text)]`
- Icon: `[&>svg]:text-[var(--palette-blue-text)]`

### AlertTitle

- **Element**: `<h5>` for semantic heading hierarchy
- **Typography**: `text-sm font-semibold leading-none tracking-tight`
- **Spacing**: `mb-1` (4px below title)

### AlertDescription

- **Element**: `<div>` to allow paragraph children
- **Typography**: `text-sm`
- **Paragraph spacing**: `[&_p]:leading-relaxed`

## Theme Integration

### Color Palette (Light Mode)

```css
/* Red (Destructive) */
--palette-red-text: #C4554D;
--palette-red-bg: #FAECEC;

/* Green (Success) */
--palette-green-text: #548164;
--palette-green-bg: #EEF3ED;

/* Yellow (Warning) */
--palette-yellow-text: #C29343;
--palette-yellow-bg: #FAF3DD;

/* Blue (Info) */
--palette-blue-text: #487CA5;
--palette-blue-bg: #E9F3F7;
```

### Color Palette (Dark Mode)

```css
/* Red (Destructive) */
--palette-red-text: #BE524B;
--palette-red-bg: #332523;

/* Green (Success) */
--palette-green-text: #4F9768;
--palette-green-bg: #242B26;

/* Yellow (Warning) */
--palette-yellow-text: #C19138;
--palette-yellow-bg: #372E20;

/* Blue (Info) */
--palette-blue-text: #447ACB;
--palette-blue-bg: #1F282D;
```

### Opacity Pattern

Borders use Tailwind opacity modifier for subtle edge definition:
```tsx
border-[var(--palette-red-text)]/20  // 20% opacity border
```

This creates a softer border that matches the background color family.

## Accessibility

- **ARIA role**: `role="alert"` announces to screen readers
- **Semantic heading**: AlertTitle uses `<h5>` for document outline
- **Color + text**: Never relies on color alone (includes icon + text)
- **Color contrast**: All variants meet WCAG AA standards
- **Focus management**: No focus trap (alert is informational)
- **Screen reader flow**: Icon → Title → Description

## Dependencies

- `class-variance-authority` - Type-safe variant management
- `@/lib/utils` - cn() utility for className merging
- `React` - Component framework and forwardRef

## Edge Cases

- **Icon omission**: Layout adjusts gracefully without icon (no left padding)
- **Title-only alerts**: Description is optional
- **Long content**: Alert expands vertically to fit content
- **Multiple paragraphs**: AlertDescription supports nested `<p>` elements
- **Custom icons**: Any SVG can be used with automatic positioning
- **Theme switching**: Colors update smoothly on theme change

## Usage Examples

### Basic Alert with Icon

```tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

<Alert variant="info">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the CLI.
  </AlertDescription>
</Alert>
```

### Destructive Alert (Error)

```tsx
import { AlertTriangle } from "lucide-react";

<Alert variant="destructive">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please log in again.
  </AlertDescription>
</Alert>
```

### Success Alert (Confirmation)

```tsx
import { CheckCircle } from "lucide-react";

<Alert variant="success">
  <CheckCircle className="h-4 w-4" />
  <AlertTitle>Success</AlertTitle>
  <AlertDescription>
    Your changes have been saved successfully.
  </AlertDescription>
</Alert>
```

### Warning Alert (Caution)

```tsx
import { AlertTriangle } from "lucide-react";

<Alert variant="warning">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>
    This action cannot be undone. Please proceed with caution.
  </AlertDescription>
</Alert>
```

### Alert Without Icon

```tsx
<Alert variant="default">
  <AlertDescription>
    This is a simple alert without an icon.
  </AlertDescription>
</Alert>
```

### Alert with Multiple Paragraphs

```tsx
<Alert variant="info">
  <AlertDescription>
    <p>First paragraph with important information.</p>
    <p>Second paragraph with additional context.</p>
  </AlertDescription>
</Alert>
```

## Performance Notes

- **Static class generation**: Variants compiled at build time
- **No JavaScript interaction**: Pure CSS positioning
- **Theme-aware**: Respects CSS custom properties for instant theme switching
- **Minimal re-renders**: Stateless component

## Testing Strategy

- **Variant rendering**: Verify correct colors for each semantic variant
- **Icon positioning**: Test with various icon sizes
- **Content flow**: Test with/without icon, title, and description
- **ARIA semantics**: Verify `role="alert"` present
- **Theme switching**: Validate colors update correctly
- **Overflow handling**: Test with very long content

## Future Improvements

- **Dismissible alerts**: Add close button with onDismiss callback
- **Action buttons**: Built-in support for alert actions
- **Animation**: Entrance/exit animations
- **Stacking**: Support for multiple simultaneous alerts
- **Position variants**: Top/bottom banner styles

## Design Patterns

### When to Use Each Variant

- **default**: General information, neutral messages
- **destructive**: Errors, failed operations, critical issues
- **success**: Completed actions, confirmations, achievements
- **warning**: Cautionary messages, potential issues, important reminders
- **info**: Helpful tips, informational messages, feature highlights

### Alert vs Toast

- **Alert**: In-line, persistent, part of page flow
- **Toast**: Overlay, temporary, appears on top of content
- Use **Alert** for: Form validation, persistent warnings, important context
- Use **Toast** for: Action confirmations, transient notifications

## Best Practices

1. **Keep title concise** - 2-5 words maximum
2. **Be specific in description** - Provide actionable information
3. **Match icon to variant** - Use appropriate Lucide icons
4. **Limit alert density** - One alert per section maximum
5. **Place contextually** - Near related content or actions
6. **Don't overuse destructive** - Reserve for actual errors
7. **Test both themes** - Ensure readability in light and dark modes

Last updated: 2025-11-12
