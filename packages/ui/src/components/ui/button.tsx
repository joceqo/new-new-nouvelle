import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--palette-blue-text)] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Notion's most common button - subtle ghost (NOW DEFAULT!)
        ghost:
          "text-[var(--color-text-primary)] hover:bg-[var(--color-hover-subtle)] active:bg-[var(--color-hover-medium)]",

        // Notion's primary blue button (rare, only for CTAs)
        default:
          "bg-[var(--palette-blue-text)] text-white hover:bg-[var(--palette-blue-text)]/90 active:bg-[var(--palette-blue-text)]/80 shadow-sm",

        // Destructive action (delete, remove)
        destructive:
          "bg-[var(--palette-red-text)] text-white hover:bg-[var(--palette-red-text)]/90 active:bg-[var(--palette-red-text)]/80 shadow-sm",

        // Subtle outline (rare in Notion)
        outline:
          "border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-hover-subtle)] active:bg-[var(--color-hover-medium)]",

        // Secondary colored button
        secondary:
          "bg-[var(--color-bg-muted)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-active)] active:bg-[var(--color-bg-active)]/80",

        // Link style
        link: "text-[var(--palette-blue-text)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-3 py-1.5",
        sm: "h-7 px-2 py-1 text-xs",
        lg: "h-10 px-4 py-2",
        icon: "h-7 w-7",
      },
    },
    defaultVariants: {
      variant: "ghost", // Ghost is now the default!
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
