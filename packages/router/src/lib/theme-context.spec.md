# Module: lib/theme-context.tsx

Status: stable
Intent: Theme management with light/dark/system modes, localStorage persistence, system preference detection, and cross-tab synchronization.

## Exports

```ts
export function ThemeProvider({ children }: { children: React.ReactNode }): JSX.Element;
export function useTheme(): ThemeContextType;

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}
```

## Purpose & Behavior

### Core Functionality

- **Three theme modes**: Light, dark, and system (auto-detect)
- **System preference detection**: Reads OS dark mode setting
- **Dynamic resolution**: System theme resolves to light or dark
- **Persistence**: Stores preference in localStorage
- **DOM integration**: Applies theme class to document root
- **Cross-tab sync**: Syncs theme changes across browser tabs
- **Legacy browser support**: Fallback for older media query APIs

### Theme Resolution

```ts
"light" → "light"        // Direct mapping
"dark" → "dark"          // Direct mapping
"system" → "light"|"dark" // Based on OS preference
```

## Component Contract

### ThemeProvider

```tsx
<ThemeProvider>
  {/* Your app components */}
</ThemeProvider>
```

**Props**: `children` - React components to wrap with theme context

**Behavior**:
- Reads theme preference from localStorage on mount
- Applies theme class to `document.documentElement`
- Listens for system theme changes
- Listens for cross-tab theme changes

### useTheme Hook

```ts
const { theme, resolvedTheme, setTheme } = useTheme();
```

**Returns**: `ThemeContextType` object with state and setter

**Throws**: Error if used outside `ThemeProvider`

## State Management

### Storage Key

- `theme-preference` - Stored theme choice ("light" | "dark" | "system")

### State Variables

- `theme` - User's preference (light/dark/system)
- `resolvedTheme` - Actual theme applied (light/dark only)

## DOM Integration

### Class Application

```ts
<html class="light">  // or class="dark"
```

The provider removes previous theme class and adds current `resolvedTheme` class to `document.documentElement`.

### CSS Integration

Your CSS should define theme colors using these classes:

```css
:root.light {
  --color-bg: white;
  --color-text: black;
}

:root.dark {
  --color-bg: black;
  --color-text: white;
}
```

## Methods

### setTheme(newTheme)

**Purpose**: Change theme preference

**Parameters**: `newTheme` - "light" | "dark" | "system"

**Side effects**:
- Saves to localStorage
- Updates internal state
- Resolves system theme if "system" selected
- Applies new class to document root
- Triggers cross-tab sync

## System Integration

### System Preference Detection

```ts
window.matchMedia("(prefers-color-scheme: dark)").matches
```

**Returns**: `true` if OS is in dark mode, `false` otherwise

**Fallback**: Returns "light" on server-side or if API unavailable

### System Change Listener

Automatically detects when user changes OS theme preference:

```ts
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", handler);
```

**Behavior**: Only updates resolved theme if user preference is "system"

**Legacy support**: Falls back to `addListener()` for older browsers

## Cross-Tab Synchronization

### Storage Event Listener

```ts
window.addEventListener("storage", handleStorageChange);
```

**Trigger**: Fires when localStorage changes in another tab

**Behavior**: Reads new theme value and applies it to current tab

**Validation**: Ensures new value is valid theme before applying

## Error Handling

### localStorage Errors

- Catches and logs errors when reading/writing localStorage
- Falls back to "system" theme if read fails
- Continues without persistence if write fails

### SSR Compatibility

- Checks `typeof window === "undefined"` before DOM access
- Returns safe defaults during server-side rendering

## Dependencies

- `react` - Context, hooks, effects

## Usage Examples

### App Setup

```tsx
import { ThemeProvider } from '@nouvelle/router';

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
```

### Theme Switcher Component

```tsx
import { useTheme } from '@nouvelle/router';

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectItem value="light">Light</SelectItem>
      <SelectItem value="dark">Dark</SelectItem>
      <SelectItem value="system">System</SelectItem>
    </Select>
  );
}
```

### Theme Toggle Button

```tsx
import { useTheme } from '@nouvelle/router';

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button onClick={toggleTheme}>
      {resolvedTheme === 'light' ? '🌙' : '☀️'}
    </Button>
  );
}
```

### Conditional Rendering

```tsx
const { resolvedTheme } = useTheme();

return (
  <div>
    {resolvedTheme === 'dark' ? <DarkLogo /> : <LightLogo />}
  </div>
);
```

### Show System Preference

```tsx
const { theme, resolvedTheme } = useTheme();

return (
  <div>
    <p>Preference: {theme}</p>
    {theme === 'system' && <p>System: {resolvedTheme}</p>}
  </div>
);
```

## Performance Characteristics

- **Initial render**: Single localStorage read
- **Theme change**: Immediate (synchronous class update)
- **Storage writes**: Throttled by browser localStorage API
- **Event listeners**: Three listeners (system change, storage change, cleanup)
- **Re-renders**: Only on theme/resolvedTheme change

## Browser Compatibility

### Modern Browsers

- Chrome 76+
- Firefox 67+
- Safari 12.1+
- Edge 79+

### Legacy Support

Falls back to `addListener()`/`removeListener()` for:
- Chrome 45-75
- Firefox 55-66
- Safari 10-12.0

### Server-Side Rendering

- Safe for Next.js, Remix, etc.
- Returns default values during SSR
- Hydrates with stored preference on client

## Security Considerations

- **localStorage access**: Requires same-origin policy
- **XSS prevention**: Theme values validated before applying
- **CSS injection**: Only applies whitelisted class names ("light" or "dark")

## Accessibility

- **Respects user preference**: "system" mode honors OS accessibility settings
- **High contrast**: OS high contrast mode works with theme system
- **Reduced motion**: Independent of theme, handled by CSS media queries

## Future Improvements

- **Custom themes**: Support user-defined color schemes
- **Theme transitions**: Smooth fade between themes
- **Per-page themes**: Override theme for specific routes
- **Theme preview**: Preview theme without applying
- **Scheduled themes**: Auto-switch at specific times
- **Reduced motion**: Disable transitions if user prefers reduced motion
- **Theme sharing**: Export/import custom themes

## Edge Cases

- **localStorage disabled**: Falls back to system theme, no persistence
- **Invalid stored value**: Resets to system theme
- **Rapid theme changes**: Debounced by React state updates
- **Multiple providers**: Nested providers may conflict (avoid)

## Related Files

- Used by: All UI components that need theme-aware styling
- Complements: `packages/ui/src/index.css` - Theme CSS variables
- Independent of: No dependencies on other contexts

Last updated: 2025-11-12
