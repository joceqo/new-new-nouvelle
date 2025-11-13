# Component: Sheet (Slide-in Panel) + SheetOverlay + SheetContent + SheetHeader + SheetTitle + SheetDescription + SheetBody

Status: stable  
Intent: Notion-inspired slide-in panel for contextual content like inbox, settings, and detail views, with directional sliding, overlay, and theme-integrated styling.

## Props Contract

```ts
export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  side?: "left" | "right";
}

export interface SheetOverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export interface SheetContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface SheetHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export interface SheetTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export interface SheetDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export interface SheetBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
```

## Component Structure

```tsx
<Sheet open={open} onOpenChange={setOpen} side="right">
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
      <SheetDescription>Sheet description text</SheetDescription>
    </SheetHeader>
    <SheetBody>
      Main content goes here
    </SheetBody>
  </SheetContent>
</Sheet>
```

## Behavior Rules

- **Directional sliding**: Slides in from left or right side
- **Modal overlay**: Blocks interaction with page content when open
- **Escape to close**: Pressing Escape key closes the sheet
- **Click outside**: Clicking overlay closes the sheet
- **Body scroll lock**: Prevents page scrolling when sheet is open
- **Context-based**: Uses React Context to share state between subcomponents
- **Close button**: X button in top-right corner for explicit closing

## Visual & Styling

### Sheet (Container)

- **Context provider**: Passes `onOpenChange` and `side` to children
- **Conditional rendering**: Only renders when `open={true}`
- **Event management**: Sets up/cleans up Escape key listener and body scroll lock

### SheetOverlay

- **Coverage**: `fixed inset-0` for full viewport
- **Background**: `bg-[var(--color-overlay-light)] backdrop-blur-sm`
  - Semi-transparent dark background with blur
- **Z-index**: `z-50` for top-level stacking
- **Animation**: `animate-in fade-in-0 duration-200`
- **Interactive**: Clicks trigger `onOpenChange(false)`

### SheetContent (Main Panel)

- **Positioning**: `fixed` with directional placement
  - Right side: `right-0 top-0`
  - Left side: `left-0 top-0`
  
- **Dimensions**:
  - Height: `h-full` (full viewport height)
  - Width: `w-full max-w-md` (responsive, max 448px)
  
- **Styling**:
  - Background: `bg-[var(--color-bg-base)]`
  - Border: `border-[var(--color-border)]`
    - Right side: `border-l` (left border)
    - Left side: `border-r` (right border)
  - Padding: `p-6` (24px all around)
  - Shadow: `shadow-2xl` for depth
  
- **Animation**:
  - Right side: `animate-in slide-in-from-right duration-200`
  - Left side: `animate-in slide-in-from-left duration-200`
  
- **Close button**:
  - Position: `absolute right-4 top-4`
  - Style: Minimal icon button with hover state
  - Colors: `text-[var(--color-icon-default)] hover:bg-[var(--color-hover-subtle)] hover:text-[var(--color-icon-hover)]`
  - Focus: `focus:ring-2 focus:ring-[var(--palette-blue-text)]`

### SheetHeader

- **Layout**: Uses `<Flex>` component
  - Direction: `direction="column"`
  - Gap: `gap="2"` (8px between title and description)
  - Bottom padding: `pb="4"` (16px)
- **Alignment**: `text-left`

### SheetTitle

- **Element**: `<h2>` for semantic heading
- **Typography**: `text-lg font-semibold`
- **Color**: `text-[var(--color-text-primary)]`

### SheetDescription

- **Element**: `<p>` for semantic paragraph
- **Typography**: `text-sm`
- **Color**: `text-[var(--color-text-emphasis-medium)]` (70% opacity)

### SheetBody

- **Layout**: Uses `<Flex>` component with `grow="1"`
- **Scrolling**: `overflow-y-auto` for vertical scroll
- **Flex behavior**: Expands to fill available space

## Theme Integration

### Colors (Light Mode)

```css
--color-overlay-light: rgba(0, 0, 0, 0.4);
--color-bg-base: #FFFFFF;
--color-border: #E0E0E0;
--color-icon-default: rgba(55, 53, 48, 0.45);
--color-icon-hover: #373530;
--color-hover-subtle: rgba(0, 0, 0, 0.04);
--color-text-primary: #373530;
--color-text-emphasis-medium: rgba(55, 53, 48, 0.7);
--palette-blue-text: #487CA5;
```

### Colors (Dark Mode)

```css
--color-overlay-light: rgba(0, 0, 0, 0.5);
--color-bg-base: #191919;
--color-border: #444444;
--color-icon-default: rgba(212, 212, 212, 0.45);
--color-icon-hover: #D4D4D4;
--color-hover-subtle: rgba(255, 255, 255, 0.06);
--color-text-primary: #D4D4D4;
--color-text-emphasis-medium: rgba(212, 212, 212, 0.7);
--palette-blue-text: #447ACB;
```

## Accessibility

- **Keyboard control**: Escape to close
- **Focus management**: Close button is keyboard accessible
- **Screen readers**: Semantic HTML with h2/p elements
- **ARIA**: Consider adding `role="dialog"` and `aria-labelledby`
- **Focus trap**: Consider implementing for full keyboard accessibility
- **Close alternatives**: Both overlay click and close button

## Dependencies

- `React` - Component framework, Context API, hooks
- `lucide-react` - X (close) icon
- `@/lib/utils` - cn() utility for className merging
- `@/components/design_system/Layout/Flex` - Layout component

## Edge Cases

- **Multiple sheets**: Only one sheet should be open at a time
- **Direction switching**: Sheet respects `side` prop for left/right placement
- **Content overflow**: SheetBody handles vertical scrolling
- **Empty header**: Header components are optional
- **Body scroll**: Properly restored on close
- **Overlay events**: Stop propagation prevents closing when clicking content

## Usage Examples

### Basic Sheet (Right Side)

```tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetBody,
} from "@/components/ui/sheet";

const [open, setOpen] = useState(false);

return (
  <Sheet open={open} onOpenChange={setOpen} side="right">
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Inbox</SheetTitle>
        <SheetDescription>
          Your notifications and updates
        </SheetDescription>
      </SheetHeader>
      <SheetBody>
        {/* Inbox items */}
      </SheetBody>
    </SheetContent>
  </Sheet>
);
```

### Left-Side Settings Sheet

```tsx
<Sheet open={open} onOpenChange={setOpen} side="left">
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
    </SheetHeader>
    <SheetBody>
      {/* Settings form */}
    </SheetBody>
  </SheetContent>
</Sheet>
```

### Sheet Without Description

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Details</SheetTitle>
    </SheetHeader>
    <SheetBody>
      {/* Content */}
    </SheetBody>
  </SheetContent>
</Sheet>
```

## Performance Notes

- **Conditional rendering**: Sheet only renders when `open={true}`
- **Event listeners**: Properly cleaned up in useEffect returns
- **Body scroll management**: Restored on unmount
- **Animation performance**: Uses GPU-accelerated transforms

## Testing Strategy

- **Open/close**: Test open/onOpenChange behavior
- **Keyboard events**: Test Escape key closing
- **Click outside**: Test overlay click closing
- **Direction**: Test both left and right side rendering
- **Body scroll lock**: Verify scroll is prevented when open
- **Close button**: Test explicit close button click
- **Content scrolling**: Test SheetBody overflow behavior

## Future Improvements

- **Resizable width**: Allow user to drag to resize
- **Multiple sheets**: Stack multiple sheets
- **Animation variants**: Different entrance animations
- **Position variants**: Top, bottom, corner positions
- **Focus trap**: Full keyboard navigation containment
- **Loading state**: Built-in loading skeleton

## Design Patterns

### When to Use Sheet vs Dialog

- **Sheet**: Contextual, related to current page
  - Inbox notifications
  - Page details/properties
  - Filters and settings
  - Search results
  
- **Dialog**: Standalone, interrupting actions
  - Confirmations
  - Alerts
  - Modal forms
  - Critical choices

### Side Selection

- **Right side** (default): Most common
  - Inbox (Notion pattern)
  - Details panels
  - Filters
  
- **Left side**: Less common
  - Navigation extensions
  - Workspace switcher (though Notion uses dropdown)

## Best Practices

1. **Default to right side**: Matches Notion's inbox pattern
2. **Keep content scrollable**: Use SheetBody for long content
3. **Provide title**: Always include SheetTitle for context
4. **Close affordances**: Both overlay and button for flexibility
5. **Prevent body scroll**: Sheet handles this automatically
6. **Limit sheet width**: max-w-md prevents excessive width
7. **Test both themes**: Ensure contrast works in light and dark

Last updated: 2025-11-12
