# Component: NotionButton

Status: stable  
Intent: Notion-inspired button component showcasing advanced theme integration with CSS custom properties, opacity modifiers, and minimal ghost-first design philosophy.

## Props Contract

```ts
import { VariantProps } from "class-variance-authority";

export interface NotionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof notionButtonVariants> {
  asChild?: boolean;
  variant?: "default" | "ghost" | "ghost-alt" | "destructive" | "outline" | "secondary" | "blue" | "purple" | "green";
  size?: "default" | "sm" | "lg" | "icon";
}
```

## Behavior Rules

- **Ghost-first design**: Default variant is `ghost`, matching Notion's subtle UI philosophy
- **Minimal visual weight**: Emphasis on content over chrome
- **Hover-based feedback**: Actions become visible on interaction
- **Opacity transitions**: Smooth state changes using CSS variables with Tailwind modifiers
- **Icon integration**: SVG children auto-sized to 16px and made non-interactive
- **Disabled state**: Reduces opacity and removes pointer events

## Visual & Styling

### Variants

#### Primary Variants

- **ghost** (default): Notion's most common button style
  - Text: `text-[var(--color-text-primary)]`
  - Hover: `hover:bg-[var(--color-hover-subtle)]` (4% opacity)
  - Active: `active:bg-[var(--color-hover-medium)]` (8% opacity)
  - **Performance**: Uses pre-defined transparency variables

- **ghost-alt**: Alternative ghost with Tailwind opacity
  - Text: `text-[var(--color-text-primary)]`
  - Hover: `hover:bg-[var(--color-bg-hover)]/50` (50% opacity)
  - Active: `active:bg-[var(--color-bg-hover)]/80` (80% opacity)
  - **Flexibility**: Allows custom opacity values

- **default**: Primary CTA button (rare in Notion)
  - Background: `bg-[var(--palette-blue-text)]`
  - Text: `text-white`
  - Hover: `hover:bg-[var(--palette-blue-text)]/90`
  - Active: `active:bg-[var(--palette-blue-text)]/80`
  - Shadow: `shadow-sm`

- **destructive**: Delete/remove actions
  - Background: `bg-[var(--palette-red-text)]`
  - Text: `text-white`
  - Hover: `hover:bg-[var(--palette-red-text)]/90`
  - Active: `active:bg-[var(--palette-red-text)]/80`
  - Shadow: `shadow-sm`

- **outline**: Subtle border (rare in Notion)
  - Border: `border border-[var(--color-border)]`
  - Background: `bg-transparent`
  - Text: `text-[var(--color-text-primary)]`
  - Hover: `hover:bg-[var(--color-hover-subtle)]`
  - Active: `active:bg-[var(--color-hover-medium)]`

- **secondary**: Colored background
  - Background: `bg-[var(--color-bg-muted)]`
  - Text: `text-[var(--color-text-primary)]`
  - Hover: `hover:bg-[var(--color-bg-active)]`
  - Active: `active:bg-[var(--color-bg-active)]/80`

#### Colored Accent Variants

- **blue**: Tag/category styling
  - Background: `bg-[var(--color-accent-blue-bg)]`
  - Text: `text-[var(--color-accent-blue-text)]`
  - Hover: `hover:bg-[var(--color-accent-blue-bg)]/80`
  - Active: `active:bg-[var(--color-accent-blue-bg)]/60`

- **purple**: Tag/category styling
  - Background: `bg-[var(--color-accent-purple-bg)]`
  - Text: `text-[var(--color-accent-purple-text)]`
  - Hover: `hover:bg-[var(--color-accent-purple-bg)]/80`
  - Active: `active:bg-[var(--color-accent-purple-bg)]/60`

- **green**: Tag/category styling
  - Background: `bg-[var(--color-accent-green-bg)]`
  - Text: `text-[var(--color-accent-green-text)]`
  - Hover: `hover:bg-[var(--color-accent-green-bg)]/80`
  - Active: `active:bg-[var(--color-accent-green-bg)]/60`

### Sizes

- **default**: `h-8 px-3 py-1.5 text-sm rounded-md` - Notion's primary size (32px height)
- **sm**: `h-7 px-2 py-1 text-xs rounded` - Compact buttons (28px height)
- **lg**: `h-10 px-4 py-2 text-base rounded-md` - Large CTAs (40px height)
- **icon**: `h-7 w-7 rounded-md` - Icon-only square buttons (28x28px)

### Typography

- **Font weight**: `font-medium` for balanced emphasis
- **Font size**: Matches size variant (`text-sm`, `text-xs`, `text-base`)
- **Icon sizing**: `[&_svg]:size-4` (16px) for consistent icon appearance
- **Icon spacing**: `gap-2` (8px) between icon and text

### Theme Integration

#### Opacity Patterns

**Method 1: Pre-defined variables (Best Performance)**
```css
--color-hover-subtle: rgba(0, 0, 0, 0.04)  /* Light mode */
--color-hover-medium: rgba(0, 0, 0, 0.08)
--color-hover-subtle: rgba(255, 255, 255, 0.06)  /* Dark mode */
--color-hover-medium: rgba(255, 255, 255, 0.12)
```

**Method 2: Tailwind Opacity Modifiers (More Flexible)**
```tsx
bg-[var(--palette-blue-text)]/90  // 90% opacity
hover:bg-[var(--color-bg-hover)]/50  // 50% opacity
```

#### Color Palette

**Light Mode:**
- `--palette-blue-text`: #487CA5
- `--palette-red-text`: #C4554D
- `--color-text-primary`: #373530
- `--color-bg-muted`: #F1F1EF
- `--color-border`: #E0E0E0

**Dark Mode:**
- `--palette-blue-text`: #447ACB
- `--palette-red-text`: #BE524B
- `--color-text-primary`: #D4D4D4
- `--color-bg-muted`: #252525
- `--color-border`: #444444

## Accessibility

- **Focus indicators**: `focus-visible:ring-2 focus-visible:ring-[var(--palette-blue-text)]`
  - Ring color uses theme blue
  - 2px ring with 2px offset
- **Disabled state**: `disabled:pointer-events-none disabled:opacity-50`
- **Keyboard support**: Native button behavior (Space, Enter)
- **Screen readers**: Inherits button ARIA semantics
- **Color contrast**: Theme colors meet WCAG AA standards
- **Icon accessibility**: `[&_svg]:pointer-events-none` prevents icon click interference

## Dependencies

- `class-variance-authority` - Type-safe variant system
- `@/lib/utils` - cn() utility for className merging
- `React` - Component framework and forwardRef

## Edge Cases

- **Icon + text spacing**: `gap-2` provides consistent 8px spacing
- **Icon shrinking**: `[&_svg]:shrink-0` prevents icon size reduction
- **Long text**: No `whitespace-nowrap` allows natural wrapping
- **asChild prop**: Typed but not implemented (would need Slot pattern)
- **Custom opacity**: Can use any Tailwind value (`/10`, `/25`, `/50`, `/75`, `/90`, `/95`)
- **Theme switching**: Smooth transitions when switching light ↔ dark mode

## Usage Examples

### Default Ghost Button (Most Common)

```tsx
import { NotionButton } from "@/components/ui/button-notion";

<NotionButton>Click me</NotionButton>
```

### Primary CTA Button

```tsx
<NotionButton variant="default">Save</NotionButton>
```

### Destructive Action

```tsx
<NotionButton variant="destructive">Delete</NotionButton>
```

### Icon-Only Button

```tsx
import { Search } from "lucide-react";

<NotionButton variant="ghost" size="icon">
  <Search className="h-4 w-4" />
</NotionButton>
```

### Colored Accent Buttons (Tags/Categories)

```tsx
<NotionButton variant="blue">Tag: Design</NotionButton>
<NotionButton variant="purple">Tag: Documentation</NotionButton>
<NotionButton variant="green">Tag: Feature</NotionButton>
```

### Custom Opacity with Tailwind Syntax

```tsx
<NotionButton className="bg-[var(--palette-orange-bg)]/50 hover:bg-[var(--palette-orange-bg)]/70">
  Custom Orange
</NotionButton>
```

### Button with Icon and Text

```tsx
import { Plus } from "lucide-react";

<NotionButton variant="ghost">
  <Plus className="h-4 w-4" />
  New Page
</NotionButton>
```

## Performance Notes

- **Pre-defined hover variables**: More performant than calculating opacity at runtime
- **Static class generation**: class-variance-authority generates classes at build time
- **GPU-accelerated transitions**: Only animates transform, opacity, background
- **Icon optimization**: SVG icons don't block pointer events

## Comparison with Standard Button Component

| Feature | NotionButton | Standard Button |
|---------|--------------|-----------------|
| Default variant | `ghost` | `ghost` |
| Opacity method | CSS vars + Tailwind modifiers | Standard Tailwind |
| Focus ring color | Theme blue | Theme blue |
| Icon size | 16px (size-4) | 16px (size-4) |
| Colored variants | Blue, purple, green | None |
| Design philosophy | Minimal, ghost-first | Standard shadcn/ui |

## Testing Strategy

- **Variant rendering**: Verify correct classes for each variant
- **Opacity modifiers**: Test `/N` syntax with CSS variables
- **Theme switching**: Validate colors update on theme change
- **Hover states**: Test subtle → medium → active progression
- **Icon rendering**: Verify icon sizing and spacing
- **Focus states**: Test keyboard navigation and focus ring
- **Disabled state**: Verify opacity and pointer-events

## Future Improvements

- **Additional accent colors**: Orange, yellow, red, brown variants
- **Loading state**: Spinner variant with disabled styling
- **Tooltip integration**: Built-in tooltip support for icon buttons
- **Responsive sizes**: Size variants that adapt to screen size
- **Animation presets**: Micro-interactions on click

## Design Philosophy

### Ghost-First Approach

Notion prioritizes ghost buttons because:
1. **Reduced visual noise**: Content takes precedence over chrome
2. **Contextual actions**: Buttons appear where needed, not everywhere
3. **Hover discovery**: Actions reveal themselves on interaction
4. **Minimal hierarchy**: Fewer visual levels create cleaner interfaces

### When to Use Each Variant

- **ghost**: 90% of buttons - toolbar actions, inline actions, navigation
- **default**: Critical CTAs - "Save", "Publish", "Create"
- **destructive**: Dangerous actions - "Delete", "Remove", "Archive"
- **outline**: Secondary prominence - "Cancel", "Learn More"
- **secondary**: Grouped actions - Button groups, toolbars
- **colored accents**: Tags, categories, status indicators

## Best Practices

1. **Default to ghost** unless you need emphasis
2. **Use pre-defined hover variables** for better performance
3. **Limit primary buttons** to one per view/modal
4. **Icon buttons need tooltips** for accessibility
5. **Match button size** to surrounding UI density
6. **Use accent colors** for semantic meaning (not decoration)
7. **Test in both themes** to ensure contrast

Last updated: 2025-11-12
