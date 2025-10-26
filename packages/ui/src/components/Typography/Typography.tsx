import React from 'react';
import { Heading, Text, Flex, type HeadingProps, type TextProps } from '@radix-ui/themes';

/**
 * Typography component demonstrating fluid typography with Radix UI Themes
 *
 * This component uses the overridden CSS tokens from fluid-typography.css
 * to create responsive, fluid typography that scales smoothly across viewport sizes.
 */

export interface TypographyProps {
  /**
   * The variant of typography to display
   */
  variant?: 'heading' | 'text' | 'display';
  /**
   * Size scale (1-9 for Radix tokens)
   */
  size?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
  /**
   * Content to display
   */
  children: React.ReactNode;
  /**
   * Custom className for additional styling
   */
  className?: string;
  /**
   * Weight of the text
   */
  weight?: TextProps['weight'];
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'text',
  size = '3',
  children,
  className,
  weight = 'regular',
}) => {
  if (variant === 'heading' || variant === 'display') {
    return (
      <Heading
        size={size as HeadingProps['size']}
        weight={weight as HeadingProps['weight']}
        className={className}
      >
        {children}
      </Heading>
    );
  }

  return (
    <Text
      size={size as TextProps['size']}
      weight={weight}
      className={className}
    >
      {children}
    </Text>
  );
};

/**
 * TypographyShowcase component for demonstrating all typography sizes
 */
export const TypographyShowcase: React.FC = () => {
  return (
    <Flex direction="column" gap="6" className="fluid-container">
      <Flex direction="column" gap="4">
        <Heading size="8" weight="bold">
          Fluid Typography Showcase
        </Heading>
        <Text size="4" color="gray">
          These examples demonstrate fluid typography that scales smoothly
          between viewport sizes using CSS clamp().
        </Text>
      </Flex>

      {/* Headings */}
      <Flex direction="column" gap="3">
        <Text size="2" weight="bold" color="gray">
          HEADINGS (USING RADIX TOKENS)
        </Text>
        <Heading size="9">Heading Size 9 - Display XL</Heading>
        <Heading size="8">Heading Size 8 - Display Large</Heading>
        <Heading size="7">Heading Size 7 - Heading XL</Heading>
        <Heading size="6">Heading Size 6 - Heading Large</Heading>
        <Heading size="5">Heading Size 5 - Heading Medium</Heading>
        <Heading size="4">Heading Size 4 - Heading Small</Heading>
      </Flex>

      {/* Text */}
      <Flex direction="column" gap="3">
        <Text size="2" weight="bold" color="gray">
          TEXT (USING RADIX TOKENS)
        </Text>
        <Text size="4">
          Text Size 4 - Large body text. Perfect for introductory paragraphs
          or emphasis sections.
        </Text>
        <Text size="3">
          Text Size 3 - Regular body text. This is the default size for most
          content and provides excellent readability.
        </Text>
        <Text size="2">
          Text Size 2 - Small body text. Useful for secondary information or
          captions.
        </Text>
        <Text size="1">
          Text Size 1 - Extra small text. Best for labels or fine print.
        </Text>
      </Flex>

      {/* Custom Fluid Classes */}
      <Flex direction="column" gap="3">
        <Text size="2" weight="bold" color="gray">
          CUSTOM FLUID CLASSES
        </Text>
        <div className="fluid-display">Display - Hero Text</div>
        <div className="fluid-heading-xl">Heading XL - Major Headlines</div>
        <div className="fluid-heading-lg">Heading Large - Section Titles</div>
        <div className="fluid-heading-md">Heading Medium - Subsections</div>
        <div className="fluid-heading-sm">Heading Small - Card Titles</div>
        <div className="fluid-text-xl">Text XL - Large Content</div>
        <div className="fluid-text-lg">Text Large - Emphasis</div>
        <div className="fluid-text-base">Text Base - Body Copy</div>
        <div className="fluid-text-sm">Text Small - Secondary Content</div>
        <div className="fluid-text-xs">Text Extra Small - Captions</div>
      </Flex>

      {/* Responsive Example */}
      <Flex direction="column" gap="3">
        <Text size="2" weight="bold" color="gray">
          RESIZE YOUR BROWSER TO SEE THE FLUID EFFECT
        </Text>
        <Text size="3" color="gray">
          All typography on this page scales smoothly as you resize the browser
          window, with no sudden jumps at breakpoints. This creates a more
          natural, responsive experience across all device sizes.
        </Text>
      </Flex>
    </Flex>
  );
};

export default Typography;
