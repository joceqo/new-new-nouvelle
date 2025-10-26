# Sidebar Components

A complete Notion-inspired sidebar system with comprehensive theming support, built with React, Radix UI, and CSS variables.

## Components

### `<Sidebar>`
The main container component that provides the overall sidebar structure.

### `<SidebarHeader>`
Workspace header with icon, name, and action buttons (collapse, new page).

### `<SidebarItem>`
Individual sidebar navigation items with hover states, badges, and actions.

### `<SidebarSection>`
Collapsible sections like "Favorites" or "Documents".

## CSS Variables & Theming

All sidebar components use CSS variables for complete theme customization. These are defined in `/src/styles/theme.css`.

### Sidebar Container

```css
--sidebar-bg                  /* Sidebar background color */
--sidebar-border              /* Sidebar border color */
```

**Light mode:** `#F7F6F3` (warm off-white)
**Dark mode:** `#1E1E1E` (dark gray)

### Sidebar Header

```css
--sidebar-header-bg           /* Header background (default: transparent) */
--sidebar-header-hover-bg     /* Header background on hover */
--sidebar-header-text         /* Workspace name text color */
--sidebar-header-icon         /* Icon color (default state) */
--sidebar-header-icon-hover   /* Icon color on hover */
--sidebar-divider-color       /* Divider line under header */
```

**Light mode hover:** `rgba(0, 0, 0, 0.04)`
**Dark mode hover:** `rgba(255, 255, 255, 0.06)`

### Sidebar Items

```css
--sidebar-item-bg             /* Item background (default: transparent) */
--sidebar-item-bg-hover       /* Item background on hover */
--sidebar-item-bg-active      /* Item background when active/selected */
--sidebar-item-text           /* Item text color */
--sidebar-item-text-muted     /* Secondary text color */
--sidebar-item-radius         /* Border radius (6px) */
```

**Key principle:** Items are transparent by default and only get background colors on hover/active states.

### Sidebar Icons

```css
--sidebar-icon-color          /* Icon color (default) */
--sidebar-icon-hover          /* Icon color on hover */
```

### Sidebar Actions

```css
--sidebar-action-color        /* Action button color (ellipsis, plus) */
--sidebar-action-hover-color  /* Action button color on hover */
--sidebar-action-bg-hover     /* Action button background on hover */
```

## Usage Examples

### Basic Sidebar

```tsx
import { Sidebar, SidebarItem, SidebarSection } from "@/components/Sidebar";
import { Home, FileText } from "lucide-react";

function App() {
  return (
    <Sidebar
      icon={<span>🏠</span>}
      workspaceName="My Workspace"
      onToggleSidebar={() => {}}
      onCreateNewPage={() => {}}
    >
      <SidebarSection title="Documents">
        <SidebarItem icon={FileText} label="Getting Started" />
        <SidebarItem icon={FileText} label="Guide" isActive />
      </SidebarSection>
    </Sidebar>
  );
}
```

### Sidebar Header

```tsx
import { SidebarHeader } from "@/components/Sidebar/SidebarHeader";
import { Home } from "lucide-react";

<SidebarHeader
  icon={<IconWrapper icon={Home} />}
  label="My Workspace"
  isOpen={isWorkspaceSwitcherOpen}
  onLabelClick={() => setIsWorkspaceSwitcherOpen(!isWorkspaceSwitcherOpen)}
  onToggleSidebar={() => setSidebarCollapsed(true)}
  onCreateNewPage={() => createPage()}
  showDivider={true}
/>
```

**Features:**
- ✅ Hover background state
- ✅ Dropdown chevron (shown on hover, or when `isOpen`)
- ✅ Action buttons (new page, collapse sidebar)
- ✅ Optional divider
- ✅ Text truncation for long workspace names

### Sidebar Item

```tsx
import { SidebarItem } from "@/components/Sidebar/SidebarItem";
import { FileText } from "lucide-react";

<SidebarItem
  icon={FileText}
  label="Documentation"
  isActive={false}
  isExpandable={true}
  isExpanded={false}
  onToggleExpand={() => {}}
  showActions={true}
  onAdd={(e) => console.log("Add")}
  onMore={(e) => console.log("More")}
  badge="New"
  badgeVariant="accent"
  level={0}
  href="/docs"
/>
```

**Features:**
- ✅ Transparent background by default
- ✅ Hover/active states
- ✅ Expandable chevron
- ✅ Nesting support with `level` prop
- ✅ Badges (default or accent style)
- ✅ Action buttons (shown on hover)
- ✅ Link support (`href` prop)

### Sidebar Section

```tsx
import { SidebarSection } from "@/components/Sidebar/SidebarSection";

<SidebarSection
  title="Favorites"
  defaultCollapsed={false}
  isCollapsed={isCollapsed}
  onToggleCollapse={(collapsed) => setIsCollapsed(collapsed)}
>
  <SidebarItem icon={FileText} label="Page 1" />
  <SidebarItem icon={FileText} label="Page 2" />
</SidebarSection>
```

**Features:**
- ✅ Collapsible with animated chevron
- ✅ Uppercase section title
- ✅ Controlled or uncontrolled state
- ✅ Hover effects

## Nesting & Indentation

Use the `level` prop to create nested hierarchies:

```tsx
<SidebarItem icon={Folder} label="Parent" level={0} isExpandable isExpanded />
<SidebarItem icon={File} label="Child 1" level={1} />
<SidebarItem icon={File} label="Child 2" level={1} />
<SidebarItem icon={File} label="Grandchild" level={2} />
```

Each level adds `1rem` of left padding.

## Customizing Colors

### Method 1: Override CSS Variables

```css
:root {
  --sidebar-bg: #FAFAFA;
  --sidebar-item-bg-hover: rgba(59, 130, 246, 0.1);
  --sidebar-item-bg-active: rgba(59, 130, 246, 0.2);
}
```

### Method 2: Use ThemeProvider

```tsx
import { useTheme } from "@/components/ThemeProvider";

function CustomTheme() {
  const { setCustomTheme } = useTheme();

  setCustomTheme({
    semantic: {
      background: {
        surface: "#F0F0F0", // Changes sidebar background
      },
    },
  });
}
```

### Method 3: Edit theme-config.json

See `/src/styles/theme-config.json` for the full theme structure.

## Light vs Dark Mode

The sidebar automatically adapts to light/dark mode:

| Element          | Light Mode                  | Dark Mode                      |
|------------------|-----------------------------|--------------------------------|
| Sidebar bg       | `#F7F6F3` (warm off-white)  | `#1E1E1E` (dark gray)          |
| Item hover       | `rgba(0,0,0,0.04)`          | `rgba(255,255,255,0.06)`       |
| Item active      | `rgba(0,0,0,0.08)`          | `rgba(255,255,255,0.12)`       |
| Header hover     | `rgba(0,0,0,0.04)`          | `rgba(255,255,255,0.06)`       |
| Divider          | `rgba(0,0,0,0.1)`           | `rgba(255,255,255,0.1)`        |

## Design Principles

1. **Background Hierarchy**
   - Sidebar container has a base background color
   - Items are transparent by default
   - Items get overlay colors on hover/active (not solid colors)

2. **Hover States**
   - All interactive elements have hover feedback
   - Icons change color on hover
   - Backgrounds use subtle overlays

3. **Visual Consistency**
   - All spacing uses consistent tokens
   - Border radius is uniform (`6px`)
   - Icons are sized consistently

4. **Accessibility**
   - ARIA attributes for tree structure
   - Keyboard navigation support
   - Sufficient color contrast

## Storybook

View all components in Storybook:

- `Sidebar` → Components/Sidebar/Sidebar
- `SidebarHeader` → Components/Sidebar/SidebarHeader
- `SidebarItem` → Components/Sidebar/SidebarItem
- `SidebarSection` → Components/Sidebar/SidebarSection

## Files

```
src/components/Sidebar/
├── Sidebar/
│   ├── Sidebar.tsx
│   ├── Sidebar.stories.tsx
│   └── index.ts
├── SidebarHeader/
│   ├── SidebarHeader.tsx
│   ├── SidebarHeader.stories.tsx
│   └── index.ts
├── SidebarItem/
│   ├── SidebarItem.tsx
│   ├── SidebarItem.stories.tsx
│   └── index.ts
├── SidebarSection/
│   ├── SidebarSection.tsx
│   └── index.ts
└── README.md (this file)
```

## Related Documentation

- [THEMING.md](/packages/ui/THEMING.md) - Complete theming guide
- [theme.css](/packages/ui/src/styles/theme.css) - CSS variable definitions
- [theme-config.json](/packages/ui/src/styles/theme-config.json) - Theme configuration
