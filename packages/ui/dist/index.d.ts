import { ClassProp } from 'class-variance-authority/types';
import { default as default_2 } from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { LucideIcon } from 'lucide-react';
import * as React_2 from 'react';
import { TextProps } from '@radix-ui/themes';
import { Theme } from '@radix-ui/themes';
import { ThemeProps } from '@radix-ui/themes';
import { VariantProps } from 'class-variance-authority';

export declare const Alert: React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLDivElement> & VariantProps<(props?: ({
    variant?: "default" | "destructive" | null | undefined;
} & ClassProp) | undefined) => string> & React_2.RefAttributes<HTMLDivElement>>;

export declare const AlertDescription: React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLParagraphElement> & React_2.RefAttributes<HTMLParagraphElement>>;

export declare const AlertTitle: React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLHeadingElement> & React_2.RefAttributes<HTMLParagraphElement>>;

export declare const Button: React_2.ForwardRefExoticComponent<ButtonProps & React_2.RefAttributes<HTMLButtonElement>>;

export declare interface ButtonProps extends React_2.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

export declare const buttonVariants: (props?: ({
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined;
    size?: "sm" | "lg" | "default" | "icon" | null | undefined;
} & ClassProp) | undefined) => string;

export declare const Card: React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLDivElement> & React_2.RefAttributes<HTMLDivElement>>;

export declare const CardContent: React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLDivElement> & React_2.RefAttributes<HTMLDivElement>>;

export declare const CardDescription: React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLParagraphElement> & React_2.RefAttributes<HTMLParagraphElement>>;

export declare const CardFooter: React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLDivElement> & React_2.RefAttributes<HTMLDivElement>>;

export declare const CardHeader: React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLDivElement> & React_2.RefAttributes<HTMLDivElement>>;

export declare const CardTitle: React_2.ForwardRefExoticComponent<React_2.HTMLAttributes<HTMLHeadingElement> & React_2.RefAttributes<HTMLParagraphElement>>;

/**
 * Card Grid with Fluid Gap
 */
export declare const FluidCardGrid: default_2.FC;

/**
 * Hero Section with Fluid Spacing
 */
export declare const FluidHero: default_2.FC;

/**
 * Main FluidLayout Showcase Component
 */
export declare const FluidLayoutShowcase: default_2.FC;

/**
 * Nested Flex with Multiple Fluid Gaps
 */
export declare const FluidNested: default_2.FC;

/**
 * Complete Page Layout Example
 */
export declare const FluidPageLayout: default_2.FC;

/**
 * Two-Column Layout with Fluid Spacing
 */
export declare const FluidTwoColumn: default_2.FC;

export declare const Input: React_2.ForwardRefExoticComponent<InputProps & React_2.RefAttributes<HTMLInputElement>>;

export declare const InputOTP: React_2.ForwardRefExoticComponent<InputOTPProps & React_2.RefAttributes<HTMLInputElement>>;

export declare const InputOTPGroup: React_2.FC<{
    children: React_2.ReactNode;
}>;

export declare interface InputOTPProps extends Omit<React_2.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    maxLength: number;
    value: string;
    onChange: (value: string) => void;
}

export declare const InputOTPSlot: React_2.FC<{
    index: number;
}>;

export declare interface InputProps extends React_2.InputHTMLAttributes<HTMLInputElement> {
}

export declare const Label: React_2.ForwardRefExoticComponent<Omit<LabelPrimitive.LabelProps & React_2.RefAttributes<HTMLLabelElement>, "ref"> & VariantProps<(props?: ClassProp | undefined) => string> & React_2.RefAttributes<HTMLLabelElement>>;

export declare const Sidebar: default_2.FC<SidebarProps>;

export declare const SidebarHeader: default_2.FC<SidebarHeaderProps>;

export declare interface SidebarHeaderProps {
    /** Icon or emoji for workspace */
    icon?: default_2.ReactNode;
    /** Workspace or section name */
    label: string;
    /** Callback for toggling sidebar collapse */
    onToggleSidebar?: () => void;
    /** Callback for creating new page */
    onCreateNewPage?: () => void;
    /** Callback when clicking workspace name (e.g., open workspace switcher) */
    onLabelClick?: () => void;
    /** Whether workspace switcher is open */
    isOpen?: boolean;
    /** Custom className */
    className?: string;
}

export declare const SidebarItem: default_2.ForwardRefExoticComponent<SidebarItemProps & default_2.RefAttributes<HTMLDivElement>>;

export declare interface SidebarItemProps {
    /** Icon to display */
    icon: LucideIcon;
    /** Item label/text */
    label: string;
    /** Whether this item is currently active/selected */
    isActive?: boolean;
    /** Whether this item is expandable (has children) */
    isExpandable?: boolean;
    /** Whether the item is expanded (only relevant if isExpandable is true) */
    isExpanded?: boolean;
    /** Callback when expand toggle is clicked */
    onToggleExpand?: () => void;
    /** Show action buttons on hover (ellipsis, plus) */
    showActions?: boolean;
    /** Callback for add action */
    onAdd?: (e: default_2.MouseEvent) => void;
    /** Callback for more action */
    onMore?: (e: default_2.MouseEvent) => void;
    /** Badge text (e.g., "New", "11") */
    badge?: string;
    /** Badge variant */
    badgeVariant?: "default" | "accent";
    /** Nesting level for indentation (0 = root) */
    level?: number;
    /** Link href (if item is a link) */
    href?: string;
    /** Custom className for icon */
    iconClassName?: string;
    /** Custom className */
    className?: string;
    /** Click handler */
    onClick?: (e: default_2.MouseEvent) => void;
}

export declare interface SidebarProps {
    icon?: default_2.ReactNode;
    workspaceName?: string;
    onToggleSidebar?: () => void;
    onCreateNewPage?: () => void;
    onWorkspaceClick?: () => void;
    children?: default_2.ReactNode;
}

export { Theme }

export { ThemeProps }

export declare const Typography: default_2.FC<TypographyProps>;

/**
 * Typography component demonstrating fluid typography with Radix UI Themes
 *
 * This component uses the overridden CSS tokens from fluid-typography.css
 * to create responsive, fluid typography that scales smoothly across viewport sizes.
 */
export declare interface TypographyProps {
    /**
     * The variant of typography to display
     */
    variant?: 'heading' | 'text' | 'display';
    /**
     * Size scale (1-9 for Radix tokens)
     */
    size?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
    /**
     * Content to display
     */
    children: default_2.ReactNode;
    /**
     * Custom className for additional styling
     */
    className?: string;
    /**
     * Weight of the text
     */
    weight?: TextProps['weight'];
}

/**
 * TypographyShowcase component for demonstrating all typography sizes
 */
export declare const TypographyShowcase: default_2.FC;

export { }
