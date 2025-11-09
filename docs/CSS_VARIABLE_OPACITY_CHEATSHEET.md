# CSS Variables + Opacity Cheat Sheet

Quick reference for using your CSS variables with Tailwind's opacity syntax.

---

## 🎨 Three Ways to Use Transparency

### 1️⃣ Pre-defined RGBA Variables (✅ Best Performance)
**When to use:** For commonly used transparency values

```tsx
// Uses pre-defined variables from theme.css
className="bg-[var(--color-hover-subtle)]"           // 4% black
className="text-[var(--color-text-emphasis-medium)]" // 70% opacity
className="bg-[var(--sidebar-item-bg-hover)]"        // Pre-defined hover
```

**Pros:**
- ✅ Best performance (no runtime calculation)
- ✅ Works in all browsers
- ✅ Consistent values across components

**Available Pre-defined Transparency Variables:**
```css
/* Hover states */
--color-hover-subtle       // rgba(0, 0, 0, 0.04) light / rgba(255, 255, 255, 0.06) dark
--color-hover-medium       // rgba(0, 0, 0, 0.08) light / rgba(255, 255, 255, 0.12) dark
--color-hover-strong       // rgba(0, 0, 0, 0.12) light / rgba(255, 255, 255, 0.18) dark

/* Text emphasis */
--color-text-emphasis-high      // 100% (full color)
--color-text-emphasis-medium    // 70%
--color-text-emphasis-low       // 50%
--color-text-emphasis-disabled  // 30%

/* Icons */
--color-icon-default       // 45%
--color-icon-muted         // 30%
--color-icon-hover         // 100%

/* Borders */
--color-border-alpha-10    // 10%
--color-border-alpha-20    // 20%
--color-border-alpha-30    // 30%

/* Overlays */
--color-overlay-light      // 40%
--color-overlay-medium     // 60%
--color-overlay-dark       // 80%
```

---

### 2️⃣ Tailwind Opacity Modifier (🎯 Flexible)
**When to use:** For dynamic or one-off transparency values

```tsx
// Variable + /opacity
className="bg-[var(--color-bg-hover)]/50"           // 50% opacity
className="text-[var(--color-text-primary)]/80"     // 80% opacity
className="border-[var(--color-border)]/30"         // 30% opacity
className="bg-[var(--palette-blue-bg)]/20"          // 20% opacity
```

**Pros:**
- ✅ Very flexible (any opacity value)
- ✅ Clean syntax
- ✅ Works with any CSS variable

**Cons:**
- ⚠️ Slightly slower (runtime calculation)
- ⚠️ Can't be extracted to separate CSS

---

### 3️⃣ Direct Variable (No Transparency)
**When to use:** For full opacity colors

```tsx
className="bg-[var(--sidebar-bg)]"
className="text-[var(--color-text-primary)]"
className="border-[var(--color-border)]"
```

---

## 🎯 Common Use Cases

### Hover Effects
```tsx
// Method 1: Pre-defined (recommended)
<button className="
  bg-transparent
  hover:bg-[var(--color-hover-subtle)]
  active:bg-[var(--color-hover-medium)]
">

// Method 2: Dynamic opacity
<button className="
  bg-transparent
  hover:bg-[var(--color-bg-hover)]/40
  active:bg-[var(--color-bg-hover)]/70
">
```

### Text Emphasis
```tsx
// Method 1: Pre-defined levels
<h1 className="text-[var(--color-text-emphasis-high)]">Title</h1>
<p className="text-[var(--color-text-emphasis-medium)]">Body</p>
<span className="text-[var(--color-text-emphasis-low)]">Caption</span>

// Method 2: Custom opacity
<p className="text-[var(--color-text-primary)]/75">Custom</p>
```

### Colored Badges/Tags
```tsx
// Using pre-defined accent colors + custom opacity
<span className="
  bg-[var(--color-accent-blue-bg)]/50
  text-[var(--color-accent-blue-text)]
  border border-[var(--color-accent-blue-text)]/20
">
  Blue Tag
</span>
```

### Modal Overlays
```tsx
// Pre-defined overlay
<div className="bg-[var(--color-overlay-light)] backdrop-blur-sm" />

// Custom opacity
<div className="bg-black/40 backdrop-blur-sm" />
```

### Icons
```tsx
// Pre-defined icon colors
<Icon className="text-[var(--color-icon-default)] hover:text-[var(--color-icon-hover)]" />

// Custom opacity
<Icon className="text-[var(--color-text-primary)]/45" />
```

### Borders
```tsx
// Pre-defined alpha borders
<div className="border border-[var(--color-border-alpha-20)]" />

// Custom opacity
<div className="border border-[var(--color-border)]/15" />
```

---

## 🚀 Performance Tips

### DO ✅
```tsx
// 1. Use pre-defined variables for common patterns
hover:bg-[var(--color-hover-subtle)]

// 2. Define custom RGBA variables for repeated values
// In theme.css:
--my-custom-hover: rgba(0, 0, 0, 0.06);
// In component:
hover:bg-[var(--my-custom-hover)]

// 3. Group related opacity changes
<div className="opacity-50 hover:opacity-100">
  {/* All children inherit opacity */}
</div>
```

### DON'T ❌
```tsx
// 1. Don't use opacity modifiers repeatedly
// Bad:
<div className="bg-[var(--color-bg-hover)]/50">
  <p className="bg-[var(--color-bg-hover)]/50" />
  <p className="bg-[var(--color-bg-hover)]/50" />
</div>

// Good - add to theme.css instead:
--color-bg-hover-50: rgba(245, 245, 245, 0.5);

// 2. Don't mix methods unnecessarily
// Bad:
hover:bg-[var(--color-hover-subtle)] active:bg-[var(--color-bg-hover)]/80

// Good (consistent):
hover:bg-[var(--color-hover-subtle)] active:bg-[var(--color-hover-medium)]
```

---

## 📋 Quick Reference Table

| Use Case | Pre-defined Variable | Opacity Modifier Alternative |
|----------|---------------------|------------------------------|
| **Subtle hover** | `bg-[var(--color-hover-subtle)]` | `bg-[var(--color-bg-hover)]/40` |
| **Medium hover** | `bg-[var(--color-hover-medium)]` | `bg-[var(--color-bg-hover)]/80` |
| **Secondary text** | `text-[var(--color-text-emphasis-medium)]` | `text-[var(--color-text-primary)]/70` |
| **Muted text** | `text-[var(--color-text-emphasis-low)]` | `text-[var(--color-text-primary)]/50` |
| **Default icon** | `text-[var(--color-icon-default)]` | `text-[var(--color-text-primary)]/45` |
| **Modal overlay** | `bg-[var(--color-overlay-light)]` | `bg-black/40` |
| **Subtle border** | `border-[var(--color-border-alpha-10)]` | `border-[var(--color-border)]/10` |

---

## 🎨 All Available Color Variables

### Base Colors
```tsx
--palette-default-text/bg
--palette-gray-text/bg
--palette-brown-text/bg
--palette-orange-text/bg
--palette-yellow-text/bg
--palette-green-text/bg
--palette-blue-text/bg
--palette-purple-text/bg
--palette-pink-text/bg
--palette-red-text/bg
```

### Semantic Colors
```tsx
--color-bg-base
--color-bg-surface
--color-bg-muted
--color-bg-hover
--color-bg-active

--color-text-primary
--color-text-secondary
--color-text-muted
--color-text-inverse

--color-border
--color-border-subtle
--color-divider
```

### Accent Colors (for tags/badges)
```tsx
--color-accent-[color]-text
--color-accent-[color]-bg
// Where [color] = default, gray, brown, orange, yellow, green, blue, purple, pink, red
```

---

## 💡 Real-World Examples

### Notion-style Button
```tsx
<button className="
  px-3 py-1.5
  text-sm text-[var(--color-text-primary)]
  bg-transparent
  hover:bg-[var(--color-hover-subtle)]
  active:bg-[var(--color-hover-medium)]
  rounded-md
  transition-colors duration-150
">
  Click me
</button>
```

### Notion-style Card
```tsx
<div className="
  p-4
  bg-[var(--color-bg-base)]
  border border-[var(--color-border-subtle)]
  hover:bg-[var(--color-bg-hover)]
  hover:shadow-sm
  rounded-lg
  transition-all
">
  <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
    Title
  </h3>
  <p className="mt-1 text-sm text-[var(--color-text-emphasis-medium)]">
    Description with 70% opacity
  </p>
</div>
```

### Colored Tag with Custom Opacity
```tsx
<span className="
  inline-flex items-center gap-1
  px-2 py-0.5
  text-xs font-medium
  text-[var(--palette-blue-text)]
  bg-[var(--palette-blue-bg)]/60
  border border-[var(--palette-blue-text)]/20
  rounded
">
  🏷️ Design
</span>
```

### Modal with Overlay
```tsx
{/* Overlay */}
<div className="
  fixed inset-0
  bg-[var(--color-overlay-light)]
  backdrop-blur-sm
" />

{/* Modal */}
<div className="
  fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
  w-full max-w-lg p-6
  bg-[var(--color-bg-base)]
  border border-[var(--color-border)]
  rounded-xl shadow-2xl
">
  {/* Content */}
</div>
```

### Icon Button with Hover
```tsx
<button className="
  inline-flex items-center justify-center
  w-7 h-7
  text-[var(--color-icon-default)]
  hover:text-[var(--color-icon-hover)]
  hover:bg-[var(--color-hover-subtle)]
  rounded-md
  transition-all duration-150
">
  <Icon className="w-4 h-4" />
</button>
```

---

## 🔧 When to Add New Variables

**Add to `theme.css` if:**
- ✅ Used in 3+ places
- ✅ Specific opacity value (e.g., 45%, 37%, 62%)
- ✅ Needs to change between light/dark mode
- ✅ Part of a pattern (hover states, emphasis levels)

**Use opacity modifier if:**
- ✅ One-off usage
- ✅ Common opacity (10%, 20%, 50%, etc.)
- ✅ Experimenting with values
- ✅ Component-specific styling

---

## 📚 References

- **Main Guide:** `/NOTION_REDESIGN_GUIDE.md`
- **Theme Variables:** `/packages/ui/src/styles/theme.css`
- **Example Components:**
  - `/packages/ui/src/components/ui/button-notion.tsx`
  - `/packages/ui/src/components/ui/card-notion.tsx`
- **Tailwind Opacity Docs:** https://tailwindcss.com/docs/background-color#changing-the-opacity
