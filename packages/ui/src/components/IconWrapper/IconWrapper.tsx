import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * IconWrapper component for Lucide icons
 *
 * Wraps Lucide icons with proper sizing and hover area support.
 *
 * Key principle: When using interactive mode with padding, the container size
 * will be icon size + padding, ensuring hover area is always >= icon visual size.
 */

type IconSize = "xs" | "sm" | "md" | "lg";
type IconVariant = "default" | "button";

type BaseIconWrapperProps = {
  /**
   * The Lucide icon component to render
   */
  icon: LucideIcon;

  /**
   * Predefined icon size
   * - xs: 12px
   * - sm: 16px
   * - md: 20px
   * - lg: 24px
   *
   * If not specified, icon will scale with font-size (size-[1em])
   */
  size?: IconSize;

  /**
   * Enable interactive mode with proper hover area.
   * When true, adds padding to create a hover area larger than the icon.
   * Container will be sized to accommodate icon + padding.
   *
   * @default false
   */
  interactive?: boolean;

  /**
   * Visual variant
   * - default: Plain icon wrapper
   * - button: Styled as a button with hover/focus states
   *
   * @default 'default'
   */
  variant?: IconVariant;
};

export type IconWrapperProps = BaseIconWrapperProps &
  (
    | (Omit<React.HTMLAttributes<HTMLDivElement>, "size"> & {
        variant?: "default";
      })
    | (Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size"> & {
        variant: "button";
      })
  );

const sizeClasses: Record<IconSize, { icon: string; container?: string }> = {
  xs: { icon: "h-3 w-3", container: "p-1" }, // 12px icon + 4px padding = 20px container
  sm: { icon: "h-4 w-4", container: "p-1" }, // 16px icon + 4px padding = 24px container
  md: { icon: "h-5 w-5", container: "p-1.5" }, // 20px icon + 6px padding = 32px container
  lg: { icon: "h-6 w-6", container: "p-1.5" }, // 24px icon + 6px padding = 36px container
};

export const IconWrapper: React.FC<IconWrapperProps> = ({
  icon: Icon,
  size,
  interactive = false,
  variant = "default",
  className = "",
  ...props
}) => {
  // Determine icon and container classes based on size and interactive props
  const iconClassName = size ? sizeClasses[size].icon : "size-[1em]";

  const isButton = variant === "button";

  const containerClassName = cn(
    // Add padding for interactive mode or button variant
    (interactive || isButton) && size && sizeClasses[size].container,
    // Flexbox to center icon within container
    (interactive || isButton) && "inline-flex items-center justify-center",
    // Transition for smooth hover effects
    (interactive || isButton) && "transition-colors duration-150",
    // Button-specific styles
    isButton && [
      "rounded p-0.5 cursor-pointer",
      "text-[var(--sidebar-header-icon)]",
      "hover:bg-[var(--sidebar-action-bg-hover)]",
      "hover:text-[var(--sidebar-header-icon-hover)]",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--palette-blue-text)] focus-visible:ring-offset-1",
    ],
    // User-provided classes
    className
  );

  // Render as button when variant is 'button'
  if (isButton) {
    return (
      <button
        className={containerClassName}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        <Icon className={iconClassName} />
      </button>
    );
  }

  // Default: render as div
  return (
    <div
      className={containerClassName}
      {...(props as React.HTMLAttributes<HTMLDivElement>)}
    >
      <Icon className={iconClassName} />
    </div>
  );
};

export default IconWrapper;
