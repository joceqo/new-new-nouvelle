import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';

// Theme the Storybook UI (sidebar, toolbar, etc.)
addons.setConfig({
  theme: themes.light, // Change to themes.dark if you prefer dark mode
});
