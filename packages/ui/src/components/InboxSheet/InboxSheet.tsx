/**
 * Notion-style Floating Inbox Sheet
 * Slides out from the right edge of the sidebar as an overlay
 */

import * as React from "react";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface InboxSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function InboxSheet({ open, onOpenChange, className }: InboxSheetProps) {
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

  // Only render when open or animating
  if (!open) return null;

  return (
    <>
      {/* Inbox panel - positioned right of sidebar, overlays main content */}
      <div
        className={cn(
          "fixed top-0 left-64 z-50 h-full w-96",
          "transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "shadow-[2px_0_16px_rgba(0,0,0,0.15)] border-l border-gray-200",
          "bg-white dark:bg-gray-900 dark:border-gray-700",
          "translate-x-0", // Always in position when open
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Inbox
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 transition-all duration-150"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close inbox</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
          <CheckCircle2 className="mb-6 h-16 w-16 text-blue-500" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
            You're all caught up
          </h3>
          <p className="max-w-sm text-sm text-gray-500 dark:text-gray-400">
            You'll be notified here for @mentions, page activity, and more
          </p>
        </div>
      </div>
    </>
  );
}