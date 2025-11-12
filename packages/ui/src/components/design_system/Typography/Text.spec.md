# Component: Text

Status: stable  
Intent: Typography wrapper around Radix UI Text component for consistent text rendering with theme integration and fluid typography scaling.

## Props Contract

```ts
import { TextProps } from "@radix-ui/themes";

// Re-exports all Radix UI Text props:
interface TextProps {
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

  // Layout
  as?: keyof JSX.IntrinsicElements;

  // HTML attributes
  [key: string]: any;
}
```

## Behavior Rules

- **Pass-through wrapper**: All props are forwarded directly to Radix UI Text component
- **Theme integration**: Automatically inherits theme tokens from ThemeProvider context
- **Semantic rendering**: Uses `as` prop to control HTML element (defaults to `span`)
- **No custom logic**: Pure wrapper with zero additional behavior

## Visual & Styling

- **Fluid typography**: Size scale automatically adapts between 320px (mobile) and 1440px (desktop) viewports
- **Size scale**: 9 levels (1=smallest, 9=largest) using CSS clamp() for smooth scaling
  - `size="1"`: clamp(0.75rem, 0.7143rem + 0.1786vw, 0.875rem) - ~12-14px
  - `size="3"`: clamp(1rem, 0.9286rem + 0.3571vw, 1.125rem) - ~16-18px
  - `size="5"`: clamp(1.25rem, 1.1429rem + 0.5357vw, 1.5rem) - ~20-24px
  - `size="9"`: clamp(2.75rem, 2.4643rem + 1.4286vw, 3.5rem) - ~44-56px
- **Weight options**: light, regular, medium, bold
- **Color system**: Inherits full Radix color palette (25+ semantic colors)
- **High contrast**: Optional boost for accessibility
- **Text alignment**: left, center, right
- **Trimming**: Controls line-height adjustments for tight layouts
- **Custom fluid classes**: Additional utility classes like `fluid-text-base`, `fluid-text-lg` available

## Accessibility

- **Semantic HTML**: Supports any HTML element via `as` prop
- **High contrast**: Built-in support for accessibility enhancement
- **Color contrast**: Radix colors meet WCAG guidelines when used correctly
- **Screen readers**: No additional ARIA needed (pure text content)

## Dependencies

- `@radix-ui/themes` - Text component and TextProps type
- `React` - Component framework
- `fluid-typography.css` - CSS custom properties for responsive scaling

## Edge Cases

- **Empty children**: Renders empty element (normal HTML behavior)
- **Invalid size**: Radix handles gracefully with fallback
- **Color conflicts**: Theme colors override any CSS color properties
- **Multiple children**: All content rendered as siblings within container
- **HTML conflicts**: `as` prop can create invalid HTML if misused (e.g., `<span>` inside `<p>`)

## Usage Examples

### Basic Text

```tsx
import Text from "@/components/design_system/Typography/Text";

<Text>Default body text</Text>;
```

### Styled Text

```tsx
<Text size="3" weight="medium" color="blue">
  Medium blue text at size 3
</Text>
```

### Semantic Headings

```tsx
<Text as="h2" size="6" weight="bold">
  Heading using text component
</Text>
```

### High Contrast

```tsx
<Text color="gray" highContrast>
  Accessible high contrast text
</Text>
```

### Fluid Typography Override

```tsx
{
  /* Uses Radix size with fluid scaling */
}
<Text size="3">This text scales fluidly from 16px to 18px</Text>;

{
  /* Custom fluid class for specific use cases */
}
<Text className="fluid-text-lg">Custom fluid scaling using utility class</Text>;
```

## Performance Notes

- **Zero overhead**: Direct prop forwarding with no processing
- **Bundle size**: Minimal wrapper (~10 lines)
- **Re-renders**: Only when props change (React.memo not needed for such simple component)

## Testing Strategy

- **Props forwarding**: Verify all Radix props pass through correctly
- **Theme integration**: Test color and size variations
- **Semantic rendering**: Confirm `as` prop generates correct HTML elements
- **Edge cases**: Empty children, invalid props

## Future Improvements

- **TypeScript**: Could add stricter typing for `as` prop + valid HTML combinations
- **Variants**: Consider adding semantic variants (body, caption, label) as shortcuts
- **Responsive breakpoints**: Could add responsive size objects `size={{ initial: "2", md: "4" }}`
- **Custom colors**: Might need CSS custom property support for brand colors
- **Fluid line-height**: Currently uses fixed line-heights, could make fluid too

## Dependencies Map

```
Text.tsx
└── @radix-ui/themes (external)
    └── React (peer)

Used by:
- All text-heavy components
- Form labels and descriptions
- Card content
- Dialog text
- Navigation items
```

## Breaking Changes Policy

- **Major version**: Changes to prop interface or default behavior
- **Minor version**: New props or features (backward compatible)
- **Patch version**: Bug fixes only

Last updated: 2025-11-12
