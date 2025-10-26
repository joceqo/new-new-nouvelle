# Fluid Typography & Layout Examples

Complete examples showing how to use fluid typography and fluid layouts together.

## Example 1: Hero Section

```tsx
import { Flex, Heading, Text, Button } from '@radix-ui/themes';

export function Hero() {
  return (
    <Flex
      direction="column"
      align="center"
      gap="5"
      p={{ initial: "6", md: "9" }}
    >
      <Heading
        size="9"
        weight="bold"
        align="center"
      >
        Build Amazing Products
      </Heading>

      <Text
        size="4"
        align="center"
        color="gray"
      >
        Experience fluid typography that adapts perfectly to any screen size
      </Text>

      <Button size="3">Get Started</Button>
    </Flex>
  );
}
```

## Example 2: Article with Custom Fluid Classes

```tsx
export function Article() {
  return (
    <article className="fluid-container">
      <h1 className="fluid-heading-lg">
        The Future of Responsive Design
      </h1>

      <p className="fluid-text-lg" style={{ color: 'var(--gray-11)' }}>
        An introduction to fluid typography and why it matters for modern web design.
      </p>

      <div className="fluid-text-base">
        <p>
          Fluid typography represents a significant advancement in responsive design.
          Instead of defining fixed breakpoints where text sizes suddenly jump, we can
          now create typography that scales smoothly and continuously.
        </p>

        <p>
          Using CSS clamp(), we define three values: a minimum size (for mobile),
          a preferred size (that scales with viewport width), and a maximum size
          (for large screens). The browser automatically calculates the optimal
          size at any screen width.
        </p>
      </div>
    </article>
  );
}
```

## Example 3: Card Component

```tsx
import { Card, Flex, Heading, Text } from '@radix-ui/themes';

export function FeatureCard({ title, description }: {
  title: string;
  description: string;
}) {
  return (
    <Card size="3">
      <Flex direction="column" gap="3">
        <Heading size="5" weight="bold">
          {title}
        </Heading>
        <Text size="2" color="gray">
          {description}
        </Text>
      </Flex>
    </Card>
  );
}
```

## Example 4: Mixing Radix Tokens with Custom Classes

```tsx
import { Flex, Text } from '@radix-ui/themes';

export function MixedTypography() {
  return (
    <Flex direction="column" gap="4">
      {/* Using Radix size tokens */}
      <Text size="3">
        This uses Radix size="3" with fluid token override
      </Text>

      {/* Using custom fluid class */}
      <div className="fluid-text-lg">
        This uses the custom fluid-text-lg class
      </div>

      {/* Combining both approaches */}
      <Text size="2" className="fluid-text-base">
        This combines Radix props with custom class
      </Text>
    </Flex>
  );
}
```

## Example 5: Responsive Navigation

```tsx
import { Flex, Text } from '@radix-ui/themes';

export function Navigation() {
  return (
    <nav>
      <Flex
        align="center"
        justify="between"
        p={{ initial: "3", md: "4" }}
        gap="4"
      >
        <Text
          size={{ initial: "4", md: "5" }}
          weight="bold"
        >
          Brand
        </Text>

        <Flex gap="4">
          <Text size={{ initial: "2", md: "3" }}>About</Text>
          <Text size={{ initial: "2", md: "3" }}>Features</Text>
          <Text size={{ initial: "2", md: "3" }}>Contact</Text>
        </Flex>
      </Flex>
    </nav>
  );
}
```

## Example 6: Dashboard Stats

```tsx
import { Card, Flex, Text } from '@radix-ui/themes';

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <Flex direction="column" gap="2">
        <Text size="1" color="gray" weight="medium">
          {label}
        </Text>
        <Text size="8" weight="bold">
          {value}
        </Text>
      </Flex>
    </Card>
  );
}

export function Dashboard() {
  return (
    <Flex gap="4" wrap="wrap">
      <StatCard label="Total Users" value="12,543" />
      <StatCard label="Revenue" value="$45.2K" />
      <StatCard label="Growth" value="+23%" />
    </Flex>
  );
}
```

## Tips for Best Results

### 1. Use Radix Tokens First
Prefer Radix UI Themes size tokens (1-9) over custom classes:
```tsx
✅ <Text size="3">Good</Text>
⚠️  <div className="fluid-text-base">Less preferred unless needed</div>
```

### 2. Test at Multiple Viewport Sizes
Resize your browser between 320px and 1440px to ensure smooth scaling:
```tsx
// Use browser dev tools responsive mode
// Or: npm run storybook and resize the viewport
```

### 3. Maintain Hierarchy
Ensure visual hierarchy is clear at all viewport sizes:
```tsx
<Heading size="8">Main Title</Heading>      {/* Largest */}
<Heading size="5">Section Title</Heading>   {/* Medium */}
<Text size="3">Body text</Text>             {/* Base */}
<Text size="1">Caption</Text>               {/* Smallest */}
```

### 4. Use Responsive Props
Combine fluid typography with Radix's responsive sizing:
```tsx
<Text
  size={{ initial: "2", sm: "3", md: "4" }}
  p={{ initial: "4", md: "6" }}
>
  This text has both fluid scaling AND responsive size changes
</Text>
```

### 5. Custom Fluid Values
Create your own fluid styles when needed:
```tsx
// In your component CSS
.custom-text {
  font-size: clamp(1.25rem, 1rem + 1.5vw, 2.5rem);
  line-height: 1.4;
}

// Use the clamp calculator: https://utopia.fyi/type/calculator/
```

## Performance Considerations

Fluid typography has minimal performance impact:
- ✅ Uses CSS custom properties (fast)
- ✅ No JavaScript calculations needed
- ✅ Works with SSR/SSG
- ✅ Supports all modern browsers

## Browser Support

`clamp()` is supported in:
- ✅ Chrome 79+
- ✅ Firefox 75+
- ✅ Safari 13.1+
- ✅ Edge 79+

For older browsers, the fallback uses the middle value (preferred size).
