import type { Meta, StoryObj } from '@storybook/react';
import { Flex } from '@radix-ui/themes';
import { Typography, TypographyShowcase } from './Typography';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Fluid Typography with Radix UI Themes

This implementation uses CSS \`clamp()\` to override Radix UI Themes typography tokens,
creating a fluid type system that scales smoothly between viewport sizes.

## Features

- **No Breakpoint Jumps**: Typography scales continuously as the viewport changes
- **Radix Integration**: Works seamlessly with Radix UI Themes components
- **Custom Utilities**: Additional fluid classes for fine-tuned control
- **Accessible**: Maintains readability and contrast at all sizes

## How It Works

The fluid-typography.css file overrides Radix CSS custom properties:

\`\`\`css
:root, .radix-themes {
  --font-size-3: clamp(1rem, 0.9286rem + 0.3571vw, 1.125rem);
  --font-size-6: clamp(1.5rem, 1.3571rem + 1vw, 1.875rem);
  /* ... more sizes ... */
}
\`\`\`

This means you can use standard Radix components and get fluid typography automatically!

## Try It

Resize your browser window to see the fluid scaling in action.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['heading', 'text', 'display'],
      description: 'The typography variant to use',
    },
    size: {
      control: 'select',
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
      description: 'Size scale based on Radix tokens',
    },
    weight: {
      control: 'select',
      options: ['light', 'regular', 'medium', 'bold'],
      description: 'Font weight',
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default text component with fluid typography
 */
export const Default: Story = {
  args: {
    variant: 'text',
    size: '3',
    children: 'This text scales fluidly with the viewport',
  },
};

/**
 * Heading variants demonstrating fluid scaling
 */
export const Headings: Story = {
  render: () => (
    <Flex direction="column" gap="4">
      <Typography variant="heading" size="9" weight="bold">
        Heading Size 9 - Largest
      </Typography>
      <Typography variant="heading" size="8" weight="bold">
        Heading Size 8
      </Typography>
      <Typography variant="heading" size="7" weight="bold">
        Heading Size 7
      </Typography>
      <Typography variant="heading" size="6" weight="bold">
        Heading Size 6
      </Typography>
      <Typography variant="heading" size="5">
        Heading Size 5
      </Typography>
      <Typography variant="heading" size="4">
        Heading Size 4
      </Typography>
    </Flex>
  ),
};

/**
 * Text sizes demonstrating fluid body text
 */
export const TextSizes: Story = {
  render: () => (
    <Flex direction="column" gap="4">
      <Typography variant="text" size="4">
        Text Size 4 - Large body text. Perfect for introductory paragraphs.
        This size creates visual hierarchy and draws attention to important
        content.
      </Typography>
      <Typography variant="text" size="3">
        Text Size 3 - Regular body text. This is the default size for most
        content. It provides excellent readability and is suitable for longer
        paragraphs.
      </Typography>
      <Typography variant="text" size="2">
        Text Size 2 - Small body text. Useful for secondary information,
        captions, or less important content that still needs to be readable.
      </Typography>
      <Typography variant="text" size="1">
        Text Size 1 - Extra small text. Best for labels, fine print, or
        supporting information.
      </Typography>
    </Flex>
  ),
};

/**
 * Custom fluid typography classes for additional control
 */
export const CustomFluidClasses: Story = {
  render: () => (
    <Flex direction="column" gap="4">
      <div className="fluid-display">
        Display Text - Perfect for hero sections
      </div>
      <div className="fluid-heading-xl">Heading XL - Major headlines</div>
      <div className="fluid-heading-lg">Heading Large - Section titles</div>
      <div className="fluid-heading-md">
        Heading Medium - Subsection headers
      </div>
      <div className="fluid-text-lg">Text Large - Emphasized content</div>
      <div className="fluid-text-base">
        Text Base - Standard body copy with comfortable reading size
      </div>
      <div className="fluid-text-sm">
        Text Small - Secondary content or metadata
      </div>
    </Flex>
  ),
};

/**
 * Complete showcase of all fluid typography options
 */
export const Showcase: Story = {
  render: () => <TypographyShowcase />,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: `
A comprehensive showcase of all available typography sizes and styles.
**Resize your browser window** to see the fluid scaling effect in action!

The typography smoothly transitions between minimum and maximum sizes
without any jarring breakpoint jumps.
        `,
      },
    },
  },
};

/**
 * Comparison showing fluid vs. static typography
 */
export const FluidVsStatic: Story = {
  render: () => (
    <Flex direction="column" gap="6">
      <Flex direction="column" gap="3">
        <div
          style={{
            fontSize: 'clamp(1.5rem, 1rem + 2vw, 3rem)',
            fontWeight: 'bold',
          }}
        >
          Fluid Typography (Scales Smoothly)
        </div>
        <div style={{ fontSize: '1rem', color: 'var(--gray-11)' }}>
          This text uses clamp() and scales smoothly as you resize the window.
          No sudden jumps - just a natural, continuous transition.
        </div>
      </Flex>

      <Flex direction="column" gap="3">
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
          Static Typography (Fixed Size)
        </div>
        <div style={{ fontSize: '1rem', color: 'var(--gray-11)' }}>
          This text has a fixed pixel size and won't change until you hit a
          media query breakpoint, creating a more jarring experience.
        </div>
      </Flex>
    </Flex>
  ),
  parameters: {
    docs: {
      description: {
        story: `
This example demonstrates the difference between fluid and static typography.
Resize your browser to see how the fluid example scales continuously while
the static example remains fixed.
        `,
      },
    },
  },
};

/**
 * Responsive content example with fluid typography
 */
export const ResponsiveContent: Story = {
  render: () => (
    <Flex direction="column" gap="5" className="fluid-container">
      <Typography variant="heading" size="8" weight="bold">
        The Future of Web Typography
      </Typography>

      <Typography variant="text" size="4">
        Fluid typography represents a paradigm shift in responsive design.
        Instead of fixed sizes that jump at breakpoints, we now have the power
        to create truly responsive text that adapts to any screen size.
      </Typography>

      <Flex direction="column" gap="3">
        <Typography variant="heading" size="5" weight="bold">
          Benefits of Fluid Typography
        </Typography>

        <Typography variant="text" size="3">
          With CSS clamp(), we can define minimum, preferred, and maximum font
          sizes all in one declaration. This creates a smooth, continuous scale
          that improves readability across devices.
        </Typography>

        <Typography variant="text" size="3">
          The result is a more polished, professional appearance that feels
          natural on any screen size - from mobile phones to ultra-wide
          monitors.
        </Typography>
      </Flex>

      <Flex direction="column" gap="2">
        <Typography variant="heading" size="4" weight="medium">
          Try it yourself
        </Typography>
        <Typography variant="text" size="2" color="gray">
          Resize your browser window and watch how every element on this page
          scales smoothly. No breakpoints, no jumps - just fluid, responsive
          typography.
        </Typography>
      </Flex>
    </Flex>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
