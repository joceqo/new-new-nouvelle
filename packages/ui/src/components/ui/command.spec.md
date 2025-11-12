# Component: Command (Command Palette) + CommandInput + CommandList + CommandEmpty + CommandItem + CommandGroup

Status: stable  
Intent: Notion-inspired command palette for keyboard-driven navigation and search, with overlay presentation, Escape/click-to-close, and theme-integrated styling.

## Props Contract

```ts
export interface CommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export interface CommandInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export interface CommandListProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CommandEmptyProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface CommandItemProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onSelect?: () => void;
  children: React.ReactNode;
}

export interface CommandGroupProps
  extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
  children: React.ReactNode;
}
```

## Component Structure

```tsx
<Command open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem onSelect={() => {}}>Item 1</CommandItem>
      <CommandItem onSelect={() => {}}>Item 2</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

## Behavior Rules

- **Modal overlay**: Blocks interaction with page content when open
- **Escape to close**: Pressing Escape key closes the command palette
- **Click outside**: Clicking overlay closes the command palette
- **Auto-focus**: Input automatically receives focus when opened
- **Body scroll lock**: Prevents page scrolling when command palette is open
- **Context-based**: Uses React Context to share state between subcomponents
- **Keyboard navigation**: Standard input keyboard behavior (no custom arrow key nav in this implementation)

## Visual & Styling

### Command (Container)

- **Overlay**: `bg-[var(--color-overlay-light)] backdrop-blur-sm`
  - Semi-transparent dark background with blur effect
  - Full viewport coverage (`fixed inset-0`)
  - Z-index: 50 for top-level stacking

- **Dialog positioning**:
  - Horizontal: Centered (`left-1/2 -translate-x-1/2`)
  - Vertical: `top-[20%]` for natural reading position
  - Max width: `max-w-2xl` (responsive on mobile)

- **Dialog styling**:
  - Background: `bg-[var(--color-bg-base)]`
  - Border: `border border-[var(--color-border)]`
  - Shadow: `shadow-2xl` for depth
  - Shape: `rounded-lg`

- **Animation**:
  - Entrance: `animate-in fade-in-0 zoom-in-95 duration-150`
  - Smooth fade and slight zoom for polish

### CommandInput (Search Field)

- **Layout**: Uses `<Flex>` component with `align="center"`
  - Padding: `px="4" py="3"` (16px horizontal, 12px vertical)
  - Border: `border-b border-[var(--color-divider)]`
  - Gap: Icon positioned with `mr-2`

- **Icon**: Search icon with consistent styling
  - Size: `h-5 w-5` (20px)
  - No shrink: `shrink-0`
  - Color: `text-[var(--color-icon-default)]`

- **Input field**:
  - Display: `flex` for alignment
  - Size: `h-10 w-full` (40px height, full width)
  - Shape: `rounded-md`
  - Background: `bg-transparent`
  - Typography: `text-sm`
  - Text color: `text-[var(--color-text-primary)]`
  - Placeholder: `placeholder:text-[var(--color-text-muted)]`
  - Outline: `outline-none` (no focus ring)
  - Disabled: `disabled:cursor-not-allowed disabled:opacity-50`

### CommandList (Results Container)

- **Scrolling**: `overflow-y-auto overflow-x-hidden`
- **Max height**: `max-h-[400px]` prevents excessive height
- **Padding**: `p-2` (8px) around items

### CommandEmpty (No Results State)

- **Padding**: `py-12` (48px) for spacious empty state
- **Alignment**: `text-center`
- **Typography**: `text-sm`
- **Color**: `text-[var(--color-text-emphasis-low)]` (50% opacity)

### CommandItem (Result Item)

- **Interactive**: Clickable with hover states
- **Layout**: Horizontal with gap for icon + text
- **Hover**: Background change on hover
- **Active/selected**: Visual feedback for keyboard selection

### CommandGroup (Categorized Results)

- **Heading**: Optional category label
- **Spacing**: Gap between groups

## Theme Integration

### Colors (Light Mode)

```css
--color-overlay-light: rgba(0, 0, 0, 0.4);
--color-bg-base: #FFFFFF;
--color-border: #E0E0E0;
--color-divider: #E9E9E7;
--color-icon-default: rgba(55, 53, 48, 0.45);
--color-text-primary: #373530;
--color-text-muted: #9B9A97;
--color-text-emphasis-low: rgba(55, 53, 48, 0.5);
```

### Colors (Dark Mode)

```css
--color-overlay-light: rgba(0, 0, 0, 0.5);
--color-bg-base: #191919;
--color-border: #444444;
--color-divider: #2F2F2F;
--color-icon-default: rgba(212, 212, 212, 0.45);
--color-text-primary: #D4D4D4;
--color-text-muted: #6F6F6F;
--color-text-emphasis-low: rgba(212, 212, 212, 0.5);
```

## Accessibility

- **Keyboard control**: Escape to close, Tab for navigation
- **Auto-focus**: Input receives focus automatically
- **Screen readers**: Results announced as user types (native input behavior)
- **Click outside**: Alternative to keyboard close
- **Focus trap**: Consider adding for full accessibility (not currently implemented)
- **ARIA attributes**: Consider adding role="dialog" and aria-labelledby

## Dependencies

- `React` - Component framework, Context API, hooks
- `lucide-react` - Search and X icons
- `@/lib/utils` - cn() utility for className merging
- `@/components/design_system/Layout/Flex` - Layout component

## Edge Cases

- **Multiple opens**: Only one command palette can be open at a time
- **Empty results**: CommandEmpty provides feedback
- **No input value**: Results can show all items or suggestions
- **Long result lists**: CommandList scrolls vertically
- **Focus management**: Uses ref forwarding for input focus
- **Body scroll**: Properly restored on close

## Usage Examples

### Basic Command Palette

```tsx
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

const [open, setOpen] = useState(false);

// Open with Cmd+K
useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((open) => !open);
    }
  };
  document.addEventListener("keydown", down);
  return () => document.removeEventListener("keydown", down);
}, []);

return (
  <Command open={open} onOpenChange={setOpen}>
    <CommandInput placeholder="Search pages..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Recent">
        <CommandItem onSelect={() => navigate("/page1")}>
          📄 Page 1
        </CommandItem>
        <CommandItem onSelect={() => navigate("/page2")}>
          📄 Page 2
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
);
```

### Command Palette with Multiple Groups

```tsx
<Command open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    
    <CommandGroup heading="Suggestions">
      <CommandItem onSelect={() => createPage()}>
        ➕ Create Page
      </CommandItem>
      <CommandItem onSelect={() => openSettings()}>
        ⚙️ Settings
      </CommandItem>
    </CommandGroup>

    <CommandGroup heading="Recent Pages">
      <CommandItem onSelect={() => {}}>📄 Meeting Notes</CommandItem>
      <CommandItem onSelect={() => {}}>📊 Q4 Planning</CommandItem>
      <CommandItem onSelect={() => {}}>✅ Todo List</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

## Performance Notes

- **Conditional rendering**: Command only renders when `open={true}`
- **Event listeners**: Properly cleaned up in useEffect returns
- **Body scroll management**: Restored on unmount
- **Focus management**: Timeout ensures proper focus on open

## Testing Strategy

- **Open/close**: Test open/onOpenChange behavior
- **Keyboard events**: Test Escape key closing
- **Click outside**: Test overlay click closing
- **Auto-focus**: Verify input receives focus on open
- **Body scroll lock**: Verify scroll is prevented when open
- **Context propagation**: Test subcomponents receive context
- **Empty state**: Test CommandEmpty displays when no results

## Future Improvements

- **Full keyboard navigation**: Arrow keys for result navigation
- **Keyboard shortcuts**: Display shortcuts for each command
- **Filtering**: Built-in search filtering logic
- **Recent/favorites**: Automatic tracking of frequently used commands
- **Command scoring**: Fuzzy matching for better search
- **Focus trap**: Prevent tabbing outside dialog
- **Loading state**: Support for async command loading
- **Command categories**: Visual separation of command types

## Design Patterns

### Cmd+K Pattern

Following Notion's pattern:
1. Press Cmd+K (or Ctrl+K on Windows/Linux)
2. Command palette opens centered
3. Input auto-focused and ready for typing
4. Results update as you type
5. Click result or press Escape to close

### Empty State

Show helpful message when no results:
- "No results found" for search queries
- "Start typing to search" for empty input
- "No pages yet" when database is empty

## Best Practices

1. **Open with Cmd+K**: Standard keyboard shortcut
2. **Auto-focus input**: Users expect to start typing immediately
3. **Show recent items**: Display recent pages when input is empty
4. **Group related items**: Use CommandGroup for categories
5. **Provide empty states**: Guide users when no results
6. **Keep it fast**: Command palette should feel instant
7. **Close on selection**: Automatically close after item selected

Last updated: 2025-11-12
