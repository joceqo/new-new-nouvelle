# IconWrapper Component

A wrapper component for Lucide icons that provides consistent sizing, proper hover areas, and follows Notion-like design patterns.

## Features

- **Predefined Sizes**: xs, sm, md, lg with consistent dimensions
- **Interactive Mode**: Adds padding to ensure hover areas are always larger than the icon
- **Notion-like Pattern**: Container size = icon size + padding (never smaller)
- **Type-safe**: Full TypeScript support with LucideIcon type
- **Flexible**: Works with font-size scaling or fixed sizes

## Installation

```tsx
import { IconWrapper } from "@/components/IconWrapper";
import { Plus, Settings, ChevronDown } from "lucide-react";
```

## Basic Usage

### Default (Font-size scaling)

Icons scale with the parent's font-size:

```tsx
<div style={{ fontSize: '18px' }}>
  <IconWrapper icon={Settings} />
</div>
```

### With Size Props

Use predefined sizes for consistency:

```tsx
<IconWrapper icon={Plus} size="sm" />  // 16px icon
<IconWrapper icon={Settings} size="md" />  // 20px icon
<IconWrapper icon={ChevronDown} size="xs" />  // 12px icon
```

## Interactive Mode (Hover Areas)

**Key Principle**: When `interactive` is enabled, the container adds padding so the hover area is always larger than the icon visual size.

### Problem (Before)

```tsx
// ❌ BAD: Hover area smaller than icon
<IconWrapper
  icon={Plus}
  className="h-4 w-4 p-0.5 hover:bg-gray-100"
/>
// Result: 16px container with 2px padding = 12px hover area (smaller than icon!)
```

### Solution (After)

```tsx
// ✅ GOOD: Hover area always larger than icon
<IconWrapper
  icon={Plus}
  size="sm"
  interactive
  className="rounded-sm hover:bg-gray-100"
/>
// Result: 16px icon + 4px padding = 24px hover area
```

## Size Reference

| Size | Icon Size | Padding | Container Size |
|------|-----------|---------|----------------|
| xs   | 12px      | 4px     | 20px          |
| sm   | 16px      | 4px     | 24px          |
| md   | 20px      | 6px     | 32px          |
| lg   | 24px      | 6px     | 36px          |

## Examples

### Sidebar Action Button

```tsx
<IconWrapper
  icon={MoreHorizontal}
  size="sm"
  interactive
  onClick={(e) => {
    e.stopPropagation();
    handleAction();
  }}
  className="rounded-sm hover:bg-sidebar-accent cursor-pointer"
/>
```

### Dropdown Toggle

```tsx
<IconWrapper
  icon={ChevronDown}
  size="xs"
  className={cn(
    "transition-transform duration-200",
    isOpen && "rotate-180"
  )}
/>
```

### Large Interactive Icon

```tsx
<IconWrapper
  icon={Settings}
  size="lg"
  interactive
  className="rounded-md hover:bg-blue-50 text-blue-600 cursor-pointer"
/>
```

### Static Decorative Icon

```tsx
<IconWrapper
  icon={Mail}
  size="sm"
  className="text-muted-foreground"
/>
```

## Props

### icon (required)

- Type: `LucideIcon`
- The Lucide icon component to render

### size (optional)

- Type: `'xs' | 'sm' | 'md' | 'lg'`
- Predefined icon size
- If not specified, icon scales with font-size (1em)

### interactive (optional)

- Type: `boolean`
- Default: `false`
- Enables interactive mode with proper hover area
- Adds padding to ensure hover area > icon size
- Automatically adds flexbox centering

### className (optional)

- Type: `string`
- Custom CSS classes for styling
- Applied to the container div

### Additional Props

All standard HTML div attributes are supported through spreading.

## Notion-like Patterns

### Action Buttons in Sidebar

```tsx
<IconWrapper
  icon={Plus}
  size="sm"
  interactive
  className="rounded-sm hover:bg-sidebar-accent opacity-0 group-hover:opacity-100"
/>
```

### Icon with Tooltip

```tsx
<Tooltip content="Add item">
  <IconWrapper
    icon={Plus}
    size="md"
    interactive
    className="rounded-md hover:bg-gray-100"
  />
</Tooltip>
```

### Nested Icons with Consistent Sizing

```tsx
<Flex gap="2">
  <IconWrapper icon={FileText} size="sm" />
  <IconWrapper icon={Image} size="sm" />
  <IconWrapper icon={Code} size="sm" />
</Flex>
```

## Best Practices

### DO ✅

- Use `size` prop for consistent icon sizing
- Use `interactive` mode for clickable icons
- Let the container size adjust to icon + padding
- Use with semantic HTML (buttons, links)

```tsx
<button>
  <IconWrapper icon={Plus} size="sm" interactive />
</button>
```

### DON'T ❌

- Don't apply fixed dimensions directly to IconWrapper when using `interactive`
- Don't use `p-*` padding classes manually (interactive handles this)
- Don't use direct Lucide icons for interactive elements

```tsx
// ❌ Bad
<Plus className="h-4 w-4" />

// ❌ Bad
<IconWrapper icon={Plus} className="h-4 w-4 p-1" />

// ✅ Good
<IconWrapper icon={Plus} size="sm" interactive />
```

## Migration Guide

### From Direct Lucide Icons

```tsx
// Before
<Plus className="h-4 w-4 text-gray-500" />

// After
<IconWrapper icon={Plus} size="sm" className="text-gray-500" />
```

### From Fixed-size IconWrapper

```tsx
// Before
<IconWrapper icon={Plus} className="h-4 w-4 p-0.5 hover:bg-gray-100" />

// After
<IconWrapper icon={Plus} size="sm" interactive className="hover:bg-gray-100" />
```

### From Font-size Scaling

```tsx
// Before
<div style={{ fontSize: '16px' }}>
  <IconWrapper icon={Plus} />
</div>

// After
<IconWrapper icon={Plus} size="sm" />
```

## Accessibility

- Ensure interactive icons have proper ARIA labels or tooltips
- Use semantic HTML elements (button, a) for clickable icons
- Maintain sufficient color contrast ratios
- Consider keyboard navigation for interactive icons

```tsx
<button aria-label="Add item">
  <IconWrapper icon={Plus} size="sm" interactive />
</button>
```

## Performance

- IconWrapper is a lightweight wrapper with minimal overhead
- Icons are rendered as SVG elements
- CSS transitions are optimized for 60fps
- No JavaScript animations

## Related Components

- **Sidebar**: Uses IconWrapper extensively for action buttons
- **SidebarItem**: Uses IconWrapper for item icons
- **SidebarSection**: Uses IconWrapper for expand/collapse icons
- **Button**: Can be combined with IconWrapper for icon buttons

## Troubleshooting

### Icon appears too small

**Solution**: Add a `size` prop or increase parent font-size

```tsx
<IconWrapper icon={Plus} size="md" />
```

### Hover area smaller than icon

**Solution**: Use `interactive` mode

```tsx
<IconWrapper icon={Plus} size="sm" interactive />
```

### Icon not aligned properly

**Solution**: Interactive mode adds flexbox centering automatically

```tsx
<IconWrapper icon={Plus} size="sm" interactive />
```

### Icon color not changing on hover

**Solution**: Ensure hover classes are applied to the container

```tsx
<IconWrapper
  icon={Plus}
  size="sm"
  interactive
  className="text-gray-500 hover:text-gray-900"
/>
```
