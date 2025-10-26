# Notion-Inspired Theming System

A comprehensive, customizable theming system inspired by Notion's design language. This system provides a flexible token-based approach to theming with support for light and dark modes, custom color palettes, and easy customization.

## Features

- **Notion-inspired color palette** - Light and dark mode support with 10 accent colors
- **Two-layer token system** - Base palette tokens and semantic UI tokens
- **CSS Variables** - Easy customization and dynamic theming
- **React Context** - Simple theme management with hooks
- **TypeScript support** - Fully typed for better DX
- **LocalStorage persistence** - Remember user preferences
- **Custom theme overrides** - Create your own themes easily

## Quick Start

### 1. Wrap your app with ThemeProvider

```tsx
import { ThemeProvider } from "@/components/ThemeProvider";

function App() {
  return (
    <ThemeProvider defaultMode="light" enableLocalStorage={true}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. Use the theme hook in your components

```tsx
import { useTheme } from "@/components/ThemeProvider";

function ThemeToggle() {
  const { mode, toggleMode } = useTheme();

  return (
    <button onClick={toggleMode}>
      {mode === "light" ? "🌙" : "☀️"}
    </button>
  );
}
```

### 3. Use CSS variables in your components

```tsx
function MyComponent() {
  return (
    <div className="bg-[var(--color-bg-surface)] text-[var(--color-text-primary)]">
      <p className="text-[var(--color-text-secondary)]">Hello World</p>
    </div>
  );
}
```

## Available Tokens

### Base Palette Tokens

These are the raw colors from Notion's palette:

- `--palette-default-text` / `--palette-default-bg`
- `--palette-gray-text` / `--palette-gray-bg`
- `--palette-brown-text` / `--palette-brown-bg`
- `--palette-orange-text` / `--palette-orange-bg`
- `--palette-yellow-text` / `--palette-yellow-bg`
- `--palette-green-text` / `--palette-green-bg`
- `--palette-blue-text` / `--palette-blue-bg`
- `--palette-purple-text` / `--palette-purple-bg`
- `--palette-pink-text` / `--palette-pink-bg`
- `--palette-red-text` / `--palette-red-bg`

### Semantic UI Tokens

These map to UI roles and should be used in components:

**Backgrounds:**
- `--color-bg-base` - Main app background
- `--color-bg-surface` - Cards, panels, surfaces
- `--color-bg-muted` - Secondary backgrounds
- `--color-bg-hover` - Hover state backgrounds
- `--color-bg-active` - Active/selected state

**Text:**
- `--color-text-primary` - Main body text
- `--color-text-secondary` - Secondary text, labels
- `--color-text-muted` - Hints, placeholder text
- `--color-text-inverse` - Text on dark backgrounds

**Borders:**
- `--color-border` - Default borders
- `--color-border-subtle` - Subtle borders
- `--color-divider` - Divider lines

**Shadows:**
- `--color-shadow-sm` - Small shadows
- `--color-shadow-md` - Medium shadows
- `--color-shadow-lg` - Large shadows

**Layout:**
- `--radius-sm` to `--radius-xl` - Border radius
- `--spacing-xs` to `--spacing-xl` - Spacing values

## Customization

### Using the useTheme Hook

```tsx
import { useTheme } from "@/components/ThemeProvider";

function CustomThemeExample() {
  const { setCustomTheme } = useTheme();

  const applyCustomColors = () => {
    setCustomTheme({
      semantic: {
        background: {
          base: "#F8F9FA",
          surface: "#FFFFFF",
          muted: "#E9ECEF",
          hover: "#F1F3F5",
          active: "#DEE2E6",
        },
        text: {
          primary: "#212529",
          secondary: "#495057",
          muted: "#868E96",
          inverse: "#FFFFFF",
        },
      },
    });
  };

  return <button onClick={applyCustomColors}>Apply Custom Theme</button>;
}
```

### Using theme-config.json

You can modify `theme-config.json` to create theme presets:

```json
{
  "themes": {
    "light": {
      "palette": {
        "blue": {
          "text": "#2563eb",
          "bg": "#dbeafe"
        }
      }
    }
  }
}
```

### Programmatic Theme Application

```tsx
import { applyTheme, applyCustomTheme } from "@/lib/theme";

// Apply dark mode
applyTheme("dark");

// Apply custom theme
applyCustomTheme({
  palette: {
    blue: {
      text: "#0066CC",
      bg: "#E6F2FF",
    },
  },
});
```

## Color Palette Reference

### Light Mode Colors

| Color  | Text      | Background |
|--------|-----------|------------|
| Default| `#373530` | `#FFFFFF`  |
| Gray   | `#787774` | `#F1F1EF`  |
| Brown  | `#976D57` | `#F3EEEE`  |
| Orange | `#CC782F` | `#F8ECDF`  |
| Yellow | `#C29343` | `#FAF3DD`  |
| Green  | `#548164` | `#EEF3ED`  |
| Blue   | `#487CA5` | `#E9F3F7`  |
| Purple | `#8A67AB` | `#F6F3F8`  |
| Pink   | `#B35488` | `#F9F2F5`  |
| Red    | `#C4554D` | `#FAECEC`  |

### Dark Mode Colors

| Color  | Text      | Background |
|--------|-----------|------------|
| Default| `#D4D4D4` | `#191919`  |
| Gray   | `#9B9B9B` | `#252525`  |
| Brown  | `#A27763` | `#2E2724`  |
| Orange | `#CB7B37` | `#36291F`  |
| Yellow | `#C19138` | `#372E20`  |
| Green  | `#4F9768` | `#242B26`  |
| Blue   | `#447ACB` | `#1F282D`  |
| Purple | `#865DBB` | `#2A2430`  |
| Pink   | `#BA4A78` | `#2E2328`  |
| Red    | `#BE524B` | `#332523`  |

## Best Practices

1. **Use semantic tokens** - Prefer `--color-bg-surface` over `--palette-gray-bg` in components
2. **Maintain contrast** - Ensure text meets WCAG contrast requirements
3. **Test both modes** - Always test your UI in both light and dark mode
4. **Minimize custom colors** - Stick to the theme tokens when possible
5. **Document overrides** - If you create custom themes, document why

## Examples

### Themed Button Component

```tsx
function Button({ variant = "default" }: { variant?: "default" | "primary" }) {
  const baseClasses = "px-4 py-2 rounded-[var(--radius-base)] transition-colors";

  const variantClasses = {
    default: "bg-[var(--color-bg-muted)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]",
    primary: "bg-[var(--color-accent-blue-text)] text-[var(--color-text-inverse)] hover:opacity-90",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      Click me
    </button>
  );
}
```

### Themed Card Component

```tsx
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] p-[var(--spacing-md)] shadow-[0_2px_8px_var(--color-shadow-sm)]">
      {children}
    </div>
  );
}
```

## Migration Guide

If you have existing hardcoded colors, replace them with CSS variables:

```tsx
// Before
<div className="bg-[#1e1e1e] text-white">

// After
<div className="bg-[var(--color-bg-surface)] text-[var(--color-text-primary)]">
```

## Troubleshooting

### Colors not updating
- Make sure `theme.css` is imported in your main CSS file
- Check that ThemeProvider wraps your app
- Verify CSS variables are applied with browser dev tools

### Dark mode not working
- Ensure the `dark` class or `data-theme="dark"` attribute is on the root element
- Check that dark mode overrides are defined in `theme.css`

### Custom theme not persisting
- Enable `enableLocalStorage={true}` in ThemeProvider
- Check browser's localStorage in dev tools

## Resources

- **Color Palette Source:** [Notion Colors by Matthias Frank](https://matthiasfrank.de/en/notion-colors/)
- **Design Tokens:** [Intuit's Token Taxonomy](https://medium.com/@NateBaldwin/creating-a-flexible-design-token-taxonomy-for-intuits-design-system-81c8ff55c59b)
- **Files:**
  - `/src/styles/theme.css` - CSS variables
  - `/src/styles/theme-config.json` - Theme configuration
  - `/src/lib/theme.ts` - Theme utilities
  - `/src/components/ThemeProvider/` - React context & hooks
