import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * IconWrapper component for Lucide icons
 *
 * Wraps Lucide icons with the size-1em class to make them scale with font-size
 */

export interface IconWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The Lucide icon component to render
   */
  icon: LucideIcon;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({
  icon: Icon,
  className = "",
  ...props
}) => {
  return (
    <div className={className} {...props}>
      <Icon className={cn(`size-[1em]`)} />
    </div>
  );
};

export default IconWrapper;
