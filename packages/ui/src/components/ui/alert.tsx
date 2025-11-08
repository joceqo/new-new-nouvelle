import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-bg-base)] border-[var(--color-border-subtle)] text-[var(--color-text-primary)] [&>svg]:text-[var(--color-icon-default)]",
        destructive:
          "bg-[var(--palette-red-bg)] border-[var(--palette-red-text)]/20 text-[var(--palette-red-text)] [&>svg]:text-[var(--palette-red-text)]",
        success:
          "bg-[var(--palette-green-bg)] border-[var(--palette-green-text)]/20 text-[var(--palette-green-text)] [&>svg]:text-[var(--palette-green-text)]",
        warning:
          "bg-[var(--palette-yellow-bg)] border-[var(--palette-yellow-text)]/20 text-[var(--palette-yellow-text)] [&>svg]:text-[var(--palette-yellow-text)]",
        info:
          "bg-[var(--palette-blue-bg)] border-[var(--palette-blue-text)]/20 text-[var(--palette-blue-text)] [&>svg]:text-[var(--palette-blue-text)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 text-sm font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
