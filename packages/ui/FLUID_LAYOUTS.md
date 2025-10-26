# Fluid Layouts with Radix Flex

Complete guide to building fluid, responsive layouts using Radix UI Themes with overridden spacing tokens.

## Overview

This package uses **Approach 1** - overriding Radix UI Themes spacing tokens with `clamp()` values. This means:

✅ **All Flex components automatically get fluid spacing**
✅ **No extra classes or custom components needed**
✅ **Consistent with fluid typography**
✅ **Works with all Radix layout components**

## How It Works

The `src/styles/fluid-typography.css` file overrides Radix CSS custom properties:

```css
:root, .radix-themes {
  --space-1: clamp(0.25rem, 0.2rem + 0.25vw, 0.375rem);    /* ~4-6px */
  --space-2: clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem);       /* ~8-12px */
  --space-3: clamp(0.75rem, 0.6rem + 0.75vw, 1.125rem);    /* ~12-18px */
  --space-4: clamp(1rem, 0.8rem + 1vw, 1.5rem);            /* ~16-24px */
  --space-5: clamp(1.5rem, 1.2rem + 1.5vw, 2.25rem);       /* ~24-36px */
  --space-6: clamp(2rem, 1.6rem + 2vw, 3rem);              /* ~32-48px */
  --space-7: clamp(3rem, 2.4rem + 3vw, 4.5rem);            /* ~48-72px */
  --space-8: clamp(4rem, 3.2rem + 4vw, 6rem);              /* ~64-96px */
  --space-9: clamp(6rem, 4.8rem + 6vw, 9rem);              /* ~96-144px */
}
```

These tokens are automatically used by all Radix layout props: `gap`, `p`, `px`, `py`, `pt`, `pb`, `m`, `mx`, `my`, etc.

## Basic Usage

### Simple Flex with Fluid Gap

```tsx
import { Flex, Box } from '@radix-ui/themes';

function MyComponent() {
  return (
    <Flex gap="5">  {/* Gap scales from 24px to 36px */}
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Flex>
  );
}
```

### Fluid Padding

```tsx
<Flex direction="column" gap="4" p="6">
  {/* Padding scales from 32px to 48px */}
  <Box>Content with fluid spacing</Box>
</Flex>
```

### Responsive Direction + Fluid Spacing

```tsx
<Flex
  direction={{ initial: "column", md: "row" }}
  gap="5"  {/* Fluid at all breakpoints */}
>
  <Box>Column 1</Box>
  <Box>Column 2</Box>
</Flex>
```

## Common Patterns

### 1. Hero Section

```tsx
import { Flex, Heading, Text } from '@radix-ui/themes';

export function Hero() {
  return (
    <Flex
      direction="column"
      gap="6"        // Large fluid gap
      py="8"         // Extra large vertical padding
      align="center"
    >
      <Heading size="9">Welcome</Heading>
      <Text size="4">Your tagline here</Text>
    </Flex>
  );
}
```

### 2. Card Grid

```tsx
import { Flex, Card, Box } from '@radix-ui/themes';

export function CardGrid() {
  return (
    <Flex
      gap="5"
      wrap="wrap"
      direction={{ initial: "column", sm: "row" }}
    >
      {cards.map(card => (
        <Box
          key={card.id}
          flexGrow="1"
          style={{ flexBasis: 'clamp(250px, 30vw, 350px)' }}
        >
          <Card>
            <Flex direction="column" gap="3">
              {/* Card content */}
            </Flex>
          </Card>
        </Box>
      ))}
    </Flex>
  );
}
```

### 3. Two-Column Layout

```tsx
export function TwoColumn() {
  return (
    <Flex
      direction={{ initial: "column", md: "row" }}
      gap="6"
    >
      <Box flexGrow="2" p="5">
        Main content
      </Box>
      <Box flexGrow="1" p="5">
        Sidebar
      </Box>
    </Flex>
  );
}
```

### 4. Navigation Bar

```tsx
export function NavBar() {
  return (
    <Flex
      align="center"
      justify="between"
      p={{ initial: "4", md: "5" }}  // Responsive + fluid
      gap={{ initial: "3", md: "5" }}
    >
      <Heading size={{ initial: "5", md: "6" }}>Brand</Heading>
      <Flex gap="4">
        <Text>About</Text>
        <Text>Features</Text>
        <Text>Contact</Text>
      </Flex>
    </Flex>
  );
}
```

### 5. Dashboard Grid

```tsx
export function Dashboard() {
  return (
    <Flex direction="column" gap="6" p="6">
      <Heading size="7">Dashboard</Heading>

      {/* Stats row */}
      <Flex gap="4" wrap="wrap">
        <StatCard title="Users" value="1,234" />
        <StatCard title="Revenue" value="$45K" />
        <StatCard title="Growth" value="+23%" />
      </Flex>

      {/* Charts */}
      <Flex
        direction={{ initial: "column", lg: "row" }}
        gap="5"
      >
        <Box flexGrow="2">Chart 1</Box>
        <Box flexGrow="1">Chart 2</Box>
      </Flex>
    </Flex>
  );
}
```

## Spacing Scale Reference

| Prop Value | Min Size | Max Size | Use Case |
|------------|----------|----------|----------|
| `"1"` | 4px | 6px | Tight spacing, inline elements |
| `"2"` | 8px | 12px | Small gaps, compact layouts |
| `"3"` | 12px | 18px | Default spacing, list items |
| `"4"` | 16px | 24px | Medium spacing, cards |
| `"5"` | 24px | 36px | Large spacing, sections |
| `"6"` | 32px | 48px | Extra large, major sections |
| `"7"` | 48px | 72px | Hero sections |
| `"8"` | 64px | 96px | Page sections |
| `"9"` | 96px | 144px | Maximum spacing |

## Combining with Responsive Props

You get the best results by combining fluid tokens with Radix's responsive object syntax:

```tsx
<Flex
  direction={{ initial: "column", md: "row" }}
  gap={{ initial: "3", sm: "4", md: "5", lg: "6" }}
  p={{ initial: "4", md: "6", lg: "8" }}
>
  {/* Layout changes at breakpoints AND scales fluidly in between */}
</Flex>
```

This gives you:
- **Discrete changes** at breakpoints (e.g., column → row)
- **Smooth scaling** between breakpoints (fluid spacing)

## Advanced: Custom Fluid Classes

For cases where you need specific spacing outside the token scale:

```css
/* Your custom CSS */
.my-special-gap {
  gap: clamp(1.25rem, 1rem + 1.25vw, 2.5rem);
}
```

Or use the built-in utility classes:

```tsx
<Flex className="gap-fluid-md p-fluid-lg">
  {/* Custom fluid spacing */}
</Flex>
```

Available utilities:
- `gap-fluid-xs/sm/md/lg/xl`
- `p-fluid-xs/sm/md/lg/xl`
- `py-fluid-sm/md/lg`
- `w-fluid-sm/md/lg/xl`

## Fluid Width Patterns

### Fluid Container Width

```tsx
<Box style={{ width: 'clamp(300px, 80vw, 1200px)' }}>
  Content with fluid width
</Box>
```

### Fluid Card Basis

```tsx
<Flex gap="5" wrap="wrap">
  {items.map(item => (
    <Box
      key={item.id}
      flexGrow="1"
      style={{
        flexBasis: 'clamp(250px, 30vw, 350px)',
        minWidth: 0,  // Prevent overflow
      }}
    >
      <Card>{item.content}</Card>
    </Box>
  ))}
</Flex>
```

### Fluid Aspect Ratio Box

```tsx
<Box
  style={{
    width: 'clamp(300px, 50vw, 600px)',
    aspectRatio: '16/9',
  }}
>
  Responsive video or image
</Box>
```

## Best Practices

### ✅ DO

- Use Radix spacing props (`gap`, `p`, etc.) - they're automatically fluid
- Combine responsive props with fluid spacing for maximum control
- Use the spacing scale consistently across your app
- Test at multiple viewport sizes (320px - 1440px)

### ❌ DON'T

- Don't use inline pixel values for spacing: ~~`gap="16px"`~~
- Don't add custom gap/padding classes unless truly needed
- Don't forget to test on real mobile devices

## Debugging

### View Current Spacing Values

Use browser DevTools to inspect computed values:

```css
/* In DevTools, check computed styles */
gap: 1.5rem;  /* At 320px */
gap: 1.8rem;  /* At 500px */
gap: 2.25rem; /* At 1440px */
```

### Test Responsive Behavior

```tsx
// Add temporary visual indicators
<Flex gap="5" style={{ outline: '1px solid red' }}>
  <Box style={{ outline: '1px solid blue' }}>Item</Box>
</Flex>
```

## Performance

Fluid spacing has **no performance impact**:
- ✅ Pure CSS (no JavaScript)
- ✅ Computed once per viewport change
- ✅ Hardware accelerated
- ✅ Works with SSR/SSG

## Browser Support

`clamp()` is supported in:
- Chrome 79+ (Dec 2019)
- Firefox 75+ (Apr 2020)
- Safari 13.1+ (Mar 2020)
- Edge 79+ (Jan 2020)

Coverage: **96%+ of users** globally.

## Resources

- [Utopia Space Calculator](https://utopia.fyi/space/calculator/) - Generate custom fluid spacing scales
- [Radix Flex Documentation](https://www.radix-ui.com/themes/docs/components/flex)
- [CSS Clamp() Guide](https://web.dev/min-max-clamp/)
- [Fluid Space and Typography](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/)

## Examples

Check out the Storybook for live examples:

```bash
npm run storybook
# Navigate to: Layouts > FluidLayout
```

Stories include:
- Hero sections
- Card grids
- Two-column layouts
- Nested layouts
- Complete page layouts
- Spacing scale visualization
