/**
 * Notion-style Inbox Component
 * "You're all caught up" message with blue checkmark
 */

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
} from "../ui/sheet";

export interface InboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Inbox({ open, onOpenChange }: InboxProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="right">
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Inbox</SheetTitle>
        </SheetHeader>

        <SheetBody>
          {/* All caught up message */}
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-[var(--palette-blue-text)] mb-4" />
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
              You're all caught up
            </h3>
            <p className="text-sm text-[var(--color-text-emphasis-medium)] max-w-sm">
              You'll be notified here for @mentions, page activity, and more
            </p>
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
}
