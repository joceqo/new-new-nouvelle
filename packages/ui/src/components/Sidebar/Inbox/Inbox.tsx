/**
 * Notion-style Inbox Component
 * "You're all caught up" message with blue checkmark
 */

import { CheckCircle2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
} from "@/components/ui/sheet";

export interface InboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Inbox({ open, onOpenChange }: InboxProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="left">
      <SheetContent className="left-64">
        <SheetHeader>
          <SheetTitle>Inbox</SheetTitle>
        </SheetHeader>

        <SheetBody>
          {/* All caught up message */}
          <div className="flex h-full flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="mb-4 h-16 w-16 text-[var(--palette-blue-text)]" />
            <h3 className="mb-2 text-lg font-semibold text-[var(--color-text-primary)]">
              You're all caught up
            </h3>
            <p className="max-w-sm text-sm text-[var(--color-text-emphasis-medium)]">
              You'll be notified here for @mentions, page activity, and more
            </p>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
