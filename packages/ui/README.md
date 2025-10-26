# @nouvelle/ui

A modern UI component library built with **Radix UI Themes**, **Vite**, **fluid typography**, and **fluid layouts**.

## Features

- **Fluid Typography**: CSS `clamp()` based typography that scales smoothly across viewport sizes
- **Fluid Layouts**: Automatic fluid spacing for all Flex layouts - no extra code needed!
- **Radix UI Themes Integration**: Built on top of Radix's powerful design system
- **Storybook Documentation**: Interactive component documentation and examples
- **TypeScript**: Full type safety and IntelliSense support
- **Vite**: Fast development and optimized builds

## Installation

```bash
npm install @nouvelle/ui @radix-ui/themes
```

## Quick Start

### 1. Import Styles

In your app's entry point (e.g., `main.tsx` or `App.tsx`):

```tsx
import '@radix-ui/themes/styles.css';
import '@nouvelle/ui/styles/fluid-typography.css';
```

### 2. Wrap Your App with Theme

```tsx
import { Theme } from '@nouvelle/ui';

function App() {
  return (
    <Theme appearance="light" accentColor="blue">
      {/* Your app content */}
    </Theme>
  );
}
```

### 3. Use Components

```tsx
import { Typography } from '@nouvelle/ui';

function MyComponent() {
  return (
    <>
      <Typography variant="heading" size="8" weight="bold">
        Welcome to Fluid Typography
      </Typography>
      <Typography variant="text" size="3">
        This text scales smoothly as you resize the browser!
      </Typography>
    </>
  );
}
```

## Fluid Typography

This package implements fluid typography by overriding Radix UI Themes CSS custom properties with `clamp()` values. This creates a responsive type system that scales continuously between viewport sizes without breakpoint jumps.

### Using Radix Components

All Radix UI Themes components automatically use the fluid typography tokens:

```tsx
import { Heading, Text, Flex } from '@radix-ui/themes';

<Flex direction="column" gap="4">
  <Heading size="8">This heading scales fluidly!</Heading>
  <Text size="3">So does this body text!</Text>
</Flex>
```

### Custom Fluid Classes

For additional control, use the custom fluid typography classes:

```tsx
<div className="fluid-display">Hero Text</div>
<div className="fluid-heading-xl">Large Heading</div>
<div className="fluid-text-base">Body Copy</div>
<div className="fluid-text-sm">Small Text</div>
```

Available classes:
- `fluid-display` - Largest display text
- `fluid-heading-xl`, `fluid-heading-lg`, `fluid-heading-md`, `fluid-heading-sm`
- `fluid-text-xl`, `fluid-text-lg`, `fluid-text-base`, `fluid-text-sm`, `fluid-text-xs`

### Typography Scale

The fluid typography system uses the following scale:

| Size | Min (320px) | Max (1440px) | Usage |
|------|-------------|--------------|-------|
| 1 | 0.75rem | 0.875rem | Extra small text, labels |
| 2 | 0.875rem | 1rem | Small text, captions |
| 3 | 1rem | 1.125rem | Body text (default) |
| 4 | 1.125rem | 1.25rem | Large body text |
| 5 | 1.25rem | 1.5rem | Small headings |
| 6 | 1.5rem | 1.875rem | Medium headings |
| 7 | 1.875rem | 2.25rem | Large headings |
| 8 | 2.25rem | 2.75rem | Display headings |
| 9 | 2.75rem | 3.5rem | Hero/display text |

## Fluid Layouts

All Radix Flex layouts automatically have fluid spacing! The same `clamp()` approach used for typography is applied to spacing tokens.

### Automatic Fluid Spacing

Simply use Radix Flex components normally - spacing scales automatically:

```tsx
import { Flex, Box } from '@radix-ui/themes';

<Flex gap="5" p="6">  {/* Both gap and padding scale fluidly! */}
  <Box>Item 1</Box>
  <Box>Item 2</Box>
  <Box>Item 3</Box>
</Flex>
```

### Responsive + Fluid

Combine responsive props with fluid spacing for maximum control:

```tsx
<Flex
  direction={{ initial: "column", md: "row" }}
  gap={{ initial: "3", sm: "4", md: "5" }}
  p={{ initial: "4", md: "6" }}
>
  {/* Layout changes at breakpoints AND scales fluidly between them */}
</Flex>
```

### Spacing Scale

| Prop | Min Size | Max Size | Use Case |
|------|----------|----------|----------|
| `"1"` | 4px | 6px | Tight spacing |
| `"2"` | 8px | 12px | Small gaps |
| `"3"` | 12px | 18px | Default spacing |
| `"4"` | 16px | 24px | Medium spacing |
| `"5"` | 24px | 36px | Large spacing |
| `"6"` | 32px | 48px | Section spacing |
| `"7"` | 48px | 72px | Hero sections |
| `"8"` | 64px | 96px | Page sections |
| `"9"` | 96px | 144px | Maximum spacing |

### Common Patterns

```tsx
// Hero section
<Flex direction="column" gap="6" py="8" align="center">
  <Heading size="9">Hero Title</Heading>
  <Text size="4">Subtitle</Text>
</Flex>

// Card grid
<Flex gap="5" wrap="wrap" direction={{ initial: "column", sm: "row" }}>
  {cards.map(card => <Card key={card.id}>{card.content}</Card>)}
</Flex>

// Two-column layout
<Flex direction={{ initial: "column", md: "row" }} gap="6">
  <Box flexGrow="2">Main content</Box>
  <Box flexGrow="1">Sidebar</Box>
</Flex>
```

### Custom Fluid Utilities

For fine-grained control, use custom utility classes:

```tsx
<Flex className="gap-fluid-md p-fluid-lg">
  {/* Custom fluid spacing */}
</Flex>
```

Available: `gap-fluid-xs/sm/md/lg/xl`, `p-fluid-xs/sm/md/lg/xl`, `py-fluid-sm/md/lg`, `w-fluid-sm/md/lg/xl`

📖 **See [FLUID_LAYOUTS.md](./FLUID_LAYOUTS.md) for complete documentation and examples.**

## Development

### Run Storybook

```bash
npm run storybook
```

This will start Storybook at `http://localhost:6006` where you can:
- View all components and their variants
- Interact with component props
- See responsive fluid typography in action
- Read comprehensive documentation

### Build

```bash
npm run build
```

### Type Check

```bash
npm run typecheck
```

## Customization

### Adjusting Fluid Scale

Edit `src/styles/fluid-typography.css` to customize the fluid typography scale:

```css
:root, .radix-themes {
  /* Customize any size token */
  --font-size-3: clamp(1rem, 0.9rem + 0.5vw, 1.25rem);

  /* Add your custom sizes */
  --my-custom-size: clamp(1.5rem, 1.2rem + 1vw, 2rem);
}
```

Generate custom `clamp()` values using:
- [Utopia Fluid Type Calculator](https://utopia.fyi/type/calculator/)
- [Fluid Type Scale Calculator](https://www.fluid-type-scale.com/)

### Theme Customization

Customize Radix UI Themes via the `Theme` component:

```tsx
<Theme
  appearance="dark"
  accentColor="purple"
  grayColor="slate"
  radius="large"
  scaling="95%"
>
  {/* Your app */}
</Theme>
```

See [Radix Themes docs](https://www.radix-ui.com/themes/docs/theme/overview) for all options.

## Resources

- [Radix UI Themes Documentation](https://www.radix-ui.com/themes/docs)
- [CSS Clamp() Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp)
- [Fluid Typography Article](https://css-tricks.com/snippets/css/fluid-typography/)

## License

Private package for @nouvelle project.
