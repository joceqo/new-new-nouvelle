import React from 'react';
import { Flex, Box, Heading, Text, Container, Card } from '@radix-ui/themes';

/**
 * FluidLayout demonstrates fluid spacing with Radix Flex components
 *
 * All spacing (gap, padding, margin) uses the overridden CSS tokens
 * from fluid-typography.css, which scale smoothly with the viewport.
 */

/**
 * Hero Section with Fluid Spacing
 */
export const FluidHero: React.FC = () => {
  return (
    <Flex
      direction="column"
      gap="6" // Uses fluid --space-6: clamp(2rem, 1.6rem + 2vw, 3rem)
      py="8" // Uses fluid --space-8: clamp(4rem, 3.2rem + 4vw, 6rem)
      align="center"
      style={{ background: 'var(--gray-2)' }}
    >
      <Heading size="8" weight="bold">
        Fluid Layout Hero
      </Heading>
      <Text size="4" align="center" color="gray">
        All spacing on this page scales smoothly with the viewport
      </Text>
      <Flex gap="4" wrap="wrap" justify="center">
        <Box
          p="3"
          style={{
            background: 'var(--accent-9)',
            color: 'white',
            borderRadius: '6px',
          }}
        >
          <Text size="2" weight="bold">
            Get Started
          </Text>
        </Box>
        <Box
          p="3"
          style={{
            background: 'var(--gray-4)',
            borderRadius: '6px',
          }}
        >
          <Text size="2" weight="bold">
            Learn More
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

/**
 * Card Grid with Fluid Gap
 */
export const FluidCardGrid: React.FC = () => {
  return (
    <Flex
      direction={{ initial: 'column', sm: 'row' }}
      gap="5" // Fluid gap between cards
      wrap="wrap"
      p="6"
    >
      {['Design', 'Development', 'Marketing'].map((title) => (
        <Box
          key={title}
          flexGrow="1"
          style={{
            flexBasis: 'clamp(250px, 30vw, 350px)', // Fluid card width
            minWidth: 0, // Prevent flex overflow
          }}
        >
          <Card>
            <Flex direction="column" gap="3">
              <Heading size="6" weight="bold">
                {title}
              </Heading>
              <Text size="3" color="gray">
                This card has fluid width and spacing that adapts to the
                viewport size.
              </Text>
            </Flex>
          </Card>
        </Box>
      ))}
    </Flex>
  );
};

/**
 * Two-Column Layout with Fluid Spacing
 */
export const FluidTwoColumn: React.FC = () => {
  return (
    <Flex
      direction={{ initial: 'column', md: 'row' }}
      gap="6"
      p="6"
    >
      <Box flexGrow="2" p="5" style={{ background: 'var(--gray-2)', borderRadius: '8px' }}>
        <Flex direction="column" gap="4">
          <Heading size="6" weight="bold">
            Main Content
          </Heading>
          <Text size="3">
            This layout uses fluid spacing tokens. The gap between columns and
            all padding scales smoothly as you resize the browser window.
          </Text>
          <Text size="3" color="gray">
            Notice how everything flows naturally from mobile to desktop without
            any jarring breakpoint jumps.
          </Text>
        </Flex>
      </Box>

      <Box flexGrow="1" p="5" style={{ background: 'var(--gray-2)', borderRadius: '8px' }}>
        <Flex direction="column" gap="3">
          <Heading size="5" weight="bold">
            Sidebar
          </Heading>
          <Text size="2" color="gray">
            Secondary content with its own fluid spacing.
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

/**
 * Nested Flex with Multiple Fluid Gaps
 */
export const FluidNested: React.FC = () => {
  return (
    <Flex direction="column" gap="7" p="6">
      <Heading size="7" weight="bold">
        Nested Layouts
      </Heading>

      <Flex direction="column" gap="5">
        <Card>
          <Flex direction="column" gap="4">
            <Heading size="5">Section 1</Heading>
            <Flex gap="3" wrap="wrap">
              {[1, 2, 3, 4].map((i) => (
                <Box
                  key={i}
                  p="4"
                  style={{
                    background: 'var(--accent-3)',
                    borderRadius: '6px',
                    flexBasis: 'clamp(150px, 20vw, 200px)',
                  }}
                >
                  <Text size="2" weight="bold">
                    Item {i}
                  </Text>
                </Box>
              ))}
            </Flex>
          </Flex>
        </Card>

        <Card>
          <Flex direction="column" gap="4">
            <Heading size="5">Section 2</Heading>
            <Flex gap="3" direction={{ initial: 'column', sm: 'row' }}>
              <Box flexGrow="1" p="3" style={{ background: 'var(--gray-3)', borderRadius: '6px' }}>
                <Text size="2">Nested item A</Text>
              </Box>
              <Box flexGrow="1" p="3" style={{ background: 'var(--gray-3)', borderRadius: '6px' }}>
                <Text size="2">Nested item B</Text>
              </Box>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </Flex>
  );
};

/**
 * Complete Page Layout Example
 */
export const FluidPageLayout: React.FC = () => {
  return (
    <Flex direction="column" gap="8">
      {/* Header */}
      <Flex
        align="center"
        justify="between"
        p={{ initial: '4', md: '5' }}
        style={{ background: 'var(--gray-2)', borderBottom: '1px solid var(--gray-6)' }}
      >
        <Heading size={{ initial: '5', md: '6' }} weight="bold">
          Brand
        </Heading>
        <Flex gap={{ initial: '3', md: '5' }}>
          <Text size={{ initial: '2', md: '3' }}>About</Text>
          <Text size={{ initial: '2', md: '3' }}>Features</Text>
          <Text size={{ initial: '2', md: '3' }}>Contact</Text>
        </Flex>
      </Flex>

      {/* Main Content */}
      <Container size="4">
        <Flex direction="column" gap="7">
          {/* Hero */}
          <Flex direction="column" gap="5" align="center">
            <Heading size="9" align="center" weight="bold">
              Beautiful Fluid Layouts
            </Heading>
            <Text size="4" align="center" color="gray">
              Every element on this page scales smoothly with the viewport
            </Text>
          </Flex>

          {/* Features Grid */}
          <Flex gap="5" wrap="wrap">
            {['Fast', 'Responsive', 'Accessible'].map((feature) => (
              <Box
                key={feature}
                flexGrow="1"
                style={{ flexBasis: 'clamp(200px, 28vw, 300px)' }}
              >
                <Card>
                  <Flex direction="column" gap="3" p="2">
                    <Heading size="5" weight="bold">
                      {feature}
                    </Heading>
                    <Text size="2" color="gray">
                      Built with fluid spacing for a seamless experience across
                      all devices.
                    </Text>
                  </Flex>
                </Card>
              </Box>
            ))}
          </Flex>

          {/* Content Section */}
          <Flex direction="column" gap="5">
            <Heading size="7" weight="bold">
              How It Works
            </Heading>
            <Text size="3">
              This entire layout uses Radix UI Themes with overridden CSS custom
              properties. Every <code>gap</code>, <code>p</code> (padding), and{' '}
              <code>m</code> (margin) prop automatically uses fluid spacing.
            </Text>
            <Flex
              direction={{ initial: 'column', md: 'row' }}
              gap="6"
            >
              <Box flexGrow="1">
                <Card>
                  <Flex direction="column" gap="3">
                    <Heading size="4">Step 1</Heading>
                    <Text size="2">
                      Override Radix CSS tokens with clamp() values
                    </Text>
                  </Flex>
                </Card>
              </Box>
              <Box flexGrow="1">
                <Card>
                  <Flex direction="column" gap="3">
                    <Heading size="4">Step 2</Heading>
                    <Text size="2">
                      Use Radix components normally - spacing is automatic!
                    </Text>
                  </Flex>
                </Card>
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Container>

      {/* Footer */}
      <Flex
        justify="center"
        p={{ initial: '6', md: '8' }}
        style={{ background: 'var(--gray-2)', borderTop: '1px solid var(--gray-6)' }}
      >
        <Text size="2" color="gray">
          Resize your browser to see the fluid effect
        </Text>
      </Flex>
    </Flex>
  );
};

/**
 * Main FluidLayout Showcase Component
 */
export const FluidLayoutShowcase: React.FC = () => {
  return (
    <Flex direction="column" gap="9">
      <Container size="4">
        <Flex direction="column" gap="5" py="6">
          <Heading size="8" weight="bold">
            Fluid Layout Showcase
          </Heading>
          <Text size="4" color="gray">
            All examples below use Radix Flex with fluid spacing tokens. Resize
            your browser to see everything scale smoothly!
          </Text>
        </Flex>
      </Container>

      <Flex direction="column" gap="8">
        <Box>
          <Container size="4" mb="4">
            <Text size="2" weight="bold" color="gray">
              HERO SECTION
            </Text>
          </Container>
          <FluidHero />
        </Box>

        <Box>
          <Container size="4" mb="4">
            <Text size="2" weight="bold" color="gray">
              CARD GRID
            </Text>
          </Container>
          <Container size="4">
            <FluidCardGrid />
          </Container>
        </Box>

        <Box>
          <Container size="4" mb="4">
            <Text size="2" weight="bold" color="gray">
              TWO-COLUMN LAYOUT
            </Text>
          </Container>
          <Container size="4">
            <FluidTwoColumn />
          </Container>
        </Box>

        <Box>
          <Container size="4" mb="4">
            <Text size="2" weight="bold" color="gray">
              NESTED LAYOUTS
            </Text>
          </Container>
          <Container size="4">
            <FluidNested />
          </Container>
        </Box>
      </Flex>
    </Flex>
  );
};

export default FluidLayoutShowcase;
