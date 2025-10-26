import type { Preview, Decorator } from "@storybook/react";
import React from "react";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import "../src/styles/fluid-typography.css";
import "../src/index.css";

const withTheme: Decorator = (Story) => (
  <Theme appearance="light" accentColor="blue" grayColor="slate">
    <Story />
  </Theme>
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [withTheme],
};

export default preview;
