/**
 * Theme utilities for applying and customizing Notion-inspired themes
 */

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  palette: {
    [key: string]: {
      text: string;
      bg: string;
    };
  };
  semantic: {
    background: {
      base: string;
      surface: string;
      muted: string;
      hover: string;
      active: string;
    };
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverse: string;
    };
    border: {
      default: string;
      subtle: string;
      divider: string;
    };
    shadow: {
      sm: string;
      md: string;
      lg: string;
    };
  };
}

export interface ThemeConfig {
  name?: string;
  description?: string;
  version?: string;
  themes: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  layout: {
    radius: Record<string, string>;
    spacing: Record<string, string>;
  };
  typography: {
    fontFamily: Record<string, string>;
    fontSize: Record<string, string>;
    lineHeight: Record<string, string>;
  };
}

/**
 * Apply theme to the document by setting CSS variables
 */
export function applyTheme(
  mode: ThemeMode = "light",
  customTheme?: Partial<ThemeColors>
): void {
  const root = document.documentElement;

  // Set theme mode attribute for dark mode
  if (mode === "dark") {
    root.setAttribute("data-theme", "dark");
    root.classList.add("dark");
  } else {
    root.removeAttribute("data-theme");
    root.classList.remove("dark");
  }

  // Apply custom theme overrides if provided
  if (customTheme) {
    applyCustomTheme(customTheme);
  }
}

/**
 * Apply custom theme overrides by setting CSS variables
 */
export function applyCustomTheme(theme: Partial<ThemeColors>): void {
  const root = document.documentElement;

  // Apply palette colors
  if (theme.palette) {
    Object.entries(theme.palette).forEach(([colorName, colorValues]) => {
      if (colorValues.text) {
        root.style.setProperty(
          `--palette-${colorName}-text`,
          colorValues.text
        );
      }
      if (colorValues.bg) {
        root.style.setProperty(`--palette-${colorName}-bg`, colorValues.bg);
      }
    });
  }

  // Apply semantic colors
  if (theme.semantic) {
    // Background colors
    if (theme.semantic.background) {
      Object.entries(theme.semantic.background).forEach(([key, value]) => {
        root.style.setProperty(`--color-bg-${key}`, value);
      });
    }

    // Text colors
    if (theme.semantic.text) {
      Object.entries(theme.semantic.text).forEach(([key, value]) => {
        root.style.setProperty(`--color-text-${key}`, value);
      });
    }

    // Border colors
    if (theme.semantic.border) {
      Object.entries(theme.semantic.border).forEach(([key, value]) => {
        if (key === "default") {
          root.style.setProperty(`--color-border`, value);
        } else {
          root.style.setProperty(`--color-border-${key}`, value);
        }
      });
    }

    // Shadow colors
    if (theme.semantic.shadow) {
      Object.entries(theme.semantic.shadow).forEach(([key, value]) => {
        root.style.setProperty(`--color-shadow-${key}`, value);
      });
    }
  }
}

/**
 * Get current theme mode from document
 */
export function getCurrentThemeMode(): ThemeMode {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * Toggle between light and dark mode
 */
export function toggleThemeMode(): ThemeMode {
  const currentMode = getCurrentThemeMode();
  const newMode = currentMode === "light" ? "dark" : "light";
  applyTheme(newMode);
  return newMode;
}

/**
 * Save theme preference to localStorage
 */
export function saveThemePreference(
  mode: ThemeMode,
  customTheme?: Partial<ThemeColors>
): void {
  localStorage.setItem("theme-mode", mode);
  if (customTheme) {
    localStorage.setItem("custom-theme", JSON.stringify(customTheme));
  }
}

/**
 * Load theme preference from localStorage
 */
export function loadThemePreference(): {
  mode: ThemeMode;
  customTheme?: Partial<ThemeColors>;
} {
  const mode = (localStorage.getItem("theme-mode") as ThemeMode) || "light";
  const customThemeStr = localStorage.getItem("custom-theme");
  const customTheme = customThemeStr
    ? JSON.parse(customThemeStr)
    : undefined;

  return { mode, customTheme };
}

/**
 * Initialize theme on app load
 */
export function initializeTheme(): void {
  const { mode, customTheme } = loadThemePreference();
  applyTheme(mode, customTheme);
}

/**
 * Create a theme preset from a partial configuration
 */
export function createThemePreset(
  name: string,
  baseMode: ThemeMode,
  overrides: Partial<ThemeColors>
): ThemeColors {
  // This would merge with the default theme config
  // For now, just return the overrides cast as ThemeColors
  return overrides as ThemeColors;
}
