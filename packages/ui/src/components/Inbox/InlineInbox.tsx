/**
 * Inline Inbox Component
 * Displays within the sidebar as an expandable section
 */

import { CheckCircle2, X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface InlineInboxProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

export function InlineInbox({ open, onClose, className }: InlineInboxProps) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-lg p-4 mb-3",
        "animate-in slide-in-from-top duration-200 ease-out",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
          Inbox
        </h3>
        <button
          onClick={onClose}
          className="rounded p-1 text-[var(--color-icon-default)] hover:bg-[var(--color-hover-subtle)] hover:text-[var(--color-icon-hover)] transition-all duration-150"
        >
          <X className="h-3 w-3" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <CheckCircle2 className="mb-3 h-12 w-12 text-[var(--palette-blue-text)]" />
        <h4 className="mb-1 text-sm font-medium text-[var(--color-text-primary)]">
          You're all caught up
        </h4>
        <p className="text-xs text-[var(--color-text-emphasis-medium)]">
          You'll be notified here for @mentions, page activity, and more
        </p>
      </div>
    </div>
  );
}