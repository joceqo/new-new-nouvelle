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

// Export styles (consumers should import these in their app)
// import '@nouvelle/ui/styles/fluid-typography.css';
// import '@radix-ui/themes/styles.css';

import './index.css';