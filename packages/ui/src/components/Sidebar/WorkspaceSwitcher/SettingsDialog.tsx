import * as React from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { User, Settings as SettingsIcon } from "lucide-react";
import { AccountInfo } from "@/components/Sidebar/WorkspaceSwitcher/AccountInfo";
import { Preferences } from "@/components/Sidebar/WorkspaceSwitcher/Preferences";

export interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SettingsSection = "account-info" | "preferences";

const settingsComponents: Record<SettingsSection, React.ComponentType> = {
  "account-info": AccountInfo,
  preferences: Preferences,
};

export const SettingsDialog = React.forwardRef<
  HTMLDivElement,
  SettingsDialogProps
>(({ open, onOpenChange }, ref) => {
  const [activeSection, setActiveSection] =
    React.useState<SettingsSection>("account-info");

  const ActiveComponent = settingsComponents[activeSection];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={ref}
        className="max-w-4xl h-[600px] p-0 flex flex-col"
      >
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 border-r border-(--color-border) bg-(--color-bg-subtle) p-4">
            <DialogTitle className="px-2 mb-4">Settings</DialogTitle>

            {/* Account Section */}
            <div className="space-y-1">
              <div className="px-2 py-1.5 text-xs font-medium text-(--color-text-emphasis-medium) uppercase tracking-wide">
                Account
              </div>
              <button
                onClick={() => setActiveSection("account-info")}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors duration-150",
                  "hover:bg-(--color-hover-subtle)",
                  "focus:outline-none focus:ring-2 focus:ring-(--palette-blue-text) focus:ring-offset-1",
                  activeSection === "account-info"
                    ? "bg-(--color-bg-active) text-(--color-text-primary) font-medium"
                    : "text-(--color-text-primary)"
                )}
              >
                <User className="h-4 w-4" />
                <span>Account Info</span>
              </button>
              <button
                onClick={() => setActiveSection("preferences")}
                className={cn(
                  "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors duration-150",
                  "hover:bg-(--color-hover-subtle)",
                  "focus:outline-none focus:ring-2 focus:ring-(--palette-blue-text) focus:ring-offset-1",
                  activeSection === "preferences"
                    ? "bg-(--color-bg-active) text-(--color-text-primary) font-medium"
                    : "text-(--color-text-primary)"
                )}
              >
                <SettingsIcon className="h-4 w-4" />
                <span>Preferences</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-auto">
            <ActiveComponent />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

SettingsDialog.displayName = "SettingsDialog";
