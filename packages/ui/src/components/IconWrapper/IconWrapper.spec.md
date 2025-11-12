# Component: IconWrapper

Status: stable  
Intent: Unified wrapper for Lucide icons and custom icon content with proper sizing, hover areas, and interactive states.

## Props Contract

```ts
import { LucideIcon } from "lucide-react";

type IconSize = "xs" | "sm" | "md" | "lg";
type IconVariant = "default" | "button";

type BaseIconWrapperProps = {
  // Content
  icon?: LucideIcon; // Lucide icon component
  children?: React.ReactNode; // Custom content (emojis, etc.)
  iconProps?: React.SVGProps<SVGSVGElement>; // Pass-through to icon

  // Sizing
  size?: IconSize; // Predefined sizes or font-relative

  // Interaction
  interactive?: boolean; // Adds padding for hover area
  variant?: IconVariant; // "default" | "button"
};

// Conditional types based on variant
export type IconWrapperProps = BaseIconWrapperProps &
  (
    | (React.HTMLAttributes<HTMLDivElement> & { variant?: "default" })
    | (React.ButtonHTMLAttributes<HTMLButtonElement> & { variant: "button" })
  );
```

## Behavior Rules

- **Content priority**: `children` overrides `icon` prop when both provided
- **Size calculation**: Container size = icon size + padding (when interactive/button)
- **Render as button**: `variant="button"` renders `<button>` element with full button behavior
- **Render as div**: Default renders `<div>` for non-interactive icons
- **Font-relative sizing**: No `size` prop means icon scales with parent font-size (1em)
- **Interactive hover**: `interactive={true}` adds padding and hover area without button styling

## Visual & Styling

### Size Scale

```ts
const sizeClasses = {
  xs: { icon: "12px", container: "20px" }, // +4px padding each side
  sm: { icon: "16px", container: "24px" }, // +4px padding each side
  md: { icon: "20px", container: "32px" }, // +6px padding each side
  lg: { icon: "24px", container: "36px" }, // +6px padding each side
};
```

### Variant Styles

- **default**: Plain wrapper, inherits text color
- **button**: Rounded, hover states, focus ring, sidebar theme colors

### Interactive Mode

- Adds padding around icon for larger click/hover target
- Centers icon within padded container using flexbox
- Smooth color transitions (150ms duration)

## Accessibility

- **Button variant**: Full keyboard support, focus indicators, ARIA button behavior
- **Focus ring**: Custom focus-visible ring using theme colors
- **Hover targets**: Minimum 24px touch targets on interactive icons
- **Screen readers**: Button variant announces as button, div variant is decorative
- **High contrast**: Uses CSS custom properties that respond to system preferences

## Dependencies

- `lucide-react` - Icon components and LucideIcon type
- `@/lib/utils` - cn() utility for className merging
- `React` - Component framework

## Edge Cases

- **Missing icon + children**: Renders empty container (may cause layout issues)
- **Both icon + children**: Children take precedence, icon ignored
- **Invalid size**: Falls back to font-relative sizing (1em)
- **Button without size**: Uses font-relative sizing (may not provide adequate hover area)
- **Custom iconProps conflicts**: User-provided iconProps can override size classes
- **Nested interactive elements**: Button variant inside other buttons creates invalid HTML

## Usage Examples

### Basic Icon

```tsx
import { FileText } from "lucide-react";
import { IconWrapper } from "@/components/IconWrapper";

<IconWrapper icon={FileText} size="sm" />;
```

### Interactive Icon with Hover

```tsx
<IconWrapper
  icon={Settings}
  size="md"
  interactive
  className="text-muted-foreground hover:text-foreground"
/>
```

### Button Variant

```tsx
<IconWrapper
  icon={Plus}
  size="sm"
  variant="button"
  onClick={() => console.log("clicked")}
  aria-label="Add item"
/>
```

### Custom Content (Emoji)

```tsx
<IconWrapper size="md" interactive>
  <span className="text-base">🏠</span>
</IconWrapper>
```

### Font-Relative Sizing

```tsx
<div className="text-2xl">
  <IconWrapper icon={Star} /> {/* Scales to 2xl */}
</div>
```

## Performance Notes

- **No re-renders**: Props changes only trigger re-render, no internal state
- **CSS-only animations**: Transitions handled by CSS, no JavaScript
- **Conditional rendering**: Early returns prevent unnecessary DOM elements
- **Bundle impact**: ~50 lines, imports only used Lucide icons

## Testing Strategy

- **Size rendering**: Verify correct icon and container dimensions
- **Variant behavior**: Button vs div element generation
- **Event handling**: Click, keyboard, focus events
- **Content precedence**: Children override icon prop
- **Accessibility**: Focus indicators, screen reader announcements
- **Edge cases**: Missing props, conflicting props

## Future Improvements

- **Tooltip integration**: Built-in tooltip support for icon buttons
- **Loading states**: Skeleton or spinner during async icon loading
- **Icon sprite support**: SVG sprite optimization for repeated icons
- **Size customization**: CSS custom properties for size overrides
- **Animation presets**: Spin, pulse, bounce animations
- **RTL support**: Icon mirroring for directional icons
- **Touch feedback**: Mobile tap feedback animations

## Accessibility Guidelines

- **Use button variant** for all interactive icons
- **Provide aria-label** for icon buttons without visible text
- **Ensure minimum 24px** hover targets (achieved by size + interactive)
- **Test with screen readers** to verify announcement behavior
- **Check focus indicators** in high contrast mode
- **Avoid decorative icons** in button content (use background images instead)

## Dependencies Map

```
IconWrapper.tsx
├── lucide-react (external)
├── @/lib/utils
└── React (peer)

Used by:
- PageTreeItem (chevron, file icons, menu trigger)
- Sidebar navigation
- Button components with icons
- Form inputs with icon adornments
- Dropdown menu items
- Card headers
- Dialog close buttons
```

## CSS Custom Properties Used

```css
--sidebar-header-icon
--sidebar-header-icon-hover
--sidebar-action-bg-hover
--palette-blue-text
```

## Breaking Changes Policy

- **Major version**: Changes to size scale, variant behavior, or prop interface
- **Minor version**: New variants, sizes, or features (backward compatible)
- **Patch version**: Bug fixes, accessibility improvements, performance

Last updated: 2025-11-12
