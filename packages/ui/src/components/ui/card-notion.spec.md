# Component: Card (Notion-style) + CardHeader, CardTitle, CardDescription, CardContent, CardFooter

Status: stable  
Intent: Notion-inspired card component system demonstrating advanced theme integration with CSS custom properties, transparency patterns, and variant-based styling for flexible, consistent card layouts.

## Props Contract

```ts
import { VariantProps } from "class-variance-authority";

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  variant?: "default" | "elevated" | "ghost" | "accent-blue" | "accent-purple" | "accent-green";
  padding?: "none" | "sm" | "default" | "lg";
  interactive?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
}

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  emphasis?: "high" | "medium" | "low";
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
```

## Component Structure

```tsx
<Card variant="default" padding="default" interactive>
  <CardHeader icon={<Icon />}>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <CardDescription emphasis="medium">
      Card description with configurable emphasis
    </CardDescription>
  </CardContent>
  <CardFooter>Actions appear on hover</CardFooter>
</Card>
```

## Behavior Rules

- **Variant-based styling**: Uses class-variance-authority for type-safe variant management
- **Interactive mode**: Adds cursor pointer when `interactive={true}`
- **Hover actions**: CardFooter uses Notion pattern (opacity-0 → group-hover:opacity-100)
- **Theme integration**: All colors reference CSS custom properties
- **Modular composition**: Each subcomponent is optional and independently usable
- **Group-based interactions**: Parent card controls child hover states via `group` class

## Visual & Styling

### Card Variants

- **default**: Subtle border, hover background + shadow
  - Border: `border-[var(--color-border-subtle)]`
  - Background: `bg-[var(--color-bg-base)]`
  - Hover: `hover:bg-[var(--color-bg-hover)] hover:shadow-sm`
  
- **elevated**: Enhanced shadow for modals/popovers
  - Border: `border-[var(--color-border)]`
  - Shadow: `shadow-md shadow-[var(--color-shadow-md)]`
  
- **ghost**: Transparent with hover effect only
  - Background: `bg-transparent`
  - Hover: `hover:bg-[var(--color-hover-subtle)]`
  
- **accent-blue/purple/green**: Colored backgrounds with opacity
  - Border: `border-[var(--color-accent-{color}-bg)]`
  - Background: `bg-[var(--color-accent-{color}-bg)]/20`
  - Hover: `hover:bg-[var(--color-accent-{color}-bg)]/30`
  - **Note**: Uses Tailwind opacity modifier syntax (e.g., `/20` = 20% opacity)

### Padding Variants

- **none**: `p-0` - No padding (for full-width content)
- **sm**: `p-3` - Compact spacing (12px)
- **default**: `p-4` - Standard spacing (16px)
- **lg**: `p-6` - Generous spacing (24px)

### Theme Integration

#### Color System

Uses three methods for transparency:

1. **Pre-defined transparency variables** (best performance):
   - `--color-hover-subtle` (4% opacity)
   - `--color-hover-medium` (8% opacity)
   - `--color-hover-strong` (12% opacity)

2. **Tailwind opacity modifiers** (flexible):
   - `bg-[var(--color-accent-blue-bg)]/20` (20% opacity)
   - `bg-[var(--color-accent-blue-bg)]/30` (30% opacity)

3. **Direct RGBA variables**:
   - `--color-border-alpha-10` (10% opacity)
   - `--color-border-alpha-20` (20% opacity)

#### Typography

- **CardTitle**: `text-sm font-semibold leading-none tracking-tight`
  - Color: `text-[var(--color-text-primary)]`
  
- **CardDescription**: `text-sm leading-relaxed`
  - High emphasis: `text-[var(--color-text-emphasis-high)]`
  - Medium emphasis: `text-[var(--color-text-emphasis-medium)]` (70% opacity)
  - Low emphasis: `text-[var(--color-text-emphasis-low)]` (50% opacity)

### CardHeader

- **Layout**: `flex items-start gap-3 mb-2`
- **Icon container**: 
  - Size: `w-8 h-8`
  - Background: `bg-[var(--color-bg-muted)]`
  - Shape: `rounded`
  - Layout: `flex items-center justify-center`
- **Content area**: `flex-1 min-w-0` (for text truncation)

### CardFooter (Notion Pattern)

- **Hidden by default**: `opacity-0`
- **Reveals on hover**: `group-hover:opacity-100`
- **Smooth transition**: `transition-opacity duration-200`
- **Divider**: `border-t border-[var(--color-divider)]`
- **Spacing**: `mt-3 pt-3` for separation from content

## Accessibility

- **Semantic HTML**: CardTitle renders as `<h3>` for heading hierarchy
- **High contrast mode**: Supports `emphasis="high"` for better readability
- **Focus indicators**: Interactive cards show focus states
- **Keyboard navigation**: Standard tab order through card elements
- **Screen readers**: Proper heading structure and descriptive content
- **Color contrast**: Theme colors meet WCAG AA guidelines
- **Hover alternatives**: Important actions should not rely solely on hover

## Dependencies

- `class-variance-authority` - Type-safe variant management
- `@/lib/utils` - cn() utility for className merging
- `React` - Component framework and forwardRef

## Edge Cases

- **Long text in CardTitle**: Uses `leading-none tracking-tight` for compact display
- **Truncation**: CardHeader content area uses `min-w-0` to enable ellipsis
- **Empty icon**: Header adjusts layout when icon is omitted
- **Nested cards**: Visual hierarchy maintained through variant selection
- **Custom opacity values**: Can use any Tailwind opacity modifier (`/10`, `/50`, `/75`, etc.)
- **Theme transitions**: Smooth color changes when theme switches (light ↔ dark)

## Usage Examples

### Basic Notion Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card-notion";

<Card>
  <CardHeader icon="📄">
    <CardTitle>Document Title</CardTitle>
  </CardHeader>
  <CardContent>
    <CardDescription>
      This is the document description
    </CardDescription>
  </CardContent>
</Card>
```

### Interactive Card with Text Emphasis

```tsx
<Card variant="default" interactive>
  <CardTitle>Feature Request</CardTitle>
  <CardDescription emphasis="high">
    High priority description
  </CardDescription>
  <CardDescription emphasis="low">
    Additional info with lower emphasis
  </CardDescription>
</Card>
```

### Colored Accent Cards

```tsx
{/* Blue accent using opacity modifiers */}
<Card variant="accent-blue">
  <CardTitle>Design System</CardTitle>
  <CardDescription>Tagged with blue</CardDescription>
</Card>

{/* Custom purple card with manual opacity */}
<Card className="bg-[var(--palette-purple-bg)]/30 border-[var(--palette-purple-text)]/20">
  <CardTitle className="text-[var(--palette-purple-text)]">
    Custom Purple Card
  </CardTitle>
</Card>
```

### Card with Hover Actions (Notion Pattern)

```tsx
<Card interactive>
  <CardHeader icon="✨">
    <CardTitle>Notion AI</CardTitle>
  </CardHeader>
  <CardContent>
    <CardDescription>
      AI-powered writing assistant
    </CardDescription>
  </CardContent>
  <CardFooter>
    <button>Edit</button>
    <button>Delete</button>
  </CardFooter>
</Card>
```

### Ghost Card with Custom Hover

```tsx
<Card
  variant="ghost"
  className="hover:bg-[var(--color-hover-medium)]"
>
  <CardTitle>Hover me</CardTitle>
</Card>
```

## Performance Notes

- **Pre-defined variables**: Using `--color-hover-subtle` is more performant than inline opacity
- **CSS-in-JS**: class-variance-authority generates static classes (no runtime CSS)
- **Transition efficiency**: Only animates opacity and background (GPU-accelerated)
- **Group selector**: More efficient than individual hover states on children

## Testing Strategy

- **Variant rendering**: Verify correct classes applied for each variant
- **Opacity modifiers**: Test Tailwind `/N` syntax works with CSS variables
- **Theme switching**: Validate colors update when theme changes
- **Interactive state**: Test cursor pointer and hover effects
- **Emphasis levels**: Verify text opacity differences
- **Hover actions**: Test CardFooter opacity transition
- **Icon rendering**: Verify icon container shows/hides correctly

## Future Improvements

- **Additional variants**: Consider orange, red, yellow accent colors
- **Responsive padding**: Padding variants that adapt to screen size
- **Animation presets**: Built-in entrance animations
- **Skeleton loading**: Loading state variant
- **Expandable cards**: Accordion-style expand/collapse

## Theme Color Reference

### Light Mode
- `--color-bg-base`: #FFFFFF
- `--color-bg-hover`: #F5F5F5
- `--color-bg-muted`: #F1F1EF
- `--color-text-primary`: #373530
- `--color-text-emphasis-medium`: rgba(55, 53, 48, 0.7)
- `--color-text-emphasis-low`: rgba(55, 53, 48, 0.5)
- `--color-border-subtle`: #EFEFEF
- `--color-divider`: #E9E9E7

### Dark Mode
- `--color-bg-base`: #191919
- `--color-bg-hover`: #2A2A2A
- `--color-bg-muted`: #252525
- `--color-text-primary`: #D4D4D4
- `--color-text-emphasis-medium`: rgba(212, 212, 212, 0.7)
- `--color-text-emphasis-low`: rgba(212, 212, 212, 0.5)
- `--color-border-subtle`: #333333
- `--color-divider`: #2F2F2F

## Best Practices

1. **Use pre-defined emphasis levels** instead of custom opacity
2. **Prefer variant system** over manual className overrides
3. **Keep interactive cards accessible** with keyboard support
4. **Use icon prop** in CardHeader for consistent icon styling
5. **Leverage group hover** for related action visibility
6. **Match padding variant** to content density needs
7. **Choose accent colors** that provide sufficient contrast

Last updated: 2025-11-12
