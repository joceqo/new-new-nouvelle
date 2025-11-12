# Component: Heading

Status: stable  
Intent: Typography wrapper around Radix UI Heading component for consistent heading hierarchy with theme integration and fluid typography scaling.

## Props Contract

```ts
import { HeadingProps } from "@radix-ui/themes";

// Re-exports all Radix UI Heading props:
interface HeadingProps {
  // Content
  children?: React.ReactNode;

  // Typography
  size?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
  weight?: "light" | "regular" | "medium" | "bold";
  align?: "left" | "center" | "right";
  trim?: "normal" | "start" | "end" | "both";

  // Appearance
  color?:
    | "gray"
    | "gold"
    | "bronze"
    | "brown"
    | "yellow"
    | "amber"
    | "orange"
    | "tomato"
    | "red"
    | "ruby"
    | "crimson"
    | "pink"
    | "plum"
    | "purple"
    | "violet"
    | "iris"
    | "indigo"
    | "blue"
    | "cyan"
    | "teal"
    | "jade"
    | "green"
    | "grass"
    | "lime"
    | "mint"
    | "sky";
  highContrast?: boolean;

  // Semantic Level
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  // HTML attributes
  [key: string]: any;
}
```

## Behavior Rules

- **Pass-through wrapper**: All props forwarded directly to Radix UI Heading component
- **Semantic HTML**: Defaults to appropriate heading levels (h1-h6) based on size
- **Theme integration**: Automatically inherits theme tokens from ThemeProvider context
- **Visual vs Semantic**: `size` controls visual appearance, `as` controls semantic HTML level
- **No custom logic**: Pure wrapper with zero additional behavior

## Visual & Styling

- **Fluid typography**: Size scale automatically adapts between 320px (mobile) and 1440px (desktop) viewports
- **Size scale**: 9 levels (1=smallest, 9=largest) using CSS clamp() for smooth scaling
  - `size="6"`: clamp(1.5rem, 1.3571rem + 0.7143vw, 1.875rem) - ~24-30px
  - `size="7"`: clamp(1.875rem, 1.6964rem + 0.8929vw, 2.25rem) - ~30-36px
  - `size="8"`: clamp(2.25rem, 2.0357rem + 1.0714vw, 2.75rem) - ~36-44px
  - `size="9"`: clamp(2.75rem, 2.4643rem + 1.4286vw, 3.5rem) - ~44-56px
- **Weight hierarchy**: Bold default, with light/regular/medium/bold options
- **Margin handling**: Radix provides consistent vertical rhythm with fluid spacing
- **Line height**: Optimized for heading text (tighter than body text)
- **Color system**: Full Radix palette with heading-appropriate contrast
- **Custom fluid classes**: Utility classes like `fluid-heading-lg`, `fluid-display` available

## Accessibility

- **Heading hierarchy**: Supports h1-h6 semantic structure for screen readers
- **Skip navigation**: Proper heading levels enable outline navigation
- **High contrast**: Built-in accessibility enhancement option
- **Focus management**: Headings can receive focus when used as anchor targets
- **ARIA compatibility**: Works with aria-labelledby and aria-describedby references

## Dependencies

- `@radix-ui/themes` - Heading component and HeadingProps type
- `React` - Component framework
- `fluid-typography.css` - CSS custom properties for responsive scaling

## Edge Cases

- **Size vs semantic mismatch**: Large visual size with low semantic level (e.g., size="9" as="h6")
- **Empty children**: Renders empty heading element (may affect screen readers)
- **Nested headings**: HTML allows but creates accessibility issues
- **Long text**: Headings don't wrap gracefully by default
- **Color inheritance**: Theme colors may not provide sufficient contrast in all contexts

## Usage Examples

### Page Title

```tsx
import Heading from "@/components/design_system/Typography/Heading";

<Heading as="h1" size="9" weight="bold">
  Page Title
</Heading>;
```

### Section Heading

```tsx
<Heading as="h2" size="6" color="gray">
  Section Heading
</Heading>
```

### Card Title

```tsx
<Heading as="h3" size="4" trim="start">
  Card Title
</Heading>
```

### Styled Heading (Visual Override)

````tsx
### Styled Heading (Visual Override)
```tsx
<Heading as="h2" size="3" weight="medium" align="center">
  Small centered H2
</Heading>
````

### Fluid Typography Examples

```tsx
{
  /* Large responsive title */
}
<Heading as="h1" size="9">
  Scales from 44px to 56px fluidly
</Heading>;

{
  /* Using custom fluid utility class */
}
<Heading as="h2" className="fluid-heading-lg">
  Custom fluid scaling for special cases
</Heading>;
```

```

## Performance Notes

- **Zero overhead**: Direct prop forwarding with no processing
- **Bundle size**: Minimal wrapper (~10 lines)
- **SEO impact**: Proper heading hierarchy improves search rankings
- **Re-renders**: Only when props change

## Testing Strategy

- **Semantic structure**: Verify correct HTML heading elements generated
- **Visual consistency**: Test size/weight combinations across themes
- **Accessibility**: Heading outline navigation in screen readers
- **Responsive behavior**: Text wrapping and scaling on mobile

## Future Improvements

- **Responsive size objects**: Breakpoint-aware size props like `size={{ initial: "6", md: "8" }}`
- **Truncation**: Built-in ellipsis handling for long headings
- **Anchor links**: Automatic anchor generation for deep linking
- **Typography scales**: Predefined semantic levels (title, subtitle, section, etc.)
- **RTL support**: Right-to-left text direction handling
- **Fluid line-height**: Currently uses fixed line-heights, could make responsive

## Accessibility Guidelines

- **Heading hierarchy**: Don't skip levels (h1→h2→h3, not h1→h3)
- **One H1**: Only one h1 per page for main title
- **Descriptive text**: Headings should describe the following content
- **Color alone**: Don't rely on color alone to convey meaning
- **Focus indicators**: Ensure headings used as targets have visible focus

## Dependencies Map

```

Heading.tsx
└── @radix-ui/themes (external)
└── React (peer)

Used by:

- Page layouts (h1 titles)
- Section headers (h2-h6)
- Card titles
- Dialog titles
- Form sections
- Navigation categories

```

## Breaking Changes Policy

- **Major version**: Changes to default semantic mapping or prop interface
- **Minor version**: New props or styling options (backward compatible)
- **Patch version**: Bug fixes and accessibility improvements

Last updated: 2025-11-12
```
