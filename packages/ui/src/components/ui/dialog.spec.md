# Component: Dialog (+ DialogOverlay, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter)

Status: stable  
Intent: Modal dialog system with overlay, focus management, keyboard navigation, and structured content areas for forms, confirmations, and content display.

## Props Contract

```ts
// Main Dialog Controller
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

// Dialog Parts
interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}
interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}
interface DialogDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}
interface DialogBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}
```

## Component Structure

```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Optional description</DialogDescription>
    </DialogHeader>
    <DialogBody>Main content area</DialogBody>
    <DialogFooter>Action buttons</DialogFooter>
  </DialogContent>
</Dialog>
```

## Behavior Rules

- **Controlled component**: Must provide `open` state and `onOpenChange` handler
- **Escape key closes**: Automatically closes dialog on Escape keypress
- **Overlay click closes**: Clicking outside dialog content closes it
- **Body scroll lock**: Prevents body scrolling when dialog is open
- **Focus management**: Dialog content stops propagation of overlay clicks
- **Context sharing**: Uses React Context to share `onOpenChange` between components
- **Portal rendering**: Dialog renders at root level (z-index 50)

## Visual & Styling

### Dialog (Controller)

- **No visual rendering**: Only handles state and event management
- **Body scroll**: Sets `overflow: hidden` on document.body when open

### DialogOverlay

- **Backdrop**: `fixed inset-0` with semi-transparent background
- **Blur effect**: `backdrop-blur-sm` for modern glass effect
- **Color**: `bg-[var(--color-overlay-light)]` theme-aware overlay
- **Animation**: `animate-in fade-in-0 duration-150` smooth entrance
- **Z-index**: `z-50` to appear above page content

### DialogContent

- **Positioning**: `fixed inset-0` with `flex items-center justify-center`
- **Container**: `max-w-lg w-full` responsive width with maximum constraint
- **Background**: `bg-[var(--color-bg-base)]` with theme integration
- **Border**: `border border-[var(--color-border)]` subtle border
- **Shadow**: `shadow-2xl` for elevation
- **Shape**: `rounded-xl` for modern appearance
- **Animation**: `animate-in fade-in-0 zoom-in-95 duration-150` entrance effect
- **Close button**: Absolute positioned X button with hover states

### DialogHeader

- **Layout**: `flex flex-col space-y-1.5` vertical stacking with 6px spacing
- **Padding**: `px-6 pt-6 pb-4` (24px sides, 24px top, 16px bottom)

### DialogTitle

- **Element**: `<h2>` for semantic heading structure
- **Typography**: `text-base font-semibold leading-none tracking-tight`
- **Color**: `text-[var(--color-text-primary)]`

### DialogDescription

- **Element**: `<p>` for semantic paragraph
- **Typography**: `text-sm` with medium emphasis color
- **Color**: `text-[var(--color-text-emphasis-medium)]`

### DialogBody

- **Padding**: `px-6 py-4` (24px sides, 16px top/bottom)
- **Layout**: Completely flexible content area

### DialogFooter

- **Layout**: `flex items-center justify-end gap-2` right-aligned actions with 8px spacing
- **Padding**: `px-6 py-4` (24px sides, 16px top/bottom)
- **Border**: `border-t border-[var(--color-divider)]` top divider line

## Accessibility

- **Focus management**: Dialog should trap focus within content when open
- **Escape key**: Standard dialog behavior for dismissal
- **Screen readers**: Proper heading structure with `<h2>` titles
- **ARIA attributes**: Should add `role="dialog"`, `aria-labelledby`, `aria-describedby`
- **Backdrop interaction**: Click outside to close is standard UX pattern
- **Close button**: X button includes screen reader text "Close"

## Dependencies

- `lucide-react` - X icon for close button
- `@/lib/utils` - cn() utility for className merging
- `React` - Component framework, forwardRef, useContext, useEffect

## Edge Cases

- **Multiple dialogs**: Only one dialog should be open at a time (no nesting)
- **Long content**: DialogBody should scroll if content overflows
- **Mobile viewport**: Dialog uses `p-4` padding to avoid edge collision
- **Animation conflicts**: CSS animations may conflict with other animation libraries
- **Body scroll restore**: Ensures body overflow is restored on unmount
- **Event propagation**: DialogContent stops clicks from reaching overlay

## Usage Examples

### Basic Confirmation Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const [isOpen, setIsOpen] = useState(false);

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        Are you sure you want to delete this item? This action cannot be undone.
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>;
```

### Form Dialog

```tsx
<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create New Project</DialogTitle>
      <DialogDescription>
        Enter the details for your new project below.
      </DialogDescription>
    </DialogHeader>
    <DialogBody>
      <form className="space-y-4">
        <div>
          <Label htmlFor="project-name">Project Name</Label>
          <Input id="project-name" placeholder="Enter project name" />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input id="description" placeholder="Project description" />
        </div>
      </form>
    </DialogBody>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Create Project</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Content Display Dialog

```tsx
<Dialog open={showDetails} onOpenChange={setShowDetails}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Project Details</DialogTitle>
    </DialogHeader>
    <DialogBody>
      <div className="space-y-4">
        <p>Detailed project information...</p>
        <div className="grid grid-cols-2 gap-4">
          <div>Created: March 15, 2024</div>
          <div>Status: Active</div>
        </div>
      </div>
    </DialogBody>
  </DialogContent>
</Dialog>
```

### Custom Styled Dialog

```tsx
<Dialog open={customOpen} onOpenChange={setCustomOpen}>
  <DialogContent className="max-w-md bg-gradient-to-br from-blue-50 to-purple-50">
    <DialogHeader>
      <DialogTitle className="text-center text-lg">Welcome!</DialogTitle>
      <DialogDescription className="text-center">
        Thanks for joining our platform.
      </DialogDescription>
    </DialogHeader>
    <DialogBody className="text-center">
      <p>Your account has been successfully created.</p>
    </DialogBody>
    <DialogFooter className="justify-center">
      <Button>Get Started</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Performance Notes

- **Conditional rendering**: Dialog only renders when `open={true}`
- **Event cleanup**: Properly removes event listeners on unmount
- **Context optimization**: Minimal context value prevents unnecessary re-renders
- **Bundle size**: ~1.5KB including animations and utilities
- **Animation performance**: CSS animations run on GPU for smooth performance

## Testing Strategy

- **Open/close behavior**: Test controlled state management
- **Keyboard interactions**: Escape key closes dialog
- **Click outside**: Overlay clicks close dialog
- **Content interaction**: Clicks inside content don't close dialog
- **Body scroll lock**: Verify scroll prevention when open
- **Focus management**: Test focus trapping and restoration
- **Multiple dialogs**: Ensure proper stacking behavior

## Future Improvements

- **Focus trapping**: Implement proper focus trap within dialog
- **ARIA attributes**: Add proper `role`, `aria-labelledby`, `aria-describedby`
- **Size variants**: Small, medium, large, full-screen dialog sizes
- **Animation options**: Slide-up, slide-down, scale animations
- **Nested dialog support**: Handle dialog stacking scenarios
- **Mobile optimization**: Improved mobile layout and gestures
- **Portal customization**: Allow custom portal target

## Accessibility Guidelines

- **Focus trapping**: Implement focus trap to keep focus within dialog
- **Initial focus**: Focus should move to first focusable element or close button
- **Focus restoration**: Return focus to trigger element when dialog closes
- **ARIA labels**: Add `aria-labelledby` pointing to DialogTitle
- **ARIA description**: Add `aria-describedby` pointing to DialogDescription
- **Role attribute**: Add `role="dialog"` to DialogContent
- **Screen reader announcements**: Dialog opening should be announced

## Dependencies Map

```
dialog.tsx
├── lucide-react (external)
├── @/lib/utils
└── React (peer)

Used by:
- Form modals
- Confirmation dialogs
- Content viewers
- Settings panels
- Onboarding flows
- Error displays
```

## CSS Custom Properties Used

```css
--color-overlay-light     /* Backdrop overlay */
--color-bg-base          /* Dialog background */
--color-border           /* Dialog border */
--color-icon-default     /* Close button icon */
--color-icon-hover       /* Close button icon hover */
--color-hover-subtle     /* Close button hover background */
--palette-blue-text      /* Focus ring color */
--color-text-primary     /* Title text */
--color-text-emphasis-medium /* Description text */
--color-divider          /* Footer border */
```

## Breaking Changes Policy

- **Major version**: Changes to component structure, context API, or behavior
- **Minor version**: New components, styling options (backward compatible)
- **Patch version**: Bug fixes, accessibility improvements, performance

Last updated: 2025-11-12
