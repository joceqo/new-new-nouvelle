/**
 * Notion-style Floating Sidebar Sheet
 * Slides out from the left edge as an overlay with smooth animations
 */

import * as React from "react";
import { cn } from "../../lib/utils";
import { Sidebar, type SidebarProps } from "../Sidebar/Sidebar/Sidebar";

export interface SidebarSheetProps extends Omit<SidebarProps, 'className'> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function SidebarSheet({ 
  open, 
  onOpenChange, 
  className,
  children,
  ...sidebarProps 
}: SidebarSheetProps) {
  // Close on Escape key
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

  return (
    <>
      {/* Backdrop overlay */}
      {open && (
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/20 backdrop-blur-sm",
            "animate-in fade-in-0 duration-300 ease-out"
          )}
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Floating sidebar sheet */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full",
          "transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "shadow-[4px_0_24px_rgba(0,0,0,0.15)] border-r border-gray-200",
          "bg-white dark:bg-gray-900 dark:border-gray-700",
          open ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <Sidebar {...sidebarProps}>
          {children}
        </Sidebar>
      </div>
    </>
  );
}