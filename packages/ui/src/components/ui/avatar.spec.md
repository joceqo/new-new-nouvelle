# Component: Avatar

Status: stable  
Intent: User profile image component with automatic fallback to initials, multiple sizes, and image error handling for displaying user identity.

## Props Contract

```ts
import { VariantProps } from "class-variance-authority";

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;           // Image URL
  alt?: string;           // Image alt text (default: "Avatar")
  fallback?: string;      // Text for generating initials (e.g., "John Doe")
}

// Variant configuration
const avatarVariants = cva(
  // Base classes: layout, overflow, background
  "relative flex shrink-0 overflow-hidden rounded-md bg-gray-200",
  {
    variants: {
      size: "sm" | "default" | "lg" | "xl";
    },
    defaultVariants: {
      size: "default",
    },
  }
);
```

## Behavior Rules

- **Image priority**: Shows `src` image if available and loads successfully
- **Fallback on error**: Automatically switches to initials if image fails to load
- **Initials generation**: Extracts first letter of each word from `fallback` text (max 2 letters)
- **Default fallback**: Shows "?" if no fallback text provided
- **Error handling**: Uses `onError` event to detect image loading failures
- **Responsive sizing**: Text size scales with avatar size for proportional initials

## Visual & Styling

### Base Styles

- **Layout**: `relative flex shrink-0` for container positioning
- **Shape**: `rounded-md` corners (not fully rounded like typical avatars)
- **Overflow**: `overflow-hidden` to clip image to container bounds
- **Background**: `bg-gray-200` fallback background color

### Size Variants

- **sm**: `h-6 w-6 text-xs` - 24x24px with 12px text (compact UI)
- **default**: `h-8 w-8 text-sm` - 32x32px with 14px text (standard)
- **lg**: `h-12 w-12 text-base` - 48x48px with 16px text (prominent)
- **xl**: `h-16 w-16 text-lg` - 64x64px with 18px text (hero/profile)

### Image Rendering

- **Full coverage**: `h-full w-full object-cover` ensures image fills container
- **Aspect ratio**: `object-cover` maintains aspect ratio, crops if necessary
- **Alt text**: Defaults to "Avatar" if not provided

### Fallback Text

- **Centering**: Uses `Flex` component with `align="center" justify="center"` to center initials
- **Typography**: `font-semibold` weight for better visibility
- **Color**: `text-gray-600` for readable contrast on gray background
- **Transform**: `toUpperCase()` ensures consistent capitalization

## Accessibility

- **Alt text**: Image includes alt attribute for screen readers
- **Semantic meaning**: Avatar represents user identity
- **Fallback content**: Initials provide meaningful fallback when image unavailable
- **Color contrast**: Gray text on gray background may need contrast improvement
- **Focus support**: Can be made focusable for interactive avatars

## Dependencies

- `class-variance-authority` - Size variant management
- `@/lib/utils` - cn() utility for className merging
- `@/components/design_system/Layout/Flex` - Layout component for centering fallback content
- `React` - Component framework, forwardRef, useState

## Edge Cases

- **Image loading failure**: Gracefully falls back to initials without UI flicker
- **Missing fallback**: Shows "?" when no fallback text provided
- **Single name**: Single word fallback shows first letter only
- **Long names**: Takes first letter of each word, limited to 2 characters max
- **Empty fallback**: Empty string fallback shows "?"
- **Special characters**: Initials extraction works with Unicode characters
- **Network issues**: Image error handling covers all failure scenarios

## Usage Examples

### Basic User Avatars

```tsx
import { Avatar } from "@/components/ui/avatar";

{
  /* With image */
}
<Avatar
  src="https://example.com/user.jpg"
  alt="John Doe"
  fallback="John Doe"
/>;

{
  /* Fallback to initials */
}
<Avatar fallback="Jane Smith" />;

{
  /* Default fallback */
}
<Avatar />;
```

### Different Sizes

```tsx
{
  /* Small avatar for compact lists */
}
<Avatar size="sm" fallback="JS" />;

{
  /* Standard size for most UI */
}
<Avatar size="default" src="/user.jpg" fallback="John Smith" />;

{
  /* Large for user profiles */
}
<Avatar size="lg" src="/profile.jpg" fallback="Jane Doe" />;

{
  /* Extra large for hero sections */
}
<Avatar size="xl" src="/hero.jpg" fallback="Alex Johnson" />;
```

### User Lists and Comments

```tsx
{
  /* Comment thread */
}
<div className="flex items-start space-x-3">
  <Avatar size="sm" fallback="John Doe" />
  <div>
    <p className="font-semibold">John Doe</p>
    <p className="text-sm text-gray-600">Great work on this project!</p>
  </div>
</div>;

{
  /* User list */
}
<div className="space-y-2">
  {users.map((user) => (
    <div key={user.id} className="flex items-center space-x-3">
      <Avatar src={user.avatar} fallback={user.name} alt={user.name} />
      <span>{user.name}</span>
    </div>
  ))}
</div>;
```

### Interactive Avatars

```tsx
{
  /* Clickable avatar */
}
<Avatar
  src="/user.jpg"
  fallback="User Name"
  className="cursor-pointer hover:opacity-80 transition-opacity"
  onClick={() => openUserProfile()}
  role="button"
  tabIndex={0}
/>;

{
  /* Avatar with status indicator */
}
<div className="relative">
  <Avatar src="/user.jpg" fallback="John" />
  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
</div>;
```

### Custom Styled Avatars

```tsx
{
  /* Rounded avatar (circular) */
}
<Avatar className="rounded-full" src="/user.jpg" fallback="User" />;

{
  /* Custom colors */
}
<Avatar className="bg-blue-100 text-blue-700" fallback="Custom Colors" />;

{
  /* With border */
}
<Avatar
  className="ring-2 ring-blue-500 ring-offset-2"
  src="/user.jpg"
  fallback="Bordered"
/>;
```

## Performance Notes

- **Image optimization**: Component doesn't handle image optimization (should be done externally)
- **Error state**: Uses React state to track image errors (minimal re-render impact)
- **Bundle size**: ~0.4KB including utilities
- **Initials calculation**: Simple string operations, no performance concerns
- **Re-renders**: Only when props change or image error state updates

## Testing Strategy

- **Image loading**: Test successful image load and display
- **Image error handling**: Test fallback when image fails to load
- **Initials generation**: Test various name formats and edge cases
- **Size variants**: Verify correct dimensions and text scaling
- **Accessibility**: Alt text, screen reader announcements
- **Custom styling**: className override behavior

## Future Improvements

- **Status indicators**: Built-in online/offline status dots
- **Image optimization**: Built-in lazy loading and optimization
- **Shape variants**: Circle, square, rounded options
- **Color variants**: Theme-based background colors for initials
- **Upload integration**: Built-in image upload functionality
- **Placeholder loading**: Skeleton or spinner while image loads
- **Group avatars**: Overlapping avatar groups for team indicators
- **Badge integration**: Notification badges on avatars

## Accessibility Guidelines

- **Provide alt text**: Always include descriptive alt text for images
- **Meaningful fallbacks**: Use real names for initials, not usernames
- **Color contrast**: Ensure initials text meets WCAG contrast requirements
- **Interactive feedback**: Add focus indicators for clickable avatars
- **Screen reader context**: Consider adding `aria-label` for additional context
- **Status communication**: Use `aria-label` to announce online/offline status

## Dependencies Map

```
avatar.tsx
├── class-variance-authority (external)
├── @/lib/utils
├── @/components/design_system/Layout/Flex
└── React (peer)

Used by:
- User profiles
- Comment sections
- Team member lists
- Navigation headers
- Chat interfaces
- Activity feeds
- Settings panels
```

## Initials Algorithm

```ts
const getInitials = (text: string) => {
  return text
    .split(" ") // Split by spaces
    .map((word) => word[0]) // Take first character of each word
    .join("") // Join characters
    .toUpperCase() // Convert to uppercase
    .slice(0, 2); // Limit to 2 characters
};

// Examples:
// "John Doe" → "JD"
// "Jane" → "J"
// "Mary Jane Watson" → "MJ"
// "" → ""
```

## Common Use Cases

- **User identification**: Profile pictures in navigation, comments, lists
- **Team displays**: Member avatars in project teams, organization charts
- **Chat interfaces**: Message sender identification in conversations
- **Activity feeds**: User attribution in activity logs, notifications
- **Form inputs**: User selection dropdowns, assignment interfaces

## Breaking Changes Policy

- **Major version**: Changes to size scale, initials algorithm, or image handling
- **Minor version**: New size variants, styling options (backward compatible)
- **Patch version**: Bug fixes, accessibility improvements, performance

Last updated: 2025-11-12
