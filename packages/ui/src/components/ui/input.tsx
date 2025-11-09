import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md px-3 py-2 text-sm",
          "text-[var(--color-text-primary)]",
          "placeholder:text-[var(--color-text-muted)]",
          "bg-transparent",
          "border border-transparent",
          "hover:bg-[var(--color-bg-hover)]",
          "focus:bg-[var(--color-bg-base)]",
          "focus:border-[var(--color-border)]",
          "focus:outline-none",
          "transition-all duration-150",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[var(--color-text-primary)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
