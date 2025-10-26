import React, { createContext, useContext, useEffect, useState } from "react";
import {
  ThemeMode,
  ThemeColors,
  applyTheme,
  getCurrentThemeMode,
  toggleThemeMode as toggleTheme,
  saveThemePreference,
  loadThemePreference,
} from "@/lib/theme";

interface ThemeContextValue {
  mode: ThemeMode;
  customTheme?: Partial<ThemeColors>;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  setCustomTheme: (theme: Partial<ThemeColors>) => void;
  clearCustomTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  enableLocalStorage?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = "light",
  enableLocalStorage = true,
}) => {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [customTheme, setCustomThemeState] = useState<
    Partial<ThemeColors> | undefined
  >(undefined);

  // Initialize theme on mount
  useEffect(() => {
    if (enableLocalStorage) {
      const { mode: savedMode, customTheme: savedCustomTheme } =
        loadThemePreference();
      setModeState(savedMode);
      setCustomThemeState(savedCustomTheme);
      applyTheme(savedMode, savedCustomTheme);
    } else {
      applyTheme(defaultMode);
    }
  }, [enableLocalStorage, defaultMode]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    applyTheme(newMode, customTheme);
    if (enableLocalStorage) {
      saveThemePreference(newMode, customTheme);
    }
  };

  const toggleMode = () => {
    const newMode = toggleTheme();
    setModeState(newMode);
    if (enableLocalStorage) {
      saveThemePreference(newMode, customTheme);
    }
  };

  const setCustomTheme = (theme: Partial<ThemeColors>) => {
    setCustomThemeState(theme);
    applyTheme(mode, theme);
    if (enableLocalStorage) {
      saveThemePreference(mode, theme);
    }
  };

  const clearCustomTheme = () => {
    setCustomThemeState(undefined);
    applyTheme(mode, undefined);
    if (enableLocalStorage) {
      localStorage.removeItem("custom-theme");
    }
  };

  const value: ThemeContextValue = {
    mode,
    customTheme,
    setMode,
    toggleMode,
    setCustomTheme,
    clearCustomTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/**
 * Hook to access theme context
 */
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeProvider;
