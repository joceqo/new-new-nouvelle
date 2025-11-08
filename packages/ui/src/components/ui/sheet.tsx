/**
 * Notion-style Sheet (Slide-in panel)
 * Used for Inbox and other side panels
 */

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: "left" | "right";
}

export function Sheet({
  open,
  onOpenChange,
  children,
  side = "right",
}: SheetProps) {
  // Close on Escape
  React.useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onOpenChange]);

  // Prevent body scroll
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <SheetContext.Provider value={{ onOpenChange, side }}>
      {children}
    </SheetContext.Provider>
  );
}

const SheetContext = React.createContext<{
  onOpenChange: (open: boolean) => void;
  side: "left" | "right";
}>({
  onOpenChange: () => {},
  side: "right",
});

export interface SheetOverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const SheetOverlay = React.forwardRef<HTMLDivElement, SheetOverlayProps>(
  ({ className, ...props }, ref) => {
    const { onOpenChange } = React.useContext(SheetContext);

    return (
      <div
        ref={ref}
        className={cn(
          "fixed inset-0 z-50 bg-[var(--color-overlay-light)] backdrop-blur-sm",
          "animate-in fade-in-0 duration-200",
          className
        )}
        onClick={() => onOpenChange(false)}
        {...props}
      />
    );
  }
);
SheetOverlay.displayName = "SheetOverlay";

export interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ children, className, ...props }, ref) => {
    const { onOpenChange, side } = React.useContext(SheetContext);

    return (
      <>
        <SheetOverlay />
        <div
          ref={ref}
          className={cn(
            "fixed z-50 h-full w-full max-w-md gap-4 bg-[var(--color-bg-base)] p-6 shadow-2xl",
            "border-[var(--color-border)]",
            side === "right" && "right-0 top-0 border-l animate-in slide-in-from-right duration-200",
            side === "left" && "left-0 top-0 border-r animate-in slide-in-from-left duration-200",
            className
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded p-1 text-[var(--color-icon-default)] hover:bg-[var(--color-hover-subtle)] hover:text-[var(--color-icon-hover)] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[var(--palette-blue-text)] focus:ring-offset-1"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </div>
      </>
    );
  }
);
SheetContent.displayName = "SheetContent";

export interface SheetHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SheetHeader = React.forwardRef<HTMLDivElement, SheetHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2 text-left pb-4", className)}
      {...props}
    >
      {children}
    </div>
  )
);
SheetHeader.displayName = "SheetHeader";

export interface SheetTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export const SheetTitle = React.forwardRef<HTMLHeadingElement, SheetTitleProps>(
  ({ children, className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn(
        "text-lg font-semibold text-[var(--color-text-primary)]",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
);
SheetTitle.displayName = "SheetTitle";

export interface SheetDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  SheetDescriptionProps
>(({ children, className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[var(--color-text-emphasis-medium)]", className)}
    {...props}
  >
    {children}
  </p>
));
SheetDescription.displayName = "SheetDescription";

export interface SheetBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SheetBody = React.forwardRef<HTMLDivElement, SheetBodyProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 overflow-y-auto", className)}
      {...props}
    >
      {children}
    </div>
  )
);
SheetBody.displayName = "SheetBody";
