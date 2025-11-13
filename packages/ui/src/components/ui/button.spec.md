# Component: Button

Status: stable  
Intent: Interactive button component with Notion-inspired styling, multiple variants, sizes, and accessibility features built on class-variance-authority.

## Props Contract

```ts
import { VariantProps } from "class-variance-authority";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

// Variant configuration
const buttonVariants = cva(
  // Base classes: flexbox, typography, transitions, focus states, disabled states
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--palette-blue-text)] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: "ghost" | "default" | "destructive" | "outline" | "secondary" | "link";
      size: "default" | "sm" | "lg" | "icon";
    },
    defaultVariants: {
      variant: "ghost", // Notion's subtle default
      size: "default",
    },
  }
);
```

## Behavior Rules

- **Default variant**: `ghost` - Notion's most common subtle button style
- **Flexbox layout**: Uses `inline-flex` with `items-center justify-center gap-2`
- **Icon support**: SVG children automatically sized to 16px and non-interactive
- **Disabled state**: Reduces opacity to 50% and removes pointer events
- **Focus management**: Custom focus ring using theme blue color
- **Transition**: All properties transition over 150ms for smooth interactions

## Visual & Styling

### Variants

- **ghost** (default): Transparent with subtle hover - `text-primary` → `hover:bg-subtle` → `active:bg-medium`
- **default**: Primary blue CTA - `bg-blue` → `hover:90%` → `active:80%` with shadow
- **destructive**: Red for dangerous actions - `bg-red` → `hover:90%` → `active:80%` with shadow
- **outline**: Border button - `border + transparent` → `hover:bg-subtle` → `active:bg-medium`
- **secondary**: Muted background - `bg-muted` → `hover:bg-active` → `active:bg-active/80%`
- **link**: Text link style - `text-blue` with `hover:underline`

### Sizes

- **default**: `h-8 px-3 py-1.5` - Standard button (32px height)
- **sm**: `h-7 px-2 py-1 text-xs` - Compact button (28px height)
- **lg**: `h-10 px-4 py-2` - Large button (40px height)
- **icon**: `h-7 w-7` - Square icon button (28x28px)

### Theme Integration

Uses CSS custom properties for colors:

- `--color-text-primary` - Main text color
- `--color-hover-subtle` / `--color-hover-medium` - Hover states
- `--palette-blue-text` - Primary blue (focus ring, default variant)
- `--palette-red-text` - Destructive red
- `--color-border` - Border color for outline variant

## Accessibility

- **Focus indicators**: Custom focus ring with 2px ring and 1px offset
- **Disabled handling**: `disabled:pointer-events-none disabled:opacity-50`
- **Screen readers**: Inherits all ARIA attributes from button element
- **Keyboard support**: Native button keyboard behavior (Space, Enter)
- **Color contrast**: Theme colors meet WCAG guidelines
- **Icon accessibility**: SVG icons are decorative (pointer-events-none)

## Dependencies

- `class-variance-authority` - Variant management and TypeScript inference
- `@/lib/utils` - cn() utility for className merging
- `React` - Component framework and forwardRef

## Edge Cases

- **Icon + text**: Gap-2 provides 8px spacing between icon and text
- **Long text**: `whitespace-nowrap` prevents wrapping (may overflow)
- **Nested interactive elements**: Button should not contain other interactive elements
- **asChild prop**: Currently typed but not implemented (would need Slot from Radix)
- **Custom className conflicts**: User classes merged after variant classes (higher specificity)

## Usage Examples

### Basic Buttons

```tsx
import { Button } from "@/components/ui/button";

{
  /* Default ghost button */
}
<Button>Cancel</Button>;

{
  /* Primary action */
}
<Button variant="default">Save Changes</Button>;

{
  /* Destructive action */
}
<Button variant="destructive">Delete</Button>;
```

### Sizes and Icons

```tsx
import { Plus, Save } from "lucide-react";

{
  /* Small button */
}
<Button size="sm">Small</Button>;

{
  /* Button with icon */
}
<Button>
  <Plus />
  Add Item
</Button>;

{
  /* Icon-only button */
}
<Button size="icon">
  <Save />
</Button>;
```

### Form Integration

```tsx
<form>
  <Button type="submit" variant="default">
    Submit Form
  </Button>

  <Button type="button" variant="outline">
    Reset
  </Button>
</form>
```

## Performance Notes

- **CVA optimization**: Class variants computed at build time
- **Bundle size**: ~1KB including CVA utilities
- **Re-renders**: Only when props change (React.forwardRef optimized)
- **CSS-in-JS**: No runtime CSS generation, all classes pre-built

## Testing Strategy

- **Variant rendering**: Verify correct classes applied for each variant/size combo
- **Event handling**: onClick, onFocus, onBlur, keyboard events
- **Accessibility**: Focus indicators, disabled states, ARIA attributes
- **Icon integration**: SVG sizing and pointer-event handling
- **Form behavior**: Submit, reset, validation integration

## Future Improvements

- **Implement asChild**: Use Radix Slot for polymorphic behavior
- **Loading states**: Add spinner variant with disabled interaction
- **Responsive sizes**: Breakpoint-aware size props
- **Animation presets**: Pulse, bounce effects for feedback
- **Custom color variants**: Theme-aware custom color generation
- **Icon position**: Left/right icon positioning options

## Accessibility Guidelines

- **Use semantic HTML**: Prefer `<button>` over `<div>` with click handlers
- **Provide clear labels**: Button text should describe the action
- **Handle disabled state**: Use `disabled` attribute, not just visual styling
- **Focus management**: Ensure focus moves logically after button actions
- **Loading feedback**: Announce loading states to screen readers
- **Icon buttons**: Always provide accessible text or aria-label

## Dependencies Map

```
button.tsx
├── class-variance-authority (external)
├── @/lib/utils
└── React (peer)

Used by:
- Form components (submit, reset)
- Dialog actions (cancel, confirm)
- Dropdown triggers
- Navigation elements
- Card actions
- Toolbar buttons
```

## CSS Custom Properties Used

```css
--color-text-primary
--color-hover-subtle
--color-hover-medium
--palette-blue-text
--palette-red-text
--color-border
--color-bg-muted
--color-bg-active
```

## Breaking Changes Policy

- **Major version**: Changes to variant names, default behavior, or class structure
- **Minor version**: New variants, sizes, or features (backward compatible)
- **Patch version**: Bug fixes, accessibility improvements, performance

Last updated: 2025-11-12
