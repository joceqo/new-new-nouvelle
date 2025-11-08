/**
 * Notion-style Button Component
 *
 * This is an example showing how to use CSS variables with Tailwind's opacity
 * syntax and pre-defined transparency tokens.
 *
 * Compare this to button.tsx to see the differences!
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const notionButtonVariants = cva(
  // Base styles - very subtle and minimal like Notion
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--palette-blue-text)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Notion's PRIMARY button - rare, only for critical CTAs
        // Uses direct variable reference + Tailwind opacity modifier
        default:
          "bg-[var(--palette-blue-text)] text-white hover:bg-[var(--palette-blue-text)]/90 active:bg-[var(--palette-blue-text)]/80 shadow-sm",

        // Notion's MOST COMMON button - subtle ghost style
        // Uses pre-defined hover variables for better performance
        ghost:
          "text-[var(--color-text-primary)] hover:bg-[var(--color-hover-subtle)] active:bg-[var(--color-hover-medium)]",

        // Alternative ghost using Tailwind opacity (more flexible but slightly slower)
        "ghost-alt":
          "text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]/50 active:bg-[var(--color-bg-hover)]/80",

        // DESTRUCTIVE button - for delete, remove actions
        destructive:
          "bg-[var(--palette-red-text)] text-white hover:bg-[var(--palette-red-text)]/90 active:bg-[var(--palette-red-text)]/80 shadow-sm",

        // OUTLINE button - subtle border (rare in Notion)
        outline:
          "border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-hover-subtle)] active:bg-[var(--color-hover-medium)]",

        // SECONDARY button - colored background
        secondary:
          "bg-[var(--color-bg-muted)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-active)] active:bg-[var(--color-bg-active)]/80",

        // COLORED ACCENT buttons - using color palette
        blue: "bg-[var(--color-accent-blue-bg)] text-[var(--color-accent-blue-text)] hover:bg-[var(--color-accent-blue-bg)]/80 active:bg-[var(--color-accent-blue-bg)]/60",
        purple: "bg-[var(--color-accent-purple-bg)] text-[var(--color-accent-purple-text)] hover:bg-[var(--color-accent-purple-bg)]/80 active:bg-[var(--color-accent-purple-bg)]/60",
        green: "bg-[var(--color-accent-green-bg)] text-[var(--color-accent-green-text)] hover:bg-[var(--color-accent-green-bg)]/80 active:bg-[var(--color-accent-green-bg)]/60",
      },
      size: {
        default: "h-8 px-3 py-1.5 text-sm rounded-md", // Notion's primary size
        sm: "h-7 px-2 py-1 text-xs rounded",
        lg: "h-10 px-4 py-2 text-base rounded-md",
        icon: "h-7 w-7 rounded-md", // Icon-only buttons
      },
    },
    defaultVariants: {
      variant: "ghost", // Ghost is Notion's default!
      size: "default",
    },
  }
);

export interface NotionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof notionButtonVariants> {
  asChild?: boolean;
}

const NotionButton = React.forwardRef<HTMLButtonElement, NotionButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(notionButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
NotionButton.displayName = "NotionButton";

export { NotionButton, notionButtonVariants };

/**
 * USAGE EXAMPLES:
 *
 * // Default ghost button (most common in Notion)
 * <NotionButton>Click me</NotionButton>
 *
 * // Primary CTA button
 * <NotionButton variant="default">Save</NotionButton>
 *
 * // Destructive action
 * <NotionButton variant="destructive">Delete</NotionButton>
 *
 * // Icon-only button
 * <NotionButton variant="ghost" size="icon">
 *   <Search className="h-4 w-4" />
 * </NotionButton>
 *
 * // Colored accent button
 * <NotionButton variant="blue">Tag: Design</NotionButton>
 *
 * // With custom opacity (using Tailwind syntax)
 * <NotionButton className="bg-[var(--palette-orange-bg)]/50">
 *   Custom
 * </NotionButton>
 */
