/**
 * Notion-style Card Component
 *
 * Demonstrates multiple ways to use CSS variables with transparency:
 * 1. Pre-defined transparency variables (best performance)
 * 2. Tailwind opacity modifiers (more flexible)
 * 3. Direct RGBA variables
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Flex from "@/components/design_system/Layout/Flex";

const cardVariants = cva(
  // Base card styles - minimal and clean like Notion
  "group rounded-lg transition-all duration-200",
  {
    variants: {
      variant: {
        // Default Notion card - subtle border, hover effect
        default:
          "border border-[var(--color-border-subtle)] bg-[var(--color-bg-base)] hover:bg-[var(--color-bg-hover)] hover:shadow-sm",

        // Elevated card - with shadow (used in modals, popovers)
        elevated:
          "border border-[var(--color-border)] bg-[var(--color-bg-base)] shadow-md shadow-[var(--color-shadow-md)]",

        // Ghost card - no border, just hover effect
        ghost:
          "bg-transparent hover:bg-[var(--color-hover-subtle)]",

        // Colored accent cards (using opacity modifiers)
        "accent-blue":
          "border border-[var(--color-accent-blue-bg)] bg-[var(--color-accent-blue-bg)]/20 hover:bg-[var(--color-accent-blue-bg)]/30",
        "accent-purple":
          "border border-[var(--color-accent-purple-bg)] bg-[var(--color-accent-purple-bg)]/20 hover:bg-[var(--color-accent-purple-bg)]/30",
        "accent-green":
          "border border-[var(--color-accent-green-bg)] bg-[var(--color-accent-green-bg)]/20 hover:bg-[var(--color-accent-green-bg)]/30",
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        default: "p-4",
        lg: "p-6",
      },
      interactive: {
        true: "cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
      interactive: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, ...props }, ref) => {
    return (
      <div
        className={cn(cardVariants({ variant, padding, interactive, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

// Card Header with icon and actions (Notion pattern)
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { icon?: React.ReactNode }
>(({ className, icon, children, ...props }, ref) => (
  <Flex
    ref={ref}
    align="start"
    gap="3"
    mb="2"
    className={className}
    {...props}
  >
    {icon && (
      <Flex align="center" justify="center" className="w-8 h-8 rounded bg-[var(--color-bg-muted)]">
        {icon}
      </Flex>
    )}
    <Flex grow="1" className="min-w-0">{children}</Flex>
  </Flex>
));
CardHeader.displayName = "CardHeader";

// Card Title (Notion style)
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-sm font-semibold leading-none tracking-tight",
      "text-[var(--color-text-primary)]",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

// Card Description (with different opacity levels)
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    emphasis?: "high" | "medium" | "low";
  }
>(({ className, emphasis = "medium", ...props }, ref) => {
  const emphasisClasses = {
    high: "text-[var(--color-text-emphasis-high)]",
    medium: "text-[var(--color-text-emphasis-medium)]", // Pre-defined 70% opacity
    low: "text-[var(--color-text-emphasis-low)]", // Pre-defined 50% opacity
  };

  return (
    <p
      ref={ref}
      className={cn(
        "text-sm leading-relaxed",
        emphasisClasses[emphasis],
        className
      )}
      {...props}
    />
  );
});
CardDescription.displayName = "CardDescription";

// Card Content
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-sm", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Card Footer (with hover actions - Notion pattern)
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <Flex
    ref={ref}
    align="center"
    gap="2"
    mt="3"
    pt="3"
    className={cn(
      "border-t border-[var(--color-divider)]",
      // Actions appear on hover (Notion pattern)
      "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};

/**
 * USAGE EXAMPLES:
 *
 * // Basic card (default Notion style)
 * <Card>
 *   <CardHeader icon="📄">
 *     <CardTitle>Document Title</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     <CardDescription>
 *       This is the document description
 *     </CardDescription>
 *   </CardContent>
 * </Card>
 *
 * // Interactive card with different text emphasis
 * <Card variant="default" interactive>
 *   <CardTitle>Feature Request</CardTitle>
 *   <CardDescription emphasis="high">
 *     High priority description
 *   </CardDescription>
 *   <CardDescription emphasis="low">
 *     Additional info with lower emphasis
 *   </CardDescription>
 * </Card>
 *
 * // Colored accent card using opacity
 * <Card variant="accent-blue">
 *   <CardTitle>Design System</CardTitle>
 *   <CardDescription>Tagged with blue</CardDescription>
 * </Card>
 *
 * // Card with hover actions (Notion pattern)
 * <Card interactive>
 *   <CardHeader icon="✨">
 *     <CardTitle>Notion AI</CardTitle>
 *   </CardHeader>
 *   <CardContent>
 *     <CardDescription>
 *       AI-powered writing assistant
 *     </CardDescription>
 *   </CardContent>
 *   <CardFooter>
 *     <button>Edit</button>
 *     <button>Delete</button>
 *   </CardFooter>
 * </Card>
 *
 * // Custom opacity using Tailwind syntax
 * <Card className="bg-[var(--palette-purple-bg)]/30 border-[var(--palette-purple-text)]/20">
 *   <CardTitle className="text-[var(--palette-purple-text)]">
 *     Custom Purple Card
 *   </CardTitle>
 * </Card>
 *
 * // Ghost card with custom hover
 * <Card
 *   variant="ghost"
 *   className="hover:bg-[var(--color-hover-medium)]"
 * >
 *   <CardTitle>Hover me</CardTitle>
 * </Card>
 */
