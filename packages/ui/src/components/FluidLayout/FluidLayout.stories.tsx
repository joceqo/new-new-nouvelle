import type { Meta, StoryObj } from '@storybook/react';
import { Flex, Box, Text, Heading } from '@radix-ui/themes';
import {
  FluidLayoutShowcase,
  FluidHero,
  FluidCardGrid,
  FluidTwoColumn,
  FluidNested,
  FluidPageLayout,
} from './FluidLayout';

const meta = {
  title: 'Layouts/FluidLayout',
  component: FluidLayoutShowcase,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Fluid Layouts with Radix Flex

This implementation uses **Approach 1** - overriding Radix UI Themes spacing tokens with \`clamp()\` values.
This means **all Flex components automatically get fluid spacing** without any extra code!

## How It Works

The fluid-typography.css file overrides Radix spacing tokens:

\`\`\`css
:root, .radix-themes {
  --space-1: clamp(0.25rem, 0.2rem + 0.25vw, 0.375rem);
  --space-2: clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem);
  --space-3: clamp(0.75rem, 0.6rem + 0.75vw, 1.125rem);
  /* ... all the way to --space-9 */
}
\`\`\`

## Usage

Simply use Radix Flex components normally - spacing is automatic:

\`\`\`tsx
<Flex gap="5" p="6">
  <Box>Item 1</Box>
  <Box>Item 2</Box>
</Flex>
// gap and padding scale fluidly! ✨
\`\`\`

## Key Benefits

✅ **No extra classes needed** - works with all Radix components
✅ **Consistent spacing** - uses the same scale as typography
✅ **Smooth scaling** - no breakpoint jumps
✅ **Easy to use** - just use Radix props as normal

## Try It

**Resize your browser window** to see all layouts scale smoothly!
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FluidLayoutShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Complete showcase of all fluid layout patterns
 */
export const Showcase: Story = {
  render: () => <FluidLayoutShowcase />,
};

/**
 * Hero section with fluid vertical spacing
 */
export const Hero: Story = {
  render: () => <FluidHero />,
  parameters: {
    docs: {
      description: {
        story: `
A hero section demonstrating fluid vertical spacing. Uses:
- \`gap="6"\` - Fluid gap between elements
- \`py="8"\` - Fluid vertical padding
- \`gap="4"\` - Fluid gap between buttons

All spacing scales smoothly with the viewport.
        `,
      },
    },
  },
};

/**
 * Card grid with fluid gaps and widths
 */
export const CardGrid: Story = {
  render: () => <FluidCardGrid />,
  parameters: {
    docs: {
      description: {
        story: `
A responsive card grid with:
- \`gap="5"\` - Fluid gap between cards
- \`flexBasis: clamp(250px, 30vw, 350px)\` - Fluid card width
- \`direction={{ initial: 'column', sm: 'row' }}\` - Responsive layout

Cards flow naturally from single column on mobile to multi-column on desktop.
        `,
      },
    },
  },
};

/**
 * Two-column layout with fluid spacing
 */
export const TwoColumn: Story = {
  render: () => <FluidTwoColumn />,
  parameters: {
    docs: {
      description: {
        story: `
A classic two-column layout with:
- \`gap="6"\` - Fluid gap between columns
- \`p="5"\` and \`p="6"\` - Fluid padding inside columns
- \`direction={{ initial: 'column', md: 'row' }}\` - Stacks on mobile

Demonstrates how fluid spacing works in multi-column layouts.
        `,
      },
    },
  },
};

/**
 * Nested layouts with multiple gap levels
 */
export const Nested: Story = {
  render: () => <FluidNested />,
  parameters: {
    docs: {
      description: {
        story: `
Shows nested Flex layouts with different gap sizes:
- Outer container: \`gap="7"\` (large spacing)
- Cards: \`gap="5"\` (medium spacing)
- Inner content: \`gap="3"\` or \`gap="4"\` (small spacing)

Creates a clear visual hierarchy through fluid spacing.
        `,
      },
    },
  },
};

/**
 * Complete page layout example
 */
export const PageLayout: Story = {
  render: () => <FluidPageLayout />,
  parameters: {
    docs: {
      description: {
        story: `
A complete page layout combining all patterns:
- Header with responsive navigation
- Hero section with large vertical spacing
- Feature grid with fluid cards
- Content sections with varied spacing
- Footer with consistent spacing

**Resize your browser** to see the entire page flow from mobile to desktop!
        `,
      },
    },
  },
};

/**
 * Spacing scale demonstration
 */
export const SpacingScale: Story = {
  render: () => (
    <Flex direction="column" gap="6" p="6">
      <Heading size="7" weight="bold">
        Fluid Spacing Scale
      </Heading>
      <Text size="3" color="gray">
        All spacing tokens scale with the viewport. The boxes below show the
        different gap sizes.
      </Text>

      {[
        { gap: '1', label: 'gap="1"', desc: '~4-6px' },
        { gap: '2', label: 'gap="2"', desc: '~8-12px' },
        { gap: '3', label: 'gap="3"', desc: '~12-18px' },
        { gap: '4', label: 'gap="4"', desc: '~16-24px' },
        { gap: '5', label: 'gap="5"', desc: '~24-36px' },
        { gap: '6', label: 'gap="6"', desc: '~32-48px' },
        { gap: '7', label: 'gap="7"', desc: '~48-72px' },
        { gap: '8', label: 'gap="8"', desc: '~64-96px' },
        { gap: '9', label: 'gap="9"', desc: '~96-144px' },
      ].map(({ gap, label, desc }) => (
        <Flex key={gap} direction="column" gap="2">
          <Flex align="center" gap="3">
            <Text size="2" weight="bold" style={{ minWidth: '100px' }}>
              {label}
            </Text>
            <Text size="1" color="gray">
              {desc}
            </Text>
          </Flex>
          <Flex
            gap={gap as any}
            p="3"
            style={{
              background: 'var(--gray-3)',
              borderRadius: '6px',
            }}
          >
            <Box
              style={{
                width: '80px',
                height: '60px',
                background: 'var(--accent-9)',
                borderRadius: '4px',
              }}
            />
            <Box
              style={{
                width: '80px',
                height: '60px',
                background: 'var(--accent-9)',
                borderRadius: '4px',
              }}
            />
            <Box
              style={{
                width: '80px',
                height: '60px',
                background: 'var(--accent-9)',
                borderRadius: '4px',
              }}
            />
          </Flex>
        </Flex>
      ))}
    </Flex>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Visual demonstration of all 9 spacing tokens. Each \`gap\` value uses the
corresponding \`--space-N\` CSS custom property, which scales fluidly.

**Resize your browser** to see the gaps grow and shrink smoothly!
        `,
      },
    },
  },
};

/**
 * Padding scale demonstration
 */
export const PaddingScale: Story = {
  render: () => (
    <Flex direction="column" gap="5" p="6">
      <Heading size="7" weight="bold">
        Fluid Padding Scale
      </Heading>
      <Text size="3" color="gray">
        All padding props use the same fluid scale as gaps.
      </Text>

      <Flex direction="column" gap="4">
        {[
          { p: '2', label: 'p="2"' },
          { p: '3', label: 'p="3"' },
          { p: '4', label: 'p="4"' },
          { p: '5', label: 'p="5"' },
          { p: '6', label: 'p="6"' },
          { p: '7', label: 'p="7"' },
          { p: '8', label: 'p="8"' },
        ].map(({ p, label }) => (
          <Flex key={p} direction="column" gap="2">
            <Text size="2" weight="bold">
              {label}
            </Text>
            <Box
              p={p as any}
              style={{
                background: 'var(--gray-3)',
                borderRadius: '6px',
              }}
            >
              <Box
                style={{
                  background: 'var(--accent-9)',
                  color: 'white',
                  padding: '8px',
                  borderRadius: '4px',
                }}
              >
                <Text size="2">Content inside box with fluid padding</Text>
              </Box>
            </Box>
          </Flex>
        ))}
      </Flex>
    </Flex>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Shows how padding scales fluidly. The outer gray box has fluid padding,
and the inner blue box has fixed padding for contrast.

**Resize to see the padding** around the inner box grow and shrink!
        `,
      },
    },
  },
};

/**
 * Responsive object syntax with fluid tokens
 */
export const ResponsiveSyntax: Story = {
  render: () => (
    <Flex direction="column" gap="6" p="6">
      <Heading size="7" weight="bold">
        Combining Responsive Props with Fluid Spacing
      </Heading>
      <Text size="3" color="gray">
        You can combine Radix's responsive object syntax with the fluid tokens
        for maximum control.
      </Text>

      <Flex
        direction={{ initial: 'column', md: 'row' }}
        gap={{ initial: '3', sm: '4', md: '5', lg: '6' }}
        p={{ initial: '4', md: '6', lg: '8' }}
        style={{
          background: 'var(--gray-3)',
          borderRadius: '8px',
        }}
      >
        <Box
          flexGrow="1"
          p={{ initial: '3', md: '4' }}
          style={{
            background: 'var(--accent-3)',
            borderRadius: '6px',
          }}
        >
          <Text size="2" weight="bold">
            Column 1
          </Text>
          <Text size="1" color="gray">
            Responsive padding
          </Text>
        </Box>
        <Box
          flexGrow="1"
          p={{ initial: '3', md: '4' }}
          style={{
            background: 'var(--accent-3)',
            borderRadius: '6px',
          }}
        >
          <Text size="2" weight="bold">
            Column 2
          </Text>
          <Text size="1" color="gray">
            Responsive padding
          </Text>
        </Box>
        <Box
          flexGrow="1"
          p={{ initial: '3', md: '4' }}
          style={{
            background: 'var(--accent-3)',
            borderRadius: '6px',
          }}
        >
          <Text size="2" weight="bold">
            Column 3
          </Text>
          <Text size="1" color="gray">
            Responsive padding
          </Text>
        </Box>
      </Flex>

      <Text size="2" color="gray">
        This layout uses both breakpoint-based changes (stacking on mobile) AND
        fluid scaling between breakpoints. Best of both worlds!
      </Text>
    </Flex>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates combining:
- Responsive object syntax: \`gap={{ initial: '3', sm: '4', md: '5' }}\`
- Fluid tokens: Each value scales continuously

This gives you discrete breakpoint changes PLUS smooth scaling in between.
        `,
      },
    },
  },
};

/**
 * Custom fluid classes example
 */
export const CustomClasses: Story = {
  render: () => (
    <Flex direction="column" gap="6" p="6">
      <Heading size="7" weight="bold">
        Custom Fluid Utility Classes
      </Heading>
      <Text size="3" color="gray">
        For even more control, use the custom fluid spacing classes.
      </Text>

      <Flex direction="column" gap="5">
        <Box>
          <Text size="2" weight="bold" mb="2">
            gap-fluid-sm
          </Text>
          <Flex className="gap-fluid-sm p-fluid-xs" style={{ background: 'var(--gray-3)', borderRadius: '6px' }}>
            <Box style={{ width: '80px', height: '60px', background: 'var(--accent-9)', borderRadius: '4px' }} />
            <Box style={{ width: '80px', height: '60px', background: 'var(--accent-9)', borderRadius: '4px' }} />
            <Box style={{ width: '80px', height: '60px', background: 'var(--accent-9)', borderRadius: '4px' }} />
          </Flex>
        </Box>

        <Box>
          <Text size="2" weight="bold" mb="2">
            gap-fluid-md
          </Text>
          <Flex className="gap-fluid-md p-fluid-sm" style={{ background: 'var(--gray-3)', borderRadius: '6px' }}>
            <Box style={{ width: '80px', height: '60px', background: 'var(--accent-9)', borderRadius: '4px' }} />
            <Box style={{ width: '80px', height: '60px', background: 'var(--accent-9)', borderRadius: '4px' }} />
            <Box style={{ width: '80px', height: '60px', background: 'var(--accent-9)', borderRadius: '4px' }} />
          </Flex>
        </Box>

        <Box>
          <Text size="2" weight="bold" mb="2">
            gap-fluid-lg
          </Text>
          <Flex className="gap-fluid-lg p-fluid-md" style={{ background: 'var(--gray-3)', borderRadius: '6px' }}>
            <Box style={{ width: '80px', height: '60px', background: 'var(--accent-9)', borderRadius: '4px' }} />
            <Box style={{ width: '80px', height: '60px', background: 'var(--accent-9)', borderRadius: '4px' }} />
            <Box style={{ width: '80px', height: '60px', background: 'var(--accent-9)', borderRadius: '4px' }} />
          </Flex>
        </Box>
      </Flex>

      <Text size="2" color="gray">
        Available classes: gap-fluid-xs/sm/md/lg/xl, p-fluid-xs/sm/md/lg/xl,
        py-fluid-sm/md/lg, w-fluid-sm/md/lg/xl
      </Text>
    </Flex>
  ),
  parameters: {
    docs: {
      description: {
        story: `
Custom CSS utility classes for cases where you need more fine-grained control
than the standard Radix spacing tokens provide.

These use different \`clamp()\` ranges optimized for specific use cases.
        `,
      },
    },
  },
};
