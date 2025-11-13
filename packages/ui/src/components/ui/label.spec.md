# Component: Label

Status: stable  
Intent: Accessible form label component built on Radix UI Label primitive with proper click-to-focus behavior and peer state handling.

## Props Contract

```ts
import * as LabelPrimitive from "@radix-ui/react-label";
import { VariantProps } from "class-variance-authority";

interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  // Inherits all Radix Label props:
  htmlFor?: string; // Associates with input id
  onClick?: (event: React.MouseEvent) => void;
  // Plus all standard HTML label attributes
}

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
```

## Behavior Rules

- **Click-to-focus**: Clicking label focuses the associated form control
- **Peer state awareness**: Responds to disabled state of peer elements using `peer-disabled:` modifiers
- **Radix foundation**: Built on Radix UI Label for robust accessibility
- **Semantic association**: Proper label-input association for screen readers
- **Event delegation**: Handles click events and delegates to associated controls

## Visual & Styling

### Base Styles

- **Typography**: `text-sm` (14px) with `font-medium` weight
- **Line height**: `leading-none` for compact display
- **Text color**: Inherits theme text color (no explicit color set)

### State Styles

- **Peer disabled**: When associated input is disabled:
  - `peer-disabled:cursor-not-allowed` - Shows not-allowed cursor
  - `peer-disabled:opacity-70` - Reduces opacity to 70%

### Peer CSS Pattern

Uses Tailwind's peer modifier to style based on sibling element state:

```tsx
<Label htmlFor="email" className="peer" />
<Input id="email" disabled className="peer" />
// Label automatically gets disabled styles when Input is disabled
```

## Accessibility

- **Native label semantics**: Uses Radix Label which renders semantic `<label>` element
- **Click target**: Entire label area is clickable to focus associated control
- **Screen reader support**: Properly announces label text for associated control
- **Keyboard navigation**: Label participates in form tab sequence appropriately
- **Association methods**: Supports both `htmlFor` attribute and label wrapping
- **Disabled indication**: Visual and cursor feedback for disabled form controls

## Dependencies

- `@radix-ui/react-label` - Accessible label primitive
- `class-variance-authority` - Variant configuration (currently minimal)
- `@/lib/utils` - cn() utility for className merging
- `React` - Component framework and forwardRef

## Edge Cases

- **Missing association**: Label without `htmlFor` or wrapping may not be accessible
- **Multiple labels**: One input can have multiple labels via `aria-labelledby`
- **Nested interactive elements**: Label should not contain other clickable elements
- **Peer selector limitations**: `peer-disabled:` only works with sibling elements
- **Custom styling conflicts**: User className can override peer state styles

## Usage Examples

### Basic Form Label

```tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

<div>
  <Label htmlFor="username">Username</Label>
  <Input id="username" type="text" />
</div>;
```

### Label Wrapping Input

```tsx
<Label>
  Email Address
  <Input type="email" />
</Label>
```

### With Peer State (Disabled)

```tsx
<div className="space-y-2">
  <Label htmlFor="disabled-input" className="peer">
    Disabled Field
  </Label>
  <Input
    id="disabled-input"
    disabled
    className="peer"
    placeholder="This field is disabled"
  />
  {/* Label automatically shows disabled styling */}
</div>
```

### Custom Styling

```tsx
<Label htmlFor="custom" className="text-base font-bold text-blue-600">
  Custom Styled Label
</Label>
```

### Required Field Indicator

```tsx
<Label htmlFor="required-field">
  Required Field
  <span className="text-red-500 ml-1">*</span>
</Label>
```

## Performance Notes

- **Radix optimization**: Minimal JavaScript overhead from Radix primitives
- **Bundle size**: ~0.3KB including Radix Label primitive
- **Re-renders**: Only when props change (React.forwardRef optimized)
- **CSS peer queries**: Efficient CSS-only state management

## Testing Strategy

- **Click behavior**: Verify clicking label focuses associated input
- **Association**: Test `htmlFor` attribute creates proper label-input relationship
- **Peer states**: Verify disabled styling when sibling input is disabled
- **Screen readers**: Test label announcement with associated controls
- **Keyboard navigation**: Ensure proper tab order and focus management
- **Multiple labels**: Test multiple labels for single input via `aria-labelledby`

## Future Improvements

- **Size variants**: Small, default, large text size options
- **Color variants**: Success, error, warning color states
- **Required indicator**: Built-in asterisk or icon for required fields
- **Tooltip integration**: Help text on hover for complex labels
- **Icon support**: Left icon slot for categorized labels
- **Animation**: Smooth transitions for state changes

## Accessibility Guidelines

- **Always associate**: Use `htmlFor` or wrap input with label
- **Clear text**: Label should clearly describe the input purpose
- **Required indicators**: Mark required fields with both visual and semantic indicators
- **Help text**: Use `aria-describedby` to associate additional help text
- **Group labeling**: Use `fieldset` and `legend` for grouped form controls
- **Don't nest buttons**: Avoid interactive elements inside label

## Dependencies Map

```
label.tsx
├── @radix-ui/react-label (external)
├── class-variance-authority (external)
├── @/lib/utils
└── React (peer)

Used by:
- Form components
- Input groups
- Checkbox/radio groups
- Settings panels
- Registration/login forms
- Data entry interfaces
```

## Radix UI Label Features

Inherits all Radix Label capabilities:

- Proper click delegation
- Screen reader compatibility
- Cross-platform consistency
- Touch-friendly click targets
- Keyboard accessibility

## CSS Peer Pattern Usage

```css
/* When sibling with .peer class is disabled */
.peer:disabled ~ .peer-disabled\:cursor-not-allowed {
  cursor: not-allowed;
}

.peer:disabled ~ .peer-disabled\:opacity-70 {
  opacity: 0.7;
}
```

## Breaking Changes Policy

- **Major version**: Changes to Radix dependency, class structure, or behavior
- **Minor version**: New variants, styling options (backward compatible)
- **Patch version**: Bug fixes, accessibility improvements, performance

Last updated: 2025-11-12
