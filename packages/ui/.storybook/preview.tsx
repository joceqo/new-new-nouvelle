import type { Preview, Decorator } from "@storybook/react";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Theme } from "@radix-ui/themes";
import { themes } from "storybook/theming";
import "@radix-ui/themes/styles.css";
import "../src/styles/fluid-typography.css";
import "../src/index.css";

// Mock theme context for Storybook (matches @nouvelle/router API)
type ThemeType = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

function MockThemeProvider({
  children,
  initialTheme = "light"
}: {
  children: React.ReactNode;
  initialTheme?: ThemeType;
}) {
  const [theme, setTheme] = useState<ThemeType>(initialTheme);
  const resolvedTheme: ResolvedTheme = theme === "system" ? "light" : theme;

  // Update internal state when initialTheme changes (from Storybook controls)
  useEffect(() => {
    setTheme(initialTheme);
  }, [initialTheme]);

  // Sync with document class for consistency
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      <div className={resolvedTheme}>
        <Theme appearance={resolvedTheme} accentColor="blue" grayColor="slate">
          {children}
        </Theme>
      </div>
    </ThemeContext.Provider>
  );
}

const withTheme: Decorator = (Story, context) => {
  // Get theme from Storybook globals (toolbar)
  const globalTheme = (context.globals.theme || "light") as ThemeType;

  return (
    <MockThemeProvider initialTheme={globalTheme}>
      <Story />
    </MockThemeProvider>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      theme: themes.light, // You can change this to themes.dark if preferred
    },
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'system', title: 'System', icon: 'browser' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withTheme],
};

export default preview;
