/**
 * Notion-style Command Palette
 * Opens with Cmd+K or click
 */

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface CommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Command({ open, onOpenChange, children }: CommandProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

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

  // Focus input when opened
  React.useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

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
    <CommandContext.Provider value={{ onOpenChange, inputRef }}>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-[var(--color-overlay-light)] backdrop-blur-sm animate-in fade-in-0 duration-150"
        onClick={() => onOpenChange(false)}
      />

      {/* Command Dialog */}
      <div className="fixed left-1/2 top-[20%] z-50 -translate-x-1/2 w-full max-w-2xl">
        <div
          className="bg-[var(--color-bg-base)] border border-[var(--color-border)] rounded-lg shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </CommandContext.Provider>
  );
}

const CommandContext = React.createContext<{
  onOpenChange: (open: boolean) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}>({
  onOpenChange: () => {},
  inputRef: { current: null },
});

export interface CommandInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const CommandInput = React.forwardRef<
  HTMLInputElement,
  CommandInputProps
>(({ className, ...props }, ref) => {
  const { inputRef } = React.useContext(CommandContext);

  const combinedRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      if (inputRef) {
        (inputRef as React.MutableRefObject<HTMLInputElement | null>).current =
          node;
      }
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }
    },
    [ref, inputRef]
  );

  return (
    <div className="flex items-center border-b border-[var(--color-divider)] px-4 py-3">
      <Search className="mr-2 h-5 w-5 shrink-0 text-[var(--color-icon-default)]" />
      <input
        ref={combinedRef}
        className={cn(
          "flex h-10 w-full rounded-md bg-transparent text-sm outline-none",
          "text-[var(--color-text-primary)]",
          "placeholder:text-[var(--color-text-muted)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    </div>
  );
});
CommandInput.displayName = "CommandInput";

export interface CommandListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("max-h-[400px] overflow-y-auto overflow-x-hidden p-2", className)}
      {...props}
    >
      {children}
    </div>
  )
);
CommandList.displayName = "CommandList";

export interface CommandEmptyProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "py-12 text-center text-sm text-[var(--color-text-emphasis-low)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
CommandEmpty.displayName = "CommandEmpty";

export interface CommandGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
  children: React.ReactNode;
}

export const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, children, ...props }, ref) => (
    <div ref={ref} className={cn("overflow-hidden", className)} {...props}>
      {heading && (
        <div className="px-2 py-1.5 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          {heading}
        </div>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  )
);
CommandGroup.displayName = "CommandGroup";

export interface CommandItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onSelect?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, onSelect, disabled, children, ...props }, ref) => {
    const { onOpenChange } = React.useContext(CommandContext);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex cursor-pointer select-none items-center gap-3 rounded-md px-3 py-2 text-sm outline-none",
          "text-[var(--color-text-primary)]",
          "hover:bg-[var(--color-hover-subtle)]",
          "transition-colors duration-150",
          disabled && "pointer-events-none opacity-50",
          className
        )}
        onClick={() => {
          if (!disabled) {
            onSelect?.();
            onOpenChange(false);
          }
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CommandItem.displayName = "CommandItem";

export interface CommandSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  CommandSeparatorProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-2 h-px bg-[var(--color-divider)]", className)}
    role="separator"
    {...props}
  />
));
CommandSeparator.displayName = "CommandSeparator";

export interface CommandShortcutProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export const CommandShortcut = React.forwardRef<
  HTMLSpanElement,
  CommandShortcutProps
>(({ className, children, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "ml-auto text-xs tracking-widest text-[var(--color-text-muted)]",
      className
    )}
    {...props}
  >
    {children}
  </span>
));
CommandShortcut.displayName = "CommandShortcut";
