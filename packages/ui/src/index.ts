// UI Components package with Fluid Typography & Layouts
// Built with Radix UI Themes and Vite

// Export Radix UI Themes for consumers
export { Theme } from '@radix-ui/themes';
export type { ThemeProps } from '@radix-ui/themes';

// Export Typography components
export { Typography, TypographyShowcase, type TypographyProps } from './components/Typography';

// Export Fluid Layout components
export {
  FluidLayoutShowcase,
  FluidHero,
  FluidCardGrid,
  FluidTwoColumn,
  FluidNested,
  FluidPageLayout,
} from './components/FluidLayout';

// Export UI components
export { Button, buttonVariants, type ButtonProps } from './components/ui/button';
export { Input, type InputProps } from './components/ui/input';
export { Label } from './components/ui/label';
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from './components/ui/card';
export { Alert, AlertTitle, AlertDescription } from './components/ui/alert';
export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  type InputOTPProps,
} from './components/ui/input-otp';

// Export Sidebar components
export { Sidebar, type SidebarProps } from './components/Sidebar/Sidebar/Sidebar';
export { SidebarItem, type SidebarItemProps } from './components/Sidebar/SidebarItem/SidebarItem';
export { SidebarHeader, type SidebarHeaderProps } from './components/Sidebar/SidebarHeader/SidebarHeader';

// Export styles (consumers should import these in their app)
// import '@nouvelle/ui/styles/fluid-typography.css';
// import '@radix-ui/themes/styles.css';

import './index.css';