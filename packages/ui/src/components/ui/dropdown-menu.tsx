import * as React from "react";
import { cn } from "@/lib/utils";

// Simple dropdown menu implementation
// Note: For production, consider using @radix-ui/react-dropdown-menu

export interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DropdownMenu({ children, open, onOpenChange }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement>(null);
  const controlled = open !== undefined;
  const isOpenState = controlled ? open : isOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!controlled) {
      setIsOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <DropdownMenuContext.Provider value={{ isOpen: isOpenState, setOpen: handleOpenChange, triggerRef }}>
      {children}
    </DropdownMenuContext.Provider>
  );
}

const DropdownMenuContext = React.createContext<{
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement> | null;
}>({
  isOpen: false,
  setOpen: () => {},
  triggerRef: null,
});

export interface DropdownMenuTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ children, className, asChild, ...props }, ref) => {
    const { setOpen, isOpen, triggerRef } = React.useContext(DropdownMenuContext);

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(!isOpen);
    };

    const combinedRef = React.useCallback(
      (node: HTMLElement | null) => {
        // Update context ref
        if (triggerRef) {
          (triggerRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
        // Update forwarded ref
        if (typeof ref === 'function') {
          ref(node as any);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLElement | null>).current = node as any;
        }
      },
      [ref, triggerRef]
    );

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        onClick: handleClick,
        ref: combinedRef,
        ...props,
      });
    }

    return (
      <button
        ref={combinedRef as any}
        type="button"
        onClick={handleClick}
        className={cn("outline-none", className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  collisionPadding?: number;
  autoFlip?: boolean;
}

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ children, className, align = "start", side = "bottom", sideOffset = 4, collisionPadding = 8, autoFlip = true, ...props }, ref) => {
    const { isOpen, setOpen, triggerRef } = React.useContext(DropdownMenuContext);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [position, setPosition] = React.useState<{ top?: number; left?: number; right?: number }>({});

    // Calculate position based on trigger
    React.useLayoutEffect(() => {
      if (!isOpen || !triggerRef?.current || !contentRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      const newPosition: { top?: number; left?: number; right?: number } = {};

      // Calculate initial vertical position based on side
      if (side === "bottom") {
        newPosition.top = triggerRect.bottom + sideOffset;
      } else if (side === "top") {
        newPosition.top = triggerRect.top - contentRect.height - sideOffset;
      }

      // Calculate initial horizontal position based on align
      if (align === "start") {
        newPosition.left = triggerRect.left;
      } else if (align === "end") {
        newPosition.right = window.innerWidth - triggerRect.right;
      } else if (align === "center") {
        newPosition.left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
      }

      // Apply collision detection if autoFlip is enabled
      if (autoFlip) {
        // Check horizontal overflow
        if (align === "end") {
          // Calculate where the right edge would be
          const rightEdge = window.innerWidth - (newPosition.right || 0);
          const leftEdge = rightEdge - contentRect.width;

          // If overflows left, flip to start alignment
          if (leftEdge < collisionPadding) {
            newPosition.left = triggerRect.left;
            delete newPosition.right;
          }
        } else if (align === "start") {
          // Check if overflows right
          const rightEdge = (newPosition.left || 0) + contentRect.width;

          // If overflows right, flip to end alignment
          if (rightEdge > window.innerWidth - collisionPadding) {
            newPosition.right = window.innerWidth - triggerRect.right;
            delete newPosition.left;
          }
        } else if (align === "center") {
          const leftEdge = newPosition.left || 0;
          const rightEdge = leftEdge + contentRect.width;

          // If overflows either side, prefer start alignment
          if (leftEdge < collisionPadding || rightEdge > window.innerWidth - collisionPadding) {
            newPosition.left = Math.max(collisionPadding, triggerRect.left);
          }
        }

        // Check vertical overflow
        const bottomEdge = (newPosition.top || 0) + contentRect.height;
        const topEdge = newPosition.top || 0;

        if (side === "bottom" && bottomEdge > window.innerHeight - collisionPadding) {
          // Try flipping to top
          const topPosition = triggerRect.top - contentRect.height - sideOffset;
          if (topPosition >= collisionPadding) {
            newPosition.top = topPosition;
          } else {
            // Keep bottom but adjust to fit
            newPosition.top = Math.max(collisionPadding, window.innerHeight - contentRect.height - collisionPadding);
          }
        } else if (side === "top" && topEdge < collisionPadding) {
          // Try flipping to bottom
          const bottomPosition = triggerRect.bottom + sideOffset;
          if (bottomPosition + contentRect.height <= window.innerHeight - collisionPadding) {
            newPosition.top = bottomPosition;
          } else {
            // Keep top but adjust to fit
            newPosition.top = collisionPadding;
          }
        }

        // Apply collision padding to edges
        if (newPosition.left !== undefined) {
          newPosition.left = Math.max(collisionPadding, Math.min(newPosition.left, window.innerWidth - contentRect.width - collisionPadding));
        }
        if (newPosition.top !== undefined) {
          newPosition.top = Math.max(collisionPadding, Math.min(newPosition.top, window.innerHeight - contentRect.height - collisionPadding));
        }
      }

      setPosition(newPosition);
    }, [isOpen, align, side, sideOffset, collisionPadding, autoFlip, triggerRef]);

    // Close when clicking outside
    React.useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;

        // Don't close if clicking the trigger or inside the content
        if (
          (triggerRef?.current && triggerRef.current.contains(target)) ||
          (contentRef.current && contentRef.current.contains(target))
        ) {
          return;
        }

        setOpen(false);
      };

      // Use a slight delay to avoid immediate closure when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, setOpen, triggerRef]);

    // Close on Escape
    React.useEffect(() => {
      if (!isOpen) return;

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setOpen(false);
        }
      };

      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, setOpen]);

    if (!isOpen) return null;

    return (
      <div
        ref={(node) => {
          contentRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        style={{
          position: "fixed",
          top: position.top,
          left: position.left,
          right: position.right,
        }}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-base)] p-2 shadow-md",
          "animate-in fade-in-0 zoom-in-95 duration-150",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

export interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
}

export const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ children, className, onSelect, disabled, ...props }, ref) => {
    const { setOpen } = React.useContext(DropdownMenuContext);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex cursor-pointer select-none items-center rounded-md px-2 py-1.5 text-sm outline-none",
          "text-[var(--color-text-primary)]",
          "hover:bg-[var(--color-hover-subtle)] focus:bg-[var(--color-hover-subtle)]",
          "transition-colors duration-150",
          disabled && "pointer-events-none opacity-50",
          className
        )}
        onClick={() => {
          if (!disabled) {
            onSelect?.();
            setOpen(false);
          }
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DropdownMenuItem.displayName = "DropdownMenuItem";

export const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("my-1 h-px bg-[var(--color-divider)]", className)}
      {...props}
    />
  )
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

export interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-2 py-1.5 text-xs font-semibold text-[var(--color-text-muted)]", className)}
      {...props}
    >
      {children}
    </div>
  )
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";
