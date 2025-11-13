# Component: Card (+ CardHeader, CardTitle, CardDescription, CardContent, CardFooter)

Status: stable  
Intent: Container component system for grouping related content with consistent spacing, theming, and optional hover effects.

## Props Contract

```ts
// All card components extend standard HTML div attributes
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

// Title and Description have specialized element types
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}
```

## Component Structure

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title Text</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>Main content area</CardContent>
  <CardFooter>Actions and metadata</CardFooter>
</Card>
```

## Behavior Rules

- **Modular composition**: Each part is optional and can be used independently
- **Hover enhancement**: Card container has subtle hover state with shadow
- **Semantic HTML**: CardTitle renders as `<h3>`, CardDescription as `<p>`
- **Flexible layout**: No enforced content structure beyond spacing
- **Theme integration**: All colors use CSS custom properties

## Visual & Styling

### Card (Container)

- **Shape**: `rounded-lg` corners with subtle border
- **Background**: `bg-[var(--color-bg-base)]` with theme integration
- **Border**: `border-[var(--color-border-subtle)]` light border
- **Hover state**: `hover:bg-[var(--color-bg-hover)] hover:shadow-sm`
- **Transition**: `transition-all duration-200` for smooth interactions
- **Text color**: `text-[var(--color-text-primary)]`

### CardHeader

- **Layout**: `flex flex-col` with vertical stacking
- **Spacing**: `space-y-1.5` (6px) between child elements
- **Padding**: `p-4` (16px) all around

### CardTitle

- **Element**: `<h3>` for semantic heading structure
- **Typography**: `text-sm font-semibold leading-none tracking-tight`
- **Color**: `text-[var(--color-text-primary)]`

### CardDescription

- **Element**: `<p>` for semantic paragraph
- **Typography**: `text-sm` with medium emphasis color
- **Color**: `text-[var(--color-text-emphasis-medium)]`

### CardContent

- **Padding**: `p-4 pt-0` (16px sides/bottom, 0px top to connect with header)
- **Layout**: No layout constraints - completely flexible

### CardFooter

- **Layout**: `flex items-center` for horizontal action layout
- **Padding**: `p-4 pt-0` (matches CardContent)
- **Alignment**: Items centered vertically

## Accessibility

- **Semantic structure**: Proper heading hierarchy with `<h3>` titles
- **Container semantics**: Card acts as generic container (no special ARIA needed)
- **Focus management**: Focusable elements inside cards get proper focus indicators
- **Screen readers**: Clear content structure with headings and paragraphs
- **Keyboard navigation**: Standard tab navigation through card contents

## Dependencies

- `@/lib/utils` - cn() utility for className merging
- `React` - Component framework and forwardRef

## Edge Cases

- **Empty sections**: Header, Content, Footer can be omitted without layout issues
- **Long content**: Content area scrolls naturally if needed
- **Nested cards**: Cards can contain other cards but consider visual hierarchy
- **Interactive cards**: Entire card can be made clickable by wrapping in button/link
- **Custom spacing**: Users can override padding via className
- **Title semantic levels**: Always renders `<h3>` - consider context for heading hierarchy

## Usage Examples

### Basic Card

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

<Card>
  <CardHeader>
    <CardTitle>Project Settings</CardTitle>
    <CardDescription>
      Manage your project configuration and preferences.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p>Configuration options go here...</p>
  </CardContent>
  <CardFooter>
    <Button>Save Changes</Button>
  </CardFooter>
</Card>;
```

### Minimal Card (Content Only)

```tsx
<Card>
  <CardContent>
    <p>Simple content without header or footer.</p>
  </CardContent>
</Card>
```

### Interactive Card

```tsx
<Card className="cursor-pointer hover:shadow-md">
  <CardHeader>
    <CardTitle>Click Me</CardTitle>
    <CardDescription>This entire card is interactive</CardDescription>
  </CardHeader>
</Card>
```

### Card Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>
    <CardHeader>
      <CardTitle>Card 1</CardTitle>
    </CardHeader>
    <CardContent>Content 1</CardContent>
  </Card>

  <Card>
    <CardHeader>
      <CardTitle>Card 2</CardTitle>
    </CardHeader>
    <CardContent>Content 2</CardContent>
  </Card>
</div>
```

### Form Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>User Information</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label htmlFor="name">Name</Label>
      <Input id="name" placeholder="Enter your name" />
    </div>
    <div>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  </CardContent>
  <CardFooter className="justify-between">
    <Button variant="outline">Cancel</Button>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

## Performance Notes

- **Zero JavaScript**: Pure CSS styling with no runtime overhead
- **Bundle size**: ~0.4KB for all card components
- **Re-renders**: Only when props change (React.forwardRef optimized)
- **Layout efficiency**: Flexbox and CSS Grid friendly

## Testing Strategy

- **Composition**: Test all valid combinations of card parts
- **Responsive design**: Test card behavior at different screen sizes
- **Content overflow**: Test long titles, descriptions, and content
- **Interactive states**: Hover effects and focus management
- **Accessibility**: Heading structure and screen reader navigation
- **Custom styling**: className override behavior

## Future Improvements

- **Variant system**: Outlined, filled, elevated card styles
- **Size variants**: Compact, default, large padding options
- **Color variants**: Success, warning, error themed cards
- **Animation presets**: Smooth entrance/exit animations
- **Drag and drop**: Built-in drag handle and drop zone support
- **Collapsible content**: Expandable card sections
- **Loading states**: Skeleton loading for card content

## Accessibility Guidelines

- **Heading hierarchy**: Ensure CardTitle fits properly in page heading structure
- **Interactive feedback**: Make interactive cards clearly clickable
- **Focus indicators**: Ensure focusable elements have visible focus
- **Content structure**: Use CardDescription to provide context
- **Color contrast**: Verify text colors meet WCAG guidelines
- **Keyboard navigation**: Test tab order through card contents

## Dependencies Map

```
card.tsx
├── @/lib/utils
└── React (peer)

Used by:
- Dashboard layouts
- Settings panels
- Product listings
- User profiles
- Form containers
- Content previews
- Navigation menus
```

## CSS Custom Properties Used

```css
--color-border-subtle     /* Card border */
--color-bg-base          /* Card background */
--color-bg-hover         /* Hover background */
--color-text-primary     /* Main text and title */
--color-text-emphasis-medium /* Description text */
```

## Component Relationships

- **CardHeader** → Contains CardTitle + CardDescription
- **CardTitle** → Should be primary heading for card content
- **CardDescription** → Provides additional context for title
- **CardContent** → Main flexible content area
- **CardFooter** → Actions, metadata, navigation

## Breaking Changes Policy

- **Major version**: Changes to component structure, default styling, or HTML semantics
- **Minor version**: New variants, styling options (backward compatible)
- **Patch version**: Bug fixes, accessibility improvements, performance

Last updated: 2025-11-12
