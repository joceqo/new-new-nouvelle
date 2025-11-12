# Component: DropdownMenu (+ DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel)

Status: stable  
Intent: Contextual menu system with positioning, collision detection, keyboard navigation, and customizable trigger elements for actions and options.

## Props Contract

```ts
// Main Controller
interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean; // Controlled state
  onOpenChange?: (open: boolean) => void; // State change handler
}

// Trigger Element
interface DropdownMenuTriggerProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean; // Use child as trigger element
}

// Content Container
interface DropdownMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  align?: "start" | "center" | "end"; // Horizontal alignment
  side?: "top" | "bottom" | "left" | "right"; // Vertical positioning
  sideOffset?: number; // Distance from trigger (default: 4px)
  collisionPadding?: number; // Edge padding for collision detection (default: 8px)
  autoFlip?: boolean; // Auto-flip on collision (default: true)
}

// Menu Items
interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onSelect?: () => void; // Selection handler
  disabled?: boolean; // Disable interaction
}

// Separators and Labels
interface DropdownMenuSeparatorProps
  extends React.HTMLAttributes<HTMLDivElement> {}
interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
```

## Component Structure

```tsx
<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
  <DropdownMenuTrigger>
    <Button>Actions</Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="start" side="bottom">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />

    <DropdownMenuItem onSelect={() => handleEdit()}>Edit Item</DropdownMenuItem>

    <DropdownMenuItem onSelect={() => handleDelete()} disabled={!canDelete}>
      Delete Item
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Behavior Rules

- **Controlled/Uncontrolled**: Supports both controlled (`open` prop) and uncontrolled state
- **Click outside closes**: Menu closes when clicking outside trigger or content
- **Escape key closes**: Standard keyboard behavior for menu dismissal
- **Item selection closes**: Menu closes automatically when item is selected (unless disabled)
- **Collision detection**: Auto-repositions content to stay within viewport
- **asChild pattern**: Trigger can wrap existing elements instead of rendering button
- **Context sharing**: Uses React Context for state management between components

## Visual & Styling

### DropdownMenu (Controller)

- **No visual rendering**: Pure state management component
- **Context provider**: Shares `isOpen`, `setOpen`, and `triggerRef` with children

### DropdownMenuTrigger

- **Default button**: Renders `<button>` with `outline-none` styling
- **asChild mode**: Clones child element and adds click handler
- **Event handling**: Prevents default and stops propagation on click
- **Ref management**: Manages both forwarded ref and context trigger ref

### DropdownMenuContent

- **Positioning**: `position: fixed` with calculated `top/left/right` coordinates
- **Base styling**: `min-w-[12rem]` (192px min-width), `rounded-lg` corners
- **Background**: `bg-[var(--color-bg-base)]` with theme integration
- **Border**: `border-[var(--color-border)]` subtle border
- **Shadow**: `shadow-md` for elevation
- **Padding**: `p-2` (8px) internal padding
- **Animation**: `animate-in fade-in-0 zoom-in-95 duration-150` entrance effect
- **Z-index**: `z-50` to appear above page content

### DropdownMenuItem

- **Layout**: `flex items-center` horizontal layout
- **Spacing**: `rounded-md px-2 py-1.5` (8px horizontal, 6px vertical)
- **Typography**: `text-sm` (14px) with theme text color
- **Interactive states**:
  - Default: `text-[var(--color-text-primary)]`
  - Hover/Focus: `hover:bg-[var(--color-hover-subtle)] focus:bg-[var(--color-hover-subtle)]`
  - Disabled: `pointer-events-none opacity-50`
- **Transitions**: `transition-colors duration-150` for smooth state changes
- **Selection**: `cursor-pointer select-none` for proper UX

### DropdownMenuSeparator

- **Visual**: `h-px` (1px height) horizontal line
- **Color**: `bg-[var(--color-divider)]` theme-aware divider color
- **Spacing**: `my-1` (4px vertical margin)

### DropdownMenuLabel

- **Typography**: `text-xs font-semibold` (12px, semibold weight)
- **Color**: `text-[var(--color-text-muted)]` muted text for hierarchy
- **Spacing**: `px-2 py-1.5` (matches item padding)

## Positioning System

### Alignment Options

- **start**: Left-aligned with trigger
- **center**: Centered on trigger
- **end**: Right-aligned with trigger

### Side Options

- **bottom** (default): Menu appears below trigger
- **top**: Menu appears above trigger
- **left**: Menu appears to left of trigger
- **right**: Menu appears to right of trigger

### Collision Detection

- **Viewport boundaries**: Automatically flips alignment/side to stay in viewport
- **Collision padding**: Maintains minimum distance from viewport edges (8px default)
- **Smart positioning**: Calculates optimal position based on available space
- **Real-time updates**: Recalculates position on window resize or content change

## Accessibility

- **Keyboard navigation**: Escape key closes menu
- **Focus management**: Should implement focus trapping and arrow key navigation
- **ARIA attributes**: Missing proper `role="menu"`, `aria-labelledby`, etc.
- **Screen readers**: Items should announce properly when focused
- **Disabled states**: Visual and interaction feedback for disabled items

## Dependencies

- `@/lib/utils` - cn() utility for className merging
- `React` - Component framework, Context, useRef, useLayoutEffect, useCallback

## Edge Cases

- **Viewport boundaries**: Content repositions automatically to stay visible
- **Rapid open/close**: Click outside uses timeout to prevent immediate closure
- **Ref management**: Handles both forwarded refs and internal context refs
- **Multiple menus**: Only one menu should be open at a time (no built-in management)
- **Dynamic content**: Position recalculates when content size changes
- **Mobile viewports**: May need touch-specific handling

## Usage Examples

### Basic Action Menu

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Delete } from "lucide-react";

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent>
    <DropdownMenuItem onSelect={() => handleEdit()}>
      <Edit className="mr-2 h-4 w-4" />
      Edit
    </DropdownMenuItem>
    <DropdownMenuItem onSelect={() => handleDelete()}>
      <Delete className="mr-2 h-4 w-4" />
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```

### Structured Menu with Sections

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button>User Menu</Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent align="end">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />

    <DropdownMenuItem onSelect={() => navigateToProfile()}>
      Profile
    </DropdownMenuItem>
    <DropdownMenuItem onSelect={() => navigateToSettings()}>
      Settings
    </DropdownMenuItem>

    <DropdownMenuSeparator />

    <DropdownMenuItem onSelect={() => handleLogout()}>Log out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Controlled Menu

```tsx
const [menuOpen, setMenuOpen] = useState(false);

<DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
  <DropdownMenuTrigger>
    <Button>Controlled Menu</Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent>
    <DropdownMenuItem
      onSelect={() => {
        // Custom logic before closing
        handleAction();
        setMenuOpen(false);
      }}
    >
      Custom Action
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>;
```

### Custom Positioned Menu

```tsx
<DropdownMenu>
  <DropdownMenuTrigger>
    <Button>Top Menu</Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent
    side="top"
    align="center"
    sideOffset={10}
    collisionPadding={16}
  >
    <DropdownMenuItem>Option 1</DropdownMenuItem>
    <DropdownMenuItem>Option 2</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Performance Notes

- **Position calculation**: Uses `useLayoutEffect` for synchronous DOM measurements
- **Event cleanup**: Properly removes event listeners on unmount
- **Bundle size**: ~2.5KB including positioning logic
- **Re-renders**: Context optimizations prevent unnecessary re-renders
- **Collision detection**: Efficient viewport boundary calculations

## Testing Strategy

- **Open/close behavior**: Click trigger, outside click, escape key
- **Item selection**: onSelect callbacks and menu closure
- **Positioning**: Test all align/side combinations
- **Collision detection**: Test near viewport edges
- **Keyboard navigation**: Escape key, focus management
- **Disabled states**: Verify disabled items don't trigger actions
- **asChild functionality**: Test with different trigger elements

## Future Improvements

- **Keyboard navigation**: Arrow key navigation between items
- **Focus trapping**: Keep focus within menu when open
- **ARIA compliance**: Add proper roles, labels, and states
- **Submenu support**: Nested dropdown menus
- **Touch gestures**: Mobile-specific interaction patterns
- **Animation options**: Different entrance/exit animations
- **Portal support**: Render menu in different DOM location
- **Radix migration**: Replace custom implementation with Radix primitives

## Accessibility Guidelines

- **Add ARIA roles**: `role="menu"`, `role="menuitem"`, `role="group"`
- **Implement keyboard nav**: Arrow keys, Home, End, Enter, Space
- **Focus trapping**: Focus should stay within open menu
- **Focus restoration**: Return focus to trigger when menu closes
- **ARIA labels**: Use `aria-labelledby` to associate with trigger
- **Screen reader announcements**: Menu state changes should be announced
- **Disabled indication**: Use `aria-disabled` attribute for disabled items

## Dependencies Map

```
dropdown-menu.tsx
├── @/lib/utils
└── React (peer)

Used by:
- Navigation menus
- Action buttons (more options)
- User account menus
- Context menus
- Table row actions
- Toolbar dropdowns
```

## CSS Custom Properties Used

```css
--color-border           /* Content border */
--color-bg-base         /* Content background */
--color-text-primary    /* Item text */
--color-text-muted      /* Label text */
--color-hover-subtle    /* Item hover background */
--color-divider         /* Separator line */
```

## Positioning Algorithm

1. **Calculate initial position** based on `side` and `align` props
2. **Measure content dimensions** using `getBoundingClientRect()`
3. **Check viewport collisions** for all edges
4. **Apply auto-flip logic** if `autoFlip` is enabled
5. **Apply collision padding** to maintain edge distance
6. **Set final position** using `position: fixed` with calculated coordinates

## Breaking Changes Policy

- **Major version**: Changes to positioning logic, context API, or component structure
- **Minor version**: New positioning options, styling features (backward compatible)
- **Patch version**: Bug fixes, accessibility improvements, performance

Last updated: 2025-11-12
