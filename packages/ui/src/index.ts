// UI Components package with Fluid Typography & Layouts
// Built with Radix UI Themes and Vite

// Export Radix UI Themes for consumers
export { Theme } from "@radix-ui/themes";
export type { ThemeProps } from "@radix-ui/themes";

// Export UI components
export {
  Button,
  buttonVariants,
  type ButtonProps,
} from "./components/ui/button";
export { Input, type InputProps } from "./components/ui/input";
export { Label } from "./components/ui/label";
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/ui/card";
export { Alert, AlertTitle, AlertDescription } from "./components/ui/alert";
export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  type InputOTPProps,
} from "./components/ui/input-otp";
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  type DropdownMenuProps,
  type DropdownMenuTriggerProps,
  type DropdownMenuContentProps,
  type DropdownMenuItemProps,
  type DropdownMenuLabelProps,
} from "./components/ui/dropdown-menu";
export {
  Avatar,
  avatarVariants,
  type AvatarProps,
} from "./components/ui/avatar";
export { Badge, badgeVariants, type BadgeProps } from "./components/ui/badge";
export {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogBody,
  type DialogProps,
  type DialogOverlayProps,
  type DialogContentProps,
  type DialogHeaderProps,
  type DialogFooterProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
  type DialogBodyProps,
} from "./components/ui/dialog";
export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  type CommandProps,
  type CommandInputProps,
  type CommandListProps,
  type CommandEmptyProps,
  type CommandGroupProps,
  type CommandItemProps,
  type CommandSeparatorProps,
  type CommandShortcutProps,
} from "./components/ui/command";
export {
  Sheet,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
  type SheetProps,
  type SheetOverlayProps,
  type SheetContentProps,
  type SheetHeaderProps,
  type SheetTitleProps,
  type SheetDescriptionProps,
  type SheetBodyProps,
} from "./components/ui/sheet";

// Export Sidebar components
export {
  Sidebar,
  type SidebarProps,
} from "./components/Sidebar/Sidebar/Sidebar";
export {
  SidebarSheet,
  type SidebarSheetProps,
} from "./components/Sidebar/SidebarSheet/SidebarSheet";
export {
  SidebarItem,
  type SidebarItemProps,
} from "./components/Sidebar/SidebarItem/SidebarItem";

// Export WorkspaceSwitcher component
export {
  WorkspaceSwitcher,
  type WorkspaceSwitcherProps,
} from "./components/Sidebar/WorkspaceSwitcher";
export {
  WorkspaceHeader,
  type WorkspaceHeaderProps,
} from "./components/Sidebar/WorkspaceSwitcher/WorkspaceHeader";
export {
  WorkspaceIcon,
  type WorkspaceIconProps,
} from "./components/Sidebar/WorkspaceSwitcher/WorkspaceIcon";

// Export Workspace Dialogs
export {
  CreateWorkspaceDialog,
  InviteMembersDialog,
  WorkspaceSettingsDialog,
  type CreateWorkspaceDialogProps,
  type InviteMembersDialogProps,
  type WorkspaceSettingsDialogProps,
} from "./components/Sidebar/WorkspaceDialogs";

// Export IconWrapper component
export { IconWrapper, type IconWrapperProps } from "./components/IconWrapper";

// Export PageTree components
export { PageTree, PageTreeItem, type Page } from "./components/Sidebar/PageTree";

// Export Home component
export { Home, type HomeProps, type RecentPage } from "./components/Home/Home";

// Export Inbox component
export { Inbox, type InboxProps } from "./components/Sidebar/Inbox/Inbox";
export { InlineInbox, type InlineInboxProps } from "./components/Sidebar/Inbox/InlineInbox";
export { InboxSheet, type InboxSheetProps } from "./components/Sidebar/InboxSheet/InboxSheet";

// Export Resizable components
export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./components/ui/resizable";

// Export utilities
export { cn } from "./lib/utils";

// Export styles (consumers should import these in their app)
// import '@nouvelle/ui/styles/fluid-typography.css';
// import '@radix-ui/themes/styles.css';

import "@/index.css";
