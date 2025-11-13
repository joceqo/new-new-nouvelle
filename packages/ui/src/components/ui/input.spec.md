# Component: Input

Status: stable  
Intent: Text input component with Notion-inspired subtle styling, hover and focus states, and full HTML input feature support.

## Props Contract

```ts
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}
```

## Behavior Rules

- **Pure HTML input**: Extends all native input attributes and behaviors
- **Transparent by default**: Background is transparent until interaction
- **Hover enhancement**: Light background on hover for better discoverability
- **Focus states**: Background becomes solid and border appears on focus
- **File input support**: Styled file input buttons using `file:` pseudo-selectors
- **Disabled handling**: Cursor and opacity changes for disabled state
- **Type agnostic**: Supports all HTML input types (text, email, password, number, etc.)

## Visual & Styling

### Base Styles

- **Dimensions**: `h-9` (36px height), `w-full` width, `rounded-md` corners
- **Spacing**: `px-3 py-2` (12px horizontal, 8px vertical padding)
- **Typography**: `text-sm` (14px) with primary text color
- **Border**: Transparent border that appears on focus

### Interactive States

- **Default**: `bg-transparent border-transparent` - Nearly invisible
- **Hover**: `hover:bg-[var(--color-bg-hover)]` - Subtle background hint
- **Focus**: `focus:bg-[var(--color-bg-base)] focus:border-[var(--color-border)]` - Solid background with border
- **Placeholder**: `placeholder:text-[var(--color-text-muted)]` - Muted text color
- **Disabled**: `disabled:cursor-not-allowed disabled:opacity-50` - Visual feedback

### File Input Styling

- **File button**: `file:border-0 file:bg-transparent file:text-sm file:font-medium`
- **File text color**: `file:text-[var(--color-text-primary)]`

### Theme Integration

Uses CSS custom properties for consistent theming:

- `--color-text-primary` - Main input text
- `--color-text-muted` - Placeholder text
- `--color-bg-hover` - Hover background
- `--color-bg-base` - Focus background
- `--color-border` - Focus border

## Accessibility

- **Native semantics**: Inherits all HTML input accessibility features
- **Focus indicators**: Visible background and border changes on focus
- **Label association**: Works with HTML `<label>` and `aria-labelledby`
- **Placeholder support**: Proper placeholder attribute handling
- **Type enforcement**: Supports semantic input types for better UX
- **Screen readers**: Native input announcements and validation messages
- **Keyboard navigation**: Standard Tab navigation and input behavior

## Dependencies

- `@/lib/utils` - cn() utility for className merging
- `React` - Component framework and forwardRef

## Edge Cases

- **Type conflicts**: User-provided `type` prop overrides default
- **Custom className**: User classes merged after component classes
- **Controlled vs uncontrolled**: Supports both `value` and `defaultValue` patterns
- **File inputs**: Special styling for file selection buttons
- **Long values**: Text overflows with horizontal scroll (native behavior)
- **Validation states**: No built-in validation styling (add via className)

## Usage Examples

### Basic Text Input

```tsx
import { Input } from "@/components/ui/input";

<Input
  type="text"
  placeholder="Enter your name..."
  value={name}
  onChange={(e) => setName(e.target.value)}
/>;
```

### Form Integration

```tsx
<form>
  <div>
    <label htmlFor="email">Email</label>
    <Input id="email" type="email" placeholder="you@example.com" required />
  </div>

  <div>
    <label htmlFor="password">Password</label>
    <Input id="password" type="password" placeholder="••••••••" minLength={8} />
  </div>
</form>
```

### Specialized Input Types

```tsx
{
  /* Number input */
}
<Input type="number" min="0" max="100" step="1" placeholder="0" />;

{
  /* File upload */
}
<Input type="file" accept=".pdf,.doc,.docx" multiple />;

{
  /* Search input */
}
<Input type="search" placeholder="Search..." />;
```

### Validation and States

```tsx
{
  /* Error state (via custom className) */
}
<Input
  type="email"
  className="border-red-500 focus:border-red-500"
  aria-invalid="true"
  aria-describedby="email-error"
/>;

{
  /* Disabled state */
}
<Input type="text" value="Read-only value" disabled />;
```

## Performance Notes

- **Zero JavaScript**: Pure CSS styling with no runtime overhead
- **Bundle size**: ~0.5KB including utilities
- **Re-renders**: Only when props change (React.forwardRef optimized)
- **Native performance**: Leverages browser-optimized input handling

## Testing Strategy

- **Input types**: Test various HTML input types (text, email, password, number, file, etc.)
- **Event handling**: onChange, onFocus, onBlur, onKeyDown
- **Validation**: Required, pattern, min/max attributes
- **Accessibility**: Label association, screen reader announcements
- **File inputs**: File selection and validation
- **Controlled/uncontrolled**: Both value patterns

## Future Improvements

- **Validation states**: Built-in error/success styling variants
- **Size variants**: Small, default, large size options
- **Icon integration**: Left and right icon slots
- **Loading states**: Spinner overlay for async operations
- **Mask support**: Input masking for phone numbers, dates, etc.
- **Auto-resize**: Textarea-style auto-height for text inputs
- **Clear button**: Optional X button to clear input value

## Accessibility Guidelines

- **Always use labels**: Every input needs an associated label
- **Provide context**: Use `aria-describedby` for help text and errors
- **Validation feedback**: Announce errors with `aria-invalid` and `role="alert"`
- **Required fields**: Mark with `required` attribute and visual indicator
- **Placeholder limitations**: Don't rely on placeholder as the only label
- **Focus management**: Ensure focus moves logically through form

## Dependencies Map

```
input.tsx
├── @/lib/utils
└── React (peer)

Used by:
- Form components
- Search interfaces
- Login/registration forms
- Settings panels
- Data entry workflows
- File upload interfaces
```

## CSS Custom Properties Used

```css
--color-text-primary    /* Input text color */
--color-text-muted      /* Placeholder text */
--color-bg-hover        /* Hover background */
--color-bg-base         /* Focus background */
--color-border          /* Focus border */
```

## HTML Input Type Support

Fully supports all HTML5 input types:

- `text`, `email`, `password`, `search`, `url`, `tel`
- `number`, `range`, `date`, `time`, `datetime-local`
- `file`, `color`, `checkbox`, `radio`
- `hidden`, `submit`, `reset`, `button`

## Breaking Changes Policy

- **Major version**: Changes to default styling, class structure, or behavior
- **Minor version**: New features, additional styling options (backward compatible)
- **Patch version**: Bug fixes, accessibility improvements, performance

Last updated: 2025-11-12
