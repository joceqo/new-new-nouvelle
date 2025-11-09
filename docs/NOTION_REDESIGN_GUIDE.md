# Notion Design System Redesign Guide

This guide shows how to redesign components to match Notion's design while maintaining your existing CSS variable system and using Tailwind's opacity modifiers.

---

## Color & Opacity Patterns

### Using Variables with Transparency

#### Method 1: Tailwind Opacity Modifier (Recommended for Dynamic Values)
```tsx
// Background with 50% opacity
className="bg-[var(--color-bg-hover)]/50"

// Text with 80% opacity
className="text-[var(--color-text-primary)]/80"

// Border with 30% opacity
className="border-[var(--color-border)]/30"

// Multiple properties
className="bg-[var(--color-bg-surface)]/95 text-[var(--color-text-primary)]/70"
```

#### Method 2: Pre-defined RGBA Variables (Better Performance)
For commonly used transparency values, define them directly in `theme.css`:

```css
/* In your theme.css */
:root {
  /* Hover states with transparency */
  --color-hover-subtle: rgba(0, 0, 0, 0.04);
  --color-hover-medium: rgba(0, 0, 0, 0.08);
  --color-hover-strong: rgba(0, 0, 0, 0.12);

  /* Text emphasis levels */
  --color-text-emphasis-high: var(--color-text-primary);
  --color-text-emphasis-medium: rgba(55, 53, 48, 0.7);  /* 70% opacity */
  --color-text-emphasis-low: rgba(55, 53, 48, 0.5);     /* 50% opacity */

  /* Icon opacity levels */
  --color-icon-default: rgba(55, 53, 48, 0.45);
  --color-icon-hover: var(--color-text-primary);
}

[data-theme="dark"] {
  --color-hover-subtle: rgba(255, 255, 255, 0.06);
  --color-hover-medium: rgba(255, 255, 255, 0.12);
  --color-hover-strong: rgba(255, 255, 255, 0.18);

  --color-text-emphasis-medium: rgba(212, 212, 212, 0.7);
  --color-text-emphasis-low: rgba(212, 212, 212, 0.5);

  --color-icon-default: rgba(212, 212, 212, 0.45);
}
```

Then use them directly:
```tsx
className="bg-[var(--color-hover-subtle)]"
className="text-[var(--color-text-emphasis-medium)]"
```

---

## Notion Component Patterns

### 1. **Buttons** (Notion Style)

Notion uses very subtle, ghost-like buttons with minimal borders:

```tsx
// Notion-style ghost button
<button className="
  inline-flex items-center gap-2
  px-3 py-1.5
  text-sm text-[var(--color-text-primary)]
  bg-transparent
  hover:bg-[var(--color-hover-subtle)]
  active:bg-[var(--color-hover-medium)]
  rounded-md
  transition-colors duration-150
">

// Notion-style primary button (rare, mostly for CTAs)
<button className="
  inline-flex items-center gap-2
  px-4 py-2
  text-sm font-medium
  text-white
  bg-[var(--palette-blue-text)]
  hover:bg-[var(--palette-blue-text)]/90
  active:bg-[var(--palette-blue-text)]/80
  rounded-md
  shadow-sm
  transition-all duration-150
">

// Notion-style icon button
<button className="
  inline-flex items-center justify-center
  w-7 h-7
  text-[var(--color-text-secondary)]
  hover:bg-[var(--color-hover-subtle)]
  hover:text-[var(--color-text-primary)]
  rounded-md
  transition-colors duration-150
">
  <Icon className="w-4 h-4" />
</button>
```

### 2. **Cards** (Notion Style)

Notion cards are minimal with subtle borders and hover effects:

```tsx
<div className="
  group
  p-4
  bg-[var(--color-bg-base)]
  border border-[var(--color-border-subtle)]
  hover:bg-[var(--color-bg-hover)]
  hover:shadow-sm
  rounded-lg
  transition-all duration-200
  cursor-pointer
">
  <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
    Title
  </h3>
  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
    Description
  </p>
</div>
```

### 3. **Input Fields** (Notion Style)

Notion inputs have no visible border until focused:

```tsx
<input className="
  w-full
  px-3 py-2
  text-sm text-[var(--color-text-primary)]
  placeholder:text-[var(--color-text-muted)]
  bg-transparent
  border border-transparent
  hover:bg-[var(--color-bg-hover)]
  focus:bg-[var(--color-bg-base)]
  focus:border-[var(--color-border)]
  focus:outline-none
  rounded-md
  transition-all duration-150
" />
```

### 4. **Dropdowns/Menus** (Notion Style)

```tsx
<div className="
  min-w-[240px]
  p-2
  bg-[var(--color-bg-base)]
  border border-[var(--color-border)]
  rounded-lg
  shadow-lg
  shadow-[var(--color-shadow-lg)]
">
  {/* Menu item */}
  <button className="
    w-full
    flex items-center gap-3
    px-2 py-1.5
    text-sm text-[var(--color-text-primary)]
    hover:bg-[var(--color-hover-subtle)]
    rounded-md
    transition-colors duration-150
  ">
    <Icon className="w-4 h-4 text-[var(--color-icon-default)]" />
    <span>Menu Item</span>
    <kbd className="ml-auto text-xs text-[var(--color-text-muted)]">
      ⌘K
    </kbd>
  </button>

  {/* Divider */}
  <div className="h-px my-1 bg-[var(--color-divider)]" />
</div>
```

### 5. **Sidebar Items** (Notion Style)

```tsx
<button className="
  group
  w-full
  flex items-center gap-2
  px-2 py-1
  text-sm text-[var(--sidebar-item-text)]
  bg-[var(--sidebar-item-bg)]
  hover:bg-[var(--sidebar-item-bg-hover)]
  data-[active=true]:bg-[var(--sidebar-item-bg-active)]
  rounded-[var(--sidebar-item-radius)]
  transition-colors duration-150
">
  {/* Icon */}
  <Icon className="
    w-[18px] h-[18px]
    text-[var(--sidebar-icon-color)]
    group-hover:text-[var(--sidebar-icon-hover)]
    transition-colors duration-150
  " />

  {/* Label */}
  <span className="flex-1 text-left truncate">
    Label
  </span>

  {/* Badge (optional) */}
  <span className="
    px-1.5 py-0.5
    text-xs
    text-[var(--color-text-secondary)]
    bg-[var(--color-bg-muted)]
    rounded
  ">
    3
  </span>

  {/* Action button (shows on hover) */}
  <button className="
    opacity-0 group-hover:opacity-100
    p-0.5
    text-[var(--sidebar-action-color)]
    hover:text-[var(--sidebar-action-hover-color)]
    hover:bg-[var(--sidebar-action-bg-hover)]
    rounded
    transition-all duration-150
  ">
    <MoreHorizontal className="w-4 h-4" />
  </button>
</button>
```

### 6. **Modal/Dialog** (Notion Style)

```tsx
{/* Overlay */}
<div className="
  fixed inset-0
  bg-black/40
  backdrop-blur-sm
  data-[state=open]:animate-in
  data-[state=closed]:animate-out
  data-[state=closed]:fade-out-0
  data-[state=open]:fade-in-0
" />

{/* Modal */}
<div className="
  fixed left-1/2 top-1/2
  -translate-x-1/2 -translate-y-1/2
  w-full max-w-lg
  max-h-[85vh]
  p-6
  bg-[var(--color-bg-base)]
  border border-[var(--color-border)]
  rounded-xl
  shadow-2xl
  data-[state=open]:animate-in
  data-[state=closed]:animate-out
  data-[state=closed]:fade-out-0
  data-[state=open]:fade-in-0
  data-[state=closed]:zoom-out-95
  data-[state=open]:zoom-in-95
">
  {/* Modal content */}
</div>
```

### 7. **Badge/Pill** (Notion Style)

```tsx
{/* Subtle badge */}
<span className="
  inline-flex items-center gap-1
  px-2 py-0.5
  text-xs font-medium
  text-[var(--color-accent-blue-text)]
  bg-[var(--color-accent-blue-bg)]
  rounded
">
  Badge
</span>

{/* Colored badge with custom opacity */}
<span className="
  inline-flex items-center gap-1
  px-2 py-0.5
  text-xs font-medium
  text-[var(--palette-purple-text)]
  bg-[var(--palette-purple-bg)]/60
  rounded
">
  Badge
</span>
```

### 8. **Page Header** (Notion Style)

```tsx
<div className="
  flex items-center gap-3
  px-6 py-3
  border-b border-[var(--color-divider)]
  bg-[var(--color-bg-base)]
">
  {/* Icon */}
  <div className="
    flex items-center justify-center
    w-8 h-8
    text-xl
    bg-[var(--color-bg-muted)]
    rounded
  ">
    📄
  </div>

  {/* Title */}
  <input
    placeholder="Untitled"
    className="
      flex-1
      text-2xl font-semibold
      text-[var(--color-text-primary)]
      placeholder:text-[var(--color-text-muted)]/50
      bg-transparent
      border-none
      focus:outline-none
    "
  />

  {/* Actions */}
  <div className="flex items-center gap-2">
    <button className="
      px-3 py-1.5
      text-sm
      text-[var(--color-text-secondary)]
      hover:bg-[var(--color-hover-subtle)]
      rounded-md
    ">
      Share
    </button>
  </div>
</div>
```

---

## Spacing & Sizing Guidelines

### Notion's Spacing Scale
```tsx
// Tight spacing (sidebar items, compact lists)
gap-1      // 4px
gap-1.5    // 6px
gap-2      // 8px

// Medium spacing (form fields, cards)
gap-3      // 12px
gap-4      // 16px

// Loose spacing (sections)
gap-6      // 24px
gap-8      // 32px
```

### Notion's Border Radius
```tsx
rounded-sm   // 2px - badges
rounded      // 4px - inputs, small buttons
rounded-md   // 6px - buttons, sidebar items (Notion's primary radius)
rounded-lg   // 8px - cards, dropdowns
rounded-xl   // 12px - modals
```

### Notion's Font Sizes
```tsx
text-xs      // 12px - badges, captions
text-sm      // 14px - body text, buttons (Notion's primary size)
text-base    // 16px - headings
text-lg      // 18px - large headings
text-xl      // 20px - page titles
text-2xl     // 24px - hero text
```

---

## Animation & Transitions

Notion uses subtle, fast transitions:

```tsx
// Standard transition for interactive elements
transition-colors duration-150

// For hover states with multiple properties
transition-all duration-150

// For opacity changes
transition-opacity duration-200

// For entrance/exit animations
data-[state=open]:animate-in
data-[state=closed]:animate-out
data-[state=closed]:fade-out-0
data-[state=open]:fade-in-0
```

---

## Icon Guidelines

Notion icons are subtle and scale on hover:

```tsx
{/* Default icon */}
<Icon className="
  w-4 h-4
  text-[var(--color-icon-default)]
  group-hover:text-[var(--color-icon-hover)]
  transition-colors duration-150
" />

{/* Larger icon (sidebar) */}
<Icon className="w-[18px] h-[18px]" />

{/* Small icon (badges, inline) */}
<Icon className="w-3 h-3" />
```

---

## Complete Component Examples

### Updated Button Component

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--palette-blue-text)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Notion's primary blue button (rare, mostly for CTAs)
        default:
          "bg-[var(--palette-blue-text)] text-white hover:bg-[var(--palette-blue-text)]/90 active:bg-[var(--palette-blue-text)]/80 shadow-sm",

        // Notion's most common button - subtle ghost
        ghost:
          "text-[var(--color-text-primary)] hover:bg-[var(--color-hover-subtle)] active:bg-[var(--color-hover-medium)]",

        // Notion's destructive action (delete, remove)
        destructive:
          "bg-[var(--palette-red-text)] text-white hover:bg-[var(--palette-red-text)]/90 active:bg-[var(--palette-red-text)]/80 shadow-sm",

        // Notion's subtle outline (rare)
        outline:
          "border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-hover-subtle)] active:bg-[var(--color-hover-medium)]",

        // Notion's secondary colored button
        secondary:
          "bg-[var(--color-bg-muted)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-active)] active:bg-[var(--color-bg-active)]/80",
      },
      size: {
        default: "h-8 px-3 py-1.5 text-sm rounded-md",
        sm: "h-7 px-2 py-1 text-xs rounded",
        lg: "h-10 px-4 py-2 text-base rounded-md",
        icon: "h-7 w-7 rounded-md",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### Updated Input Component

```tsx
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full px-3 py-2 text-sm",
          "text-[var(--color-text-primary)]",
          "placeholder:text-[var(--color-text-muted)]",
          "bg-transparent",
          "border border-transparent",
          "hover:bg-[var(--color-bg-hover)]",
          "focus:bg-[var(--color-bg-base)]",
          "focus:border-[var(--color-border)]",
          "focus:outline-none",
          "rounded-md",
          "transition-all duration-150",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
```

---

## Quick Reference: Color Usage

| Use Case | Variable | With Opacity |
|----------|----------|--------------|
| **Hover background** | `bg-[var(--color-hover-subtle)]` | `bg-[var(--color-bg-hover)]/50` |
| **Active background** | `bg-[var(--color-hover-medium)]` | `bg-[var(--color-bg-active)]/80` |
| **Muted text** | `text-[var(--color-text-muted)]` | `text-[var(--color-text-primary)]/50` |
| **Secondary text** | `text-[var(--color-text-secondary)]` | `text-[var(--color-text-primary)]/70` |
| **Subtle border** | `border-[var(--color-border-subtle)]` | `border-[var(--color-border)]/30` |
| **Divider** | `bg-[var(--color-divider)]` | `bg-[var(--color-border)]/20` |
| **Modal overlay** | N/A | `bg-black/40` |
| **Disabled state** | N/A | `opacity-50` |

---

## Best Practices

1. **Use `ghost` variant as default** - Notion rarely uses filled buttons
2. **Keep transitions fast** - 150ms for interactions, 200ms for animations
3. **Minimal shadows** - Only on dropdowns, modals, and cards
4. **Rounded corners** - `rounded-md` (6px) is Notion's sweet spot
5. **Icon size** - 16px (w-4 h-4) for most UI, 18px for sidebar
6. **Text size** - 14px (text-sm) for almost everything
7. **Subtle hover states** - Use `--color-hover-subtle` (4% opacity)
8. **No outlines** - Use subtle backgrounds instead
9. **Opacity for disabled** - `opacity-50` instead of custom disabled colors
10. **Group hover effects** - Use `group` and `group-hover:` for nested interactions

---

## Common Patterns

### Show on Hover
```tsx
<div className="group">
  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
    Action
  </button>
</div>
```

### Scale on Hover (subtle)
```tsx
<button className="
  transition-transform duration-150
  hover:scale-[1.02]
  active:scale-[0.98]
">
```

### Gradient Backgrounds (rare in Notion)
```tsx
<div className="bg-gradient-to-br from-[var(--palette-blue-bg)] to-[var(--palette-purple-bg)]/50">
```

### Backdrop Blur (modals, overlays)
```tsx
<div className="backdrop-blur-sm bg-black/40">
```

---

## Migration Checklist

- [ ] Update button variants to use `ghost` as primary
- [ ] Remove heavy borders from inputs (make them transparent until focus)
- [ ] Reduce shadow usage (only modals, dropdowns, cards)
- [ ] Update border radius to `rounded-md` (6px) for most elements
- [ ] Change primary font size to `text-sm` (14px)
- [ ] Update hover states to use `--color-hover-subtle`
- [ ] Add group hover effects to sidebar items
- [ ] Update modal overlays to use `bg-black/40`
- [ ] Simplify transitions to 150-200ms
- [ ] Update icon sizes to 16px/18px
- [ ] Add opacity-based disabled states
- [ ] Update spacing to use Notion's tighter scale

---

## Need Help?

For live examples, check:
- Storybook: `npm run storybook`
- Theme documentation: `/packages/ui/THEMING.md`
- Notion UI kit: https://www.notion.so (inspect elements!)
