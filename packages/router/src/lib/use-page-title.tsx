import { useEffect } from "react";

interface UsePageTitleOptions {
  title?: string;
  icon?: string;
  suffix?: string;
}

/**
 * Custom hook to manage the browser document title with emoji/icon support
 * Similar to Notion's tab title behavior
 *
 * @param options - Configuration for the page title
 * @param options.title - The main title text
 * @param options.icon - Optional emoji or icon to prepend (e.g., "📝", "🏠")
 * @param options.suffix - Optional suffix to append (e.g., workspace name)
 *
 * @example
 * ```tsx
 * usePageTitle({ title: "Getting Started", icon: "📝" });
 * // Sets document.title to "📝 Getting Started"
 *
 * usePageTitle({ title: "Home", icon: "🏠", suffix: "My Workspace" });
 * // Sets document.title to "🏠 Home - My Workspace"
 * ```
 */
export function usePageTitle({ title, icon, suffix }: UsePageTitleOptions) {
  useEffect(() => {
    // Build the title parts
    const parts: string[] = [];

    // Add icon if provided (emoji or icon identifier)
    if (icon) {
      parts.push(icon);
    }

    // Add main title
    if (title) {
      parts.push(title);
    }

    // Join icon and title with space
    let fullTitle = parts.join(" ");

    // Add suffix with separator if provided
    if (suffix) {
      fullTitle = fullTitle ? `${fullTitle} - ${suffix}` : suffix;
    }

    // Set document title (or use default)
    document.title = fullTitle || "Nouvelle";

    // Cleanup: reset to default when component unmounts
    return () => {
      document.title = "Nouvelle";
    };
  }, [title, icon, suffix]);
}
