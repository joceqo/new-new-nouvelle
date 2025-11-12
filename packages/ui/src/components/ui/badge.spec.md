# Component: Badge

Status: stable  
Intent: Small status indicator component with semantic color variants for displaying labels, states, counts, and categories.

## Props Contract

```ts
import { VariantProps } from "class-variance-authority";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

// Variant configuration
const badgeVariants = cva(
  // Base classes: layout, typography, focus states
  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```

## Behavior Rules

- **Inline display**: Uses `inline-flex` for inline text flow integration
- **Non-interactive by default**: Renders as `<div>` without click handlers
- **Focus support**: Includes focus ring styles if badge becomes focusable
- **Hover transitions**: All variants include hover state changes with smooth transitions
- **Semantic variants**: Color variants communicate meaning (success, warning, error, info)

## Visual & Styling

### Base Styles

- **Layout**: `inline-flex items-center` for horizontal content alignment
- **Shape**: `rounded-md` corners for modern appearance
- **Typography**: `text-xs font-semibold` (12px, semibold weight)
- **Spacing**: `px-2 py-0.5` (8px horizontal, 2px vertical padding)
- **Border**: `border` with variant-specific colors
- **Transitions**: `transition-colors` for smooth hover effects

### Variants

#### Default

- **Background**: `bg-primary` with `text-primary-foreground`
- **Border**: `border-transparent` (no visible border)
- **Shadow**: `shadow` for subtle elevation
- **Hover**: `hover:bg-primary/80` (20% opacity reduction)

#### Secondary

- **Background**: `bg-secondary` with `text-secondary-foreground`
- **Border**: `border-transparent`
- **Hover**: `hover:bg-secondary/80`

#### Destructive

- **Background**: `bg-destructive` with `text-destructive-foreground`
- **Border**: `border-transparent`
- **Shadow**: `shadow` for emphasis
- **Hover**: `hover:bg-destructive/80`

#### Outline

- **Background**: Transparent (uses default border)
- **Text**: `text-foreground` (inherits theme text color)
- **Border**: Uses default border color

#### Success

- **Background**: `bg-green-100` with `text-green-800`
- **Border**: `border-transparent`
- **Hover**: `hover:bg-green-100/80`

#### Warning

- **Background**: `bg-yellow-100` with `text-yellow-800`
- **Border**: `border-transparent`
- **Hover**: `hover:bg-yellow-100/80`

#### Info

- **Background**: `bg-blue-100` with `text-blue-800`
- **Border**: `border-transparent`
- **Hover**: `hover:bg-blue-100/80`

## Accessibility

- **Color contrast**: All variants meet WCAG contrast requirements
- **Focus indicators**: Built-in focus ring for keyboard navigation
- **Semantic meaning**: Variant names correspond to semantic states
- **Screen readers**: Badge content is announced as regular text
- **Non-interactive default**: No keyboard navigation unless made focusable

## Dependencies

- `class-variance-authority` - Variant management and TypeScript inference
- `@/lib/utils` - cn() utility for className merging
- `React` - Component framework and forwardRef

## Edge Cases

- **Long text**: Text may wrap or overflow in small containers
- **Empty content**: Badge renders but may appear as empty colored rectangle
- **Interactive badges**: Can be made clickable by adding onClick handlers
- **Custom colors**: User can override variants with custom className
- **Icon integration**: Icons can be included as children alongside text

## Usage Examples

### Basic Status Badges

```tsx
import { Badge } from "@/components/ui/badge";

{/* Default primary badge */}
<Badge>New</Badge>

{/* Semantic status badges */}
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="info">Beta</Badge>
```

### Count and Category Badges

```tsx
{/* Count indicators */}
<Badge variant="secondary">12</Badge>
<Badge variant="outline">99+</Badge>

{/* Category labels */}
<Badge variant="info">Frontend</Badge>
<Badge variant="success">Backend</Badge>
<Badge variant="warning">Design</Badge>
```

### Interactive Badges (as buttons)

```tsx
<Badge
  variant="outline"
  className="cursor-pointer hover:bg-accent"
  onClick={() => handleTagClick("react")}
  role="button"
  tabIndex={0}
>
  React
</Badge>
```

### Badges with Icons

```tsx
import { Check, AlertTriangle, X } from "lucide-react";

<Badge variant="success">
  <Check className="mr-1 h-3 w-3" />
  Completed
</Badge>

<Badge variant="warning">
  <AlertTriangle className="mr-1 h-3 w-3" />
  Warning
</Badge>

<Badge variant="destructive">
  <X className="mr-1 h-3 w-3" />
  Failed
</Badge>
```

### Custom Styled Badges

```tsx
{
  /* Custom color badge */
}
<Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">
  Custom
</Badge>;

{
  /* Larger badge */
}
<Badge className="px-3 py-1 text-sm">Large Badge</Badge>;

{
  /* Rounded pill badge */
}
<Badge className="rounded-full">Pill Shape</Badge>;
```

### Notification Badges

```tsx
{
  /* Notification count on button */
}
<div className="relative">
  <Button variant="ghost" size="icon">
    <Bell className="h-4 w-4" />
  </Button>
  <Badge
    variant="destructive"
    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-xs"
  >
    3
  </Badge>
</div>;
```

## Performance Notes

- **CVA optimization**: Variant classes computed at build time
- **Bundle size**: ~0.5KB including CVA utilities
- **Re-renders**: Only when props change (React.forwardRef optimized)
- **CSS classes**: All styling via pre-built CSS classes (no runtime computation)

## Testing Strategy

- **Variant rendering**: Verify correct classes applied for each variant
- **Content display**: Test text, numbers, and icon content
- **Hover states**: Interactive feedback on hover
- **Focus behavior**: Keyboard navigation when focusable
- **Accessibility**: Color contrast and screen reader announcements
- **Custom styling**: className override behavior

## Future Improvements

- **Size variants**: xs, sm, default, lg size options
- **Removable badges**: X button for dismissible badges
- **Dot variant**: Small circular indicator without text
- **Animation presets**: Pulse, bounce effects for notifications
- **Theme integration**: Use CSS custom properties instead of hardcoded colors
- **Icon positioning**: Built-in left/right icon slots
- **Truncation**: Automatic ellipsis for long badge text

## Accessibility Guidelines

- **Meaningful text**: Badge text should describe the status or category clearly
- **Color + text**: Don't rely on color alone to convey meaning
- **Interactive feedback**: Add proper ARIA attributes if badges are interactive
- **Focus management**: Ensure focusable badges have visible focus indicators
- **Screen reader context**: Consider adding `aria-label` for icon-only badges
- **Keyboard support**: Add keyboard event handlers for interactive badges

## Dependencies Map

```
badge.tsx
├── class-variance-authority (external)
├── @/lib/utils
└── React (peer)

Used by:
- Status indicators
- Notification counts
- Category tags
- Form validation
- Table cells
- Navigation labels
- Progress indicators
```

## Semantic Color Mapping

```tsx
// Status indicators
<Badge variant="success">   // Green - positive states, completed actions
<Badge variant="warning">   // Yellow - caution, pending states
<Badge variant="destructive"> // Red - errors, dangerous actions
<Badge variant="info">      // Blue - informational, neutral updates

// Hierarchy
<Badge variant="default">   // Primary theme color - high priority
<Badge variant="secondary"> // Muted theme color - lower priority
<Badge variant="outline">   // Minimal styling - subtle indicators
```

## CSS Framework Compatibility

- **Tailwind CSS**: Uses standard Tailwind color classes
- **Theme variables**: Some variants use CSS custom properties (primary, secondary, destructive)
- **Override friendly**: Custom classes can easily override variant styles
- **Responsive**: Can be made responsive with Tailwind responsive prefixes

## Breaking Changes Policy

- **Major version**: Changes to variant names, color schemes, or default behavior
- **Minor version**: New variants, size options (backward compatible)
- **Patch version**: Bug fixes, accessibility improvements, color adjustments

Last updated: 2025-11-12
