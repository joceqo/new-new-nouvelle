# Component: Flex

Status: stable  
Intent: Layout wrapper around Radix UI Flex component for consistent flexbox layouts with theme integration and fluid spacing.

## Props Contract

```ts
import { FlexProps } from "@radix-ui/themes";

// Re-exports all Radix UI Flex props:
interface FlexProps {
  // Content
  children?: React.ReactNode;

  // Flexbox Layout
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  gap?: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

  // Responsive Layout
  direction?: ResponsiveValue<FlexDirection>;
  align?: ResponsiveValue<FlexAlign>;
  justify?: ResponsiveValue<FlexJustify>;
  gap?: ResponsiveValue<FlexGap>;

  // Sizing
  grow?: "0" | "1";
  shrink?: "0" | "1";

  // Spacing (inherits from Box)
  p?: ResponsiveValue<Space>;
  px?: ResponsiveValue<Space>;
  py?: ResponsiveValue<Space>;
  pt?: ResponsiveValue<Space>;
  pr?: ResponsiveValue<Space>;
  pb?: ResponsiveValue<Space>;
  pl?: ResponsiveValue<Space>;

  m?: ResponsiveValue<Space>;
  mx?: ResponsiveValue<Space>;
  my?: ResponsiveValue<Space>;
  mt?: ResponsiveValue<Space>;
  mr?: ResponsiveValue<Space>;
  mb?: ResponsiveValue<Space>;
  ml?: ResponsiveValue<Space>;

  // Layout
  width?: ResponsiveValue<string>;
  height?: ResponsiveValue<string>;

  // HTML attributes
  as?: keyof JSX.IntrinsicElements;
  [key: string]: any;
}
```

## Behavior Rules

- **Pass-through wrapper**: All props are forwarded directly to Radix UI Flex component
- **Theme integration**: Automatically inherits theme tokens from ThemeProvider context
- **Responsive by default**: All layout props support responsive object syntax
- **Fluid spacing**: Gap and padding/margin values use fluid spacing tokens
- **Semantic rendering**: Uses `as` prop to control HTML element (defaults to `div`)
- **No custom logic**: Pure wrapper with zero additional behavior

## Visual & Styling

### Flexbox Properties

- **Direction**: `row` (default), `column`, `row-reverse`, `column-reverse`
- **Alignment**: `start`, `center`, `end`, `baseline`, `stretch`
- **Justification**: `start`, `center`, `end`, `between`
- **Wrapping**: `nowrap` (default), `wrap`, `wrap-reverse`
- **Growth**: `grow="1"` for flex-grow, `shrink="0"` to prevent shrinking

### Fluid Spacing Integration

- **Gap scale**: 9 levels using fluid spacing tokens
  - `gap="1"`: clamp(0.125rem, 0.1rem + 0.125vw, 0.1875rem) - ~2-3px
  - `gap="3"`: clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem) - ~8-12px
  - `gap="5"`: clamp(1rem, 0.8rem + 1vw, 1.5rem) - ~16-24px
  - `gap="9"`: clamp(4rem, 3.2rem + 4vw, 6rem) - ~64-96px
- **Padding/Margin**: Same fluid scale as gap
- **Responsive scaling**: All spacing adapts between 320px (mobile) and 1440px (desktop)

### Responsive Syntax

```tsx
// Object syntax for breakpoints
<Flex
  direction={{ initial: "column", md: "row" }}
  gap={{ initial: "2", md: "4" }}
  p={{ initial: "4", lg: "6" }}
>
  Content
</Flex>
```

## Accessibility

- **Semantic HTML**: Supports any HTML element via `as` prop
- **Layout semantics**: Flexbox provides logical content flow
- **Screen readers**: No additional ARIA needed (pure layout component)
- **Focus management**: Maintains natural tab order unless explicitly modified
- **Responsive**: Adapts to different screen sizes and orientations

## Dependencies

- `@radix-ui/themes` - Flex component and FlexProps type
- `React` - Component framework

## Edge Cases

- **Overflow handling**: Long content may overflow container without wrapping
- **Nested flex containers**: Flex components can be nested for complex layouts
- **Zero gap**: `gap="0"` provides no spacing between children
- **Responsive conflicts**: Later breakpoints override earlier ones
- **Content sizing**: Children may grow/shrink unexpectedly without explicit sizing

## Usage Examples

### Basic Layouts

```tsx
import Flex from "@/components/design_system/Layout/Flex";

{
  /* Horizontal layout */
}
<Flex direction="row" align="center" gap="3">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Flex>;

{
  /* Vertical stack */
}
<Flex direction="column" gap="4">
  <h2>Title</h2>
  <p>Content</p>
  <button>Action</button>
</Flex>;
```

### Responsive Layouts

```tsx
{
  /* Mobile: stack, Desktop: row */
}
<Flex
  direction={{ initial: "column", md: "row" }}
  gap={{ initial: "3", md: "5" }}
  align="center"
>
  <div>Sidebar</div>
  <div>Main Content</div>
</Flex>;

{
  /* Responsive spacing */
}
<Flex
  direction="column"
  gap={{ initial: "2", sm: "4", lg: "6" }}
  p={{ initial: "4", md: "6", lg: "8" }}
>
  <section>Section 1</section>
  <section>Section 2</section>
</Flex>;
```

### Common Layout Patterns

```tsx
{
  /* Header with space between */
}
<Flex justify="between" align="center" p="4">
  <h1>Logo</h1>
  <nav>Navigation</nav>
</Flex>;

{
  /* Centered content */
}
<Flex direction="column" align="center" justify="center" height="100vh" gap="4">
  <h1>Welcome</h1>
  <button>Get Started</button>
</Flex>;

{
  /* Card layout */
}
<Flex direction="column" gap="3" p="5">
  <Flex justify="between" align="center">
    <h3>Card Title</h3>
    <button>•••</button>
  </Flex>
  <p>Card content goes here...</p>
  <Flex gap="2" justify="end">
    <button>Cancel</button>
    <button>Save</button>
  </Flex>
</Flex>;
```

### Form Layouts

```tsx
{
  /* Form field */
}
<Flex direction="column" gap="1" width="100%">
  <label>Email</label>
  <input type="email" />
</Flex>;

{
  /* Form buttons */
}
<Flex gap="3" justify="end" mt="6">
  <button type="button">Cancel</button>
  <button type="submit">Submit</button>
</Flex>;

{
  /* Inline form */
}
<Flex align="end" gap="3">
  <Flex direction="column" gap="1" grow="1">
    <label>Search</label>
    <input type="search" />
  </Flex>
  <button>Search</button>
</Flex>;
```

## Performance Notes

- **Zero overhead**: Direct prop forwarding with no processing
- **Bundle size**: Minimal wrapper (~10 lines)
- **CSS-in-JS**: Radix handles runtime CSS generation efficiently
- **Re-renders**: Only when props change (no internal state)

## Testing Strategy

- **Layout rendering**: Verify correct flexbox properties applied
- **Responsive behavior**: Test responsive prop objects across breakpoints
- **Spacing**: Test gap, padding, margin with fluid tokens
- **Nesting**: Complex nested flex layouts
- **Edge cases**: Overflow, wrapping, growth/shrink behavior

## Future Improvements

- **Layout presets**: Common layout patterns as shortcuts
- **Grid integration**: Companion Grid component for CSS Grid layouts
- **Container queries**: Support for container-based responsive design
- **Animation support**: Built-in layout transition animations
- **Debug mode**: Visual debugging for development

## Advanced Enhancement: Direction-Aware Fluid Spacing

Currently considering an enhancement to make spacing more intelligent based on flex direction:

### Problem Statement

Current Radix Flex uses the same spacing tokens for both horizontal and vertical gaps. However, optimal spacing often differs:

- **Horizontal spacing** should scale with viewport width (vw-based)
- **Vertical spacing** should scale with viewport height (vh-based) or remain fixed
- **Main axis** (direction of flex flow) could use fluid spacing
- **Cross axis** could use fixed minimum spacing

### Proposed Solution

```tsx
// Direction-aware gap behavior
<Flex direction="row" gap="5">
  {/* gap="5" becomes:
    - gapX: fluid horizontal spacing (--space-x-5, vw-based)
    - gapY: fixed spacing (1rem) for cross-axis
  */}
</Flex>

<Flex direction="column" gap="5">
  {/* gap="5" becomes:
    - gapY: fluid vertical spacing (--space-y-5, vh-based)
    - gapX: fixed spacing (1rem) for cross-axis
  */}
</Flex>

// Override with explicit control
<Flex direction="row" gapX="5" gapY="2rem" />
```

### Implementation Considerations

- **Complexity vs. Value**: Adds significant complexity to a simple wrapper
- **CSS Custom Properties**: Would require additional CSS tokens (--space-x-1 to --space-x-9, --space-y-1 to --space-y-9)
- **Direction Awareness**: Logic to detect flex direction and apply appropriate spacing
- **Responsive Behavior**: How to handle responsive direction changes
- **Backward Compatibility**: Must not break existing Radix Flex usage

### Alternatives

1. **Keep Simple**: Use current Radix Flex as-is, rely on responsive gap objects
2. **CSS-Only Solution**: Create utility classes for direction-aware spacing
3. **Separate Components**: Create `HFlex` and `VFlex` components with predefined spacing behavior
4. **Custom Hook**: `useDirectionAwareSpacing()` hook for manual control

### Decision

**Current Status**: Keeping simple wrapper approach
**Reason**: Complexity outweighs benefits for most use cases
**Alternative**: Use responsive gap syntax for different spacing needs

```tsx
// Current recommended approach for different horizontal/vertical spacing
<Flex
  direction="row"
  gap={{ initial: "3", md: "5" }}  // Responsive scaling
  style={{
    columnGap: "clamp(1rem, 2vw, 2rem)",  // Custom fluid horizontal
    rowGap: "0.5rem"  // Fixed vertical
  }}
>
```

## Incremental Enhancement Roadmap

### Phase 1: Enhanced Spacing Utilities (Low Complexity)

```tsx
// Add helper props for common patterns
interface FlexProps extends RadixFlexProps {
  fluidGap?: boolean; // Apply CSS clamp() to gap
  minGap?: string; // Minimum gap value
  maxGap?: string; // Maximum gap value
}

// Usage
<Flex gap="5" fluidGap minGap="1rem" maxGap="3rem">
  // Automatically applies clamp(1rem, [gap-5], 3rem)
</Flex>;
```

### Phase 2: Layout Presets (Medium Complexity)

```tsx
// Common layout patterns as shortcuts
<Flex preset="headerLayout">  // justify="between" align="center" p="4"
<Flex preset="buttonGroup">   // gap="3" justify="end"
<Flex preset="formField">     // direction="column" gap="1"
<Flex preset="cardActions">   // gap="2" justify="end" pt="3"
```

### Phase 3: Semantic Spacing (High Complexity)

Only implement if Phase 1-2 prove insufficient for common use cases.

### Recommendation

Start with **Phase 1** if you find yourself frequently needing custom fluid spacing. The current simple wrapper handles 80% of use cases effectively.

## Accessibility Guidelines

- **Logical flow**: Ensure visual layout matches logical content order
- **Focus indicators**: Don't break tab navigation with CSS order changes
- **Responsive design**: Test layouts work with zoom up to 200%
- **Orientation**: Support both portrait and landscape orientations
- **Reduced motion**: Respect prefers-reduced-motion for animations

## Dependencies Map

```
Flex.tsx
└── @radix-ui/themes (external)
    └── React (peer)

Used by:
- Layout containers
- Navigation components
- Form layouts
- Card structures
- Button groups
- Content sections
```

## Common Layout Patterns

```tsx
// Header/Navigation
<Flex justify="between" align="center" p="4" as="header">

// Sidebar Layout
<Flex direction={{ initial: "column", md: "row" }} gap="6">
  <aside>Sidebar</aside>
  <main>Content</main>
</Flex>

// Button Group
<Flex gap="2" justify="end">
  <Button variant="outline">Cancel</Button>
  <Button>Confirm</Button>
</Flex>

// Form Field
<Flex direction="column" gap="1">
  <Label>Field Label</Label>
  <Input />
</Flex>

// Card Header
<Flex justify="between" align="center" mb="3">
  <Heading size="4">Title</Heading>
  <DropdownMenu>...</DropdownMenu>
</Flex>
```

## Radix UI Flex Features

Inherits all Radix Flex capabilities:

- Responsive prop syntax with breakpoints
- Fluid spacing system integration
- Theme-aware spacing tokens
- CSS-in-JS optimization
- TypeScript prop inference
- Semantic HTML rendering

## Breaking Changes Policy

- **Major version**: Changes to Radix dependency or prop interface
- **Minor version**: New features or responsive enhancements (backward compatible)
- **Patch version**: Bug fixes only

Last updated: 2025-11-12
