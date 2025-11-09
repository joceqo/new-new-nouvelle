# Before & After: Notion Redesign Examples

This guide shows real before/after examples of transforming your components to Notion's style while keeping your CSS variables.

---

## 🔘 Button Component

### ❌ Before (Generic shadcn/ui style)
```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default", // ❌ Default is filled button
      size: "default",
    },
  }
);
```

### ✅ After (Notion style)
```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all duration-150",
  {
    variants: {
      variant: {
        // ✨ Ghost is now primary - Notion's most common button
        ghost: "text-[var(--color-text-primary)] hover:bg-[var(--color-hover-subtle)] active:bg-[var(--color-hover-medium)]",

        // Blue CTA - rare, only for critical actions
        default: "bg-[var(--palette-blue-text)] text-white hover:bg-[var(--palette-blue-text)]/90 shadow-sm",

        // Minimal secondary
        secondary: "bg-[var(--color-bg-muted)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-active)]",

        // Destructive - for delete actions
        destructive: "bg-[var(--palette-red-text)] text-white hover:bg-[var(--palette-red-text)]/90 shadow-sm",
      },
      size: {
        default: "h-8 px-3 py-1.5", // ✨ Smaller, more compact
        sm: "h-7 px-2 py-1 text-xs",
        icon: "h-7 w-7", // ✨ Icon buttons are smaller
      },
    },
    defaultVariants: {
      variant: "ghost", // ✅ Ghost is default!
      size: "default",
    },
  }
);
```

**Key Changes:**
- ✅ `ghost` is now the default variant
- ✅ Smaller heights (h-8 instead of h-9)
- ✅ Using CSS variables with opacity modifiers
- ✅ `transition-all duration-150` for smoother animations
- ✅ Added `active:` states for click feedback

---

## 📝 Input Component

### ❌ Before (Visible border style)
```tsx
<input className="
  flex w-full px-3 py-2
  text-sm
  bg-background
  border border-input
  rounded-md
  focus:outline-none
  focus:ring-2
  focus:ring-ring
  focus:ring-offset-2
" />
```

### ✅ After (Notion style - invisible until focus)
```tsx
<input className="
  flex w-full px-3 py-2
  text-sm
  text-[var(--color-text-primary)]
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

**Key Changes:**
- ✅ Transparent background and border by default
- ✅ Subtle hover effect
- ✅ Border only appears on focus
- ✅ No focus ring (Notion uses border instead)
- ✅ Uses CSS variables with semantic names

---

## 🎴 Card Component

### ❌ Before (Heavy borders and shadows)
```tsx
<div className="
  rounded-lg
  border
  bg-card
  text-card-foreground
  shadow-md
">
  <div className="p-6">
    <h3 className="text-2xl font-semibold">Card Title</h3>
    <p className="text-sm text-muted-foreground">Description</p>
  </div>
</div>
```

### ✅ After (Notion style - minimal, hover effect)
```tsx
<div className="
  group
  p-4
  bg-[var(--color-bg-base)]
  border border-[var(--color-border-subtle)]
  hover:bg-[var(--color-bg-hover)]
  hover:shadow-sm
  rounded-lg
  cursor-pointer
  transition-all duration-200
">
  <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
    Card Title
  </h3>
  <p className="mt-1 text-sm text-[var(--color-text-emphasis-medium)]">
    Description with 70% opacity
  </p>

  {/* Actions appear on hover - Notion pattern */}
  <div className="
    mt-3 pt-3
    flex items-center gap-2
    border-t border-[var(--color-divider)]
    opacity-0 group-hover:opacity-100
    transition-opacity duration-200
  ">
    <button>Edit</button>
    <button>Delete</button>
  </div>
</div>
```

**Key Changes:**
- ✅ Smaller padding (p-4 instead of p-6)
- ✅ Smaller text (text-sm instead of text-2xl)
- ✅ Subtle border (subtle variant)
- ✅ Hover effect instead of permanent shadow
- ✅ Group hover for showing actions
- ✅ Text with opacity for hierarchy

---

## 🏷️ Badge Component

### ❌ Before (Bold, outlined)
```tsx
<span className="
  inline-flex items-center
  px-2.5 py-0.5
  text-xs font-semibold
  border
  rounded-full
">
  Badge
</span>
```

### ✅ After (Notion style - colored background)
```tsx
{/* Method 1: Using accent colors */}
<span className="
  inline-flex items-center gap-1
  px-2 py-0.5
  text-xs font-medium
  text-[var(--color-accent-blue-text)]
  bg-[var(--color-accent-blue-bg)]
  rounded
">
  🏷️ Badge
</span>

{/* Method 2: Custom opacity */}
<span className="
  inline-flex items-center gap-1
  px-2 py-0.5
  text-xs font-medium
  text-[var(--palette-purple-text)]
  bg-[var(--palette-purple-bg)]/60
  border border-[var(--palette-purple-text)]/20
  rounded
">
  Tag
</span>
```

**Key Changes:**
- ✅ Colored background instead of outline
- ✅ Slightly rounded (rounded instead of rounded-full)
- ✅ Using accent color variables
- ✅ Optional emoji/icon
- ✅ Can use opacity modifiers for custom colors

---

## 📋 Dropdown Menu

### ❌ Before (Heavy shadows, larger)
```tsx
<div className="
  min-w-[220px]
  p-1
  bg-popover
  border
  rounded-md
  shadow-lg
">
  <button className="
    w-full px-2 py-1.5
    text-sm
    hover:bg-accent
    rounded-sm
  ">
    Menu Item
  </button>
</div>
```

### ✅ After (Notion style - subtle, compact)
```tsx
<div className="
  min-w-[240px]
  p-2
  bg-[var(--color-bg-base)]
  border border-[var(--color-border)]
  rounded-lg
  shadow-md shadow-[var(--color-shadow-md)]
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
    <span className="flex-1 text-left">Menu Item</span>
    <kbd className="text-xs text-[var(--color-text-muted)]">⌘K</kbd>
  </button>

  {/* Divider */}
  <div className="h-px my-1 bg-[var(--color-divider)]" />
</div>
```

**Key Changes:**
- ✅ Slightly larger padding (p-2 instead of p-1)
- ✅ Flex layout for icons and shortcuts
- ✅ More rounded (rounded-lg)
- ✅ Subtle hover effect
- ✅ Icon with muted color
- ✅ Keyboard shortcuts aligned right

---

## 🗂️ Sidebar Item

### ❌ Before (List item style)
```tsx
<a className="
  flex items-center gap-2
  px-3 py-2
  text-sm
  hover:bg-accent
  rounded-md
">
  <Icon className="h-4 w-4" />
  <span>Item</span>
</a>
```

### ✅ After (Notion style - compact, with actions)
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
  {/* Icon with color change on hover */}
  <Icon className="
    w-[18px] h-[18px]
    text-[var(--sidebar-icon-color)]
    group-hover:text-[var(--sidebar-icon-hover)]
    transition-colors
  " />

  {/* Label */}
  <span className="flex-1 text-left truncate">
    Item
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

  {/* Action button - shows on hover */}
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

**Key Changes:**
- ✅ More compact (py-1 instead of py-2)
- ✅ Slightly larger icons (18px)
- ✅ Icon color changes on hover
- ✅ Action button appears on hover
- ✅ Badge for counts
- ✅ Active state styling
- ✅ Sidebar-specific variables

---

## 🗨️ Dialog/Modal

### ❌ Before (Simple overlay)
```tsx
{/* Overlay */}
<div className="fixed inset-0 bg-black/80" />

{/* Modal */}
<div className="
  fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
  w-full max-w-md p-6
  bg-background
  border rounded-lg
  shadow-lg
">
  <h2 className="text-lg font-semibold">Title</h2>
  <p className="text-sm text-muted-foreground">Description</p>
</div>
```

### ✅ After (Notion style - blur, animations)
```tsx
{/* Overlay with blur */}
<div className="
  fixed inset-0
  bg-[var(--color-overlay-light)]
  backdrop-blur-sm
  data-[state=open]:animate-in
  data-[state=closed]:animate-out
  data-[state=closed]:fade-out-0
  data-[state=open]:fade-in-0
" />

{/* Modal with entrance animation */}
<div className="
  fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
  w-full max-w-lg p-6
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
  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
      Title
    </h2>
    <button className="
      p-1
      text-[var(--color-icon-default)]
      hover:bg-[var(--color-hover-subtle)]
      rounded
    ">
      <X className="w-4 h-4" />
    </button>
  </div>

  {/* Content */}
  <p className="text-sm text-[var(--color-text-emphasis-medium)]">
    Description
  </p>

  {/* Footer */}
  <div className="flex justify-end gap-2 mt-6">
    <button variant="ghost">Cancel</button>
    <button variant="default">Confirm</button>
  </div>
</div>
```

**Key Changes:**
- ✅ Backdrop blur effect
- ✅ Lighter overlay (40% instead of 80%)
- ✅ More rounded (rounded-xl)
- ✅ Entrance/exit animations
- ✅ Smaller text (text-base instead of text-lg)
- ✅ Close button in corner
- ✅ Footer with actions

---

## 📄 Page Header

### ❌ Before (Standard header)
```tsx
<header className="
  border-b
  px-6 py-4
">
  <h1 className="text-3xl font-bold">
    Page Title
  </h1>
</header>
```

### ✅ After (Notion style - editable, with icon)
```tsx
<header className="
  flex items-center gap-3
  px-6 py-3
  border-b border-[var(--color-divider)]
  bg-[var(--color-bg-base)]
">
  {/* Page icon */}
  <div className="
    flex items-center justify-center
    w-8 h-8
    text-xl
    bg-[var(--color-bg-muted)]
    rounded
  ">
    📄
  </div>

  {/* Editable title (Notion pattern) */}
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
      text-sm text-[var(--color-text-secondary)]
      hover:bg-[var(--color-hover-subtle)]
      rounded-md
    ">
      Share
    </button>
    <button className="
      p-1.5
      text-[var(--color-icon-default)]
      hover:bg-[var(--color-hover-subtle)]
      rounded-md
    ">
      <MoreHorizontal className="w-4 h-4" />
    </button>
  </div>
</header>
```

**Key Changes:**
- ✅ Page icon with background
- ✅ Editable title (input instead of h1)
- ✅ Smaller padding (py-3 instead of py-4)
- ✅ Action buttons in header
- ✅ More compact (text-2xl instead of text-3xl)
- ✅ Placeholder with reduced opacity

---

## 🎨 Color Palette Example

### ❌ Before (Generic colors)
```tsx
<div className="bg-blue-100 text-blue-900 border-blue-200">
  Blue colored element
</div>
```

### ✅ After (Using Notion color system)
```tsx
{/* Method 1: Using accent colors */}
<div className="
  bg-[var(--color-accent-blue-bg)]
  text-[var(--color-accent-blue-text)]
  border border-[var(--color-accent-blue-bg)]
">
  Blue colored element
</div>

{/* Method 2: Using palette with opacity */}
<div className="
  bg-[var(--palette-blue-bg)]/60
  text-[var(--palette-blue-text)]
  border border-[var(--palette-blue-text)]/20
">
  Blue with custom opacity
</div>

{/* All available colors */}
<div className="flex gap-2">
  <span className="bg-[var(--color-accent-gray-bg)] text-[var(--color-accent-gray-text)]">Gray</span>
  <span className="bg-[var(--color-accent-brown-bg)] text-[var(--color-accent-brown-text)]">Brown</span>
  <span className="bg-[var(--color-accent-orange-bg)] text-[var(--color-accent-orange-text)]">Orange</span>
  <span className="bg-[var(--color-accent-yellow-bg)] text-[var(--color-accent-yellow-text)]">Yellow</span>
  <span className="bg-[var(--color-accent-green-bg)] text-[var(--color-accent-green-text)]">Green</span>
  <span className="bg-[var(--color-accent-blue-bg)] text-[var(--color-accent-blue-text)]">Blue</span>
  <span className="bg-[var(--color-accent-purple-bg)] text-[var(--color-accent-purple-text)]">Purple</span>
  <span className="bg-[var(--color-accent-pink-bg)] text-[var(--color-accent-pink-text)]">Pink</span>
  <span className="bg-[var(--color-accent-red-bg)] text-[var(--color-accent-red-text)]">Red</span>
</div>
```

---

## 📊 Migration Checklist

Transform your components step-by-step:

### Buttons
- [ ] Change default variant to `ghost`
- [ ] Reduce button heights (h-8 instead of h-9)
- [ ] Use `bg-[var(--color-hover-subtle)]` for hover
- [ ] Add `active:` states
- [ ] Update transitions to `duration-150`

### Inputs
- [ ] Make border transparent by default
- [ ] Add `hover:bg-[var(--color-bg-hover)]`
- [ ] Show border only on focus
- [ ] Remove focus ring, keep focus border
- [ ] Use placeholder opacity

### Cards
- [ ] Reduce padding (p-4 instead of p-6)
- [ ] Use subtle border variant
- [ ] Add hover background change
- [ ] Shadow only on hover
- [ ] Add group hover for actions

### Typography
- [ ] Reduce heading sizes (text-sm, text-base)
- [ ] Use text emphasis variables
- [ ] Add proper line-height
- [ ] Use font-medium instead of font-bold

### Spacing
- [ ] Tighten gaps (gap-2 instead of gap-4)
- [ ] Reduce padding throughout
- [ ] Use compact sizing

### Colors
- [ ] Replace hardcoded colors with variables
- [ ] Use accent colors for tags/badges
- [ ] Apply opacity modifiers where needed
- [ ] Use semantic color tokens

---

## 🚀 Quick Wins

Start with these high-impact changes:

1. **Update Button default to ghost**
   ```tsx
   defaultVariants: { variant: "ghost" }
   ```

2. **Make inputs transparent**
   ```tsx
   bg-transparent border-transparent
   ```

3. **Add hover effects**
   ```tsx
   hover:bg-[var(--color-hover-subtle)]
   ```

4. **Use text emphasis**
   ```tsx
   text-[var(--color-text-emphasis-medium)]
   ```

5. **Tighten spacing**
   ```tsx
   gap-2 p-4 py-1
   ```

These 5 changes alone will make your app feel much more like Notion!
