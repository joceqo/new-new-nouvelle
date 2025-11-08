import * as React from "react";
import { cn } from "../../lib/utils";

const workspaceIconVariants = "relative inline-flex shrink-0 items-center justify-center rounded";

const iconContentVariants = "flex h-full w-full items-center justify-center rounded p-[0.2em] font-medium";

export interface WorkspaceIconProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The workspace identifier - can be:
   * - A URL (http/https) for an image/SVG
   * - An emoji (e.g., "🚀", "🎨")
   * - A single character (e.g., "c", "A")
   * - A workspace name (will use first letter, e.g., "Code Projects" → "c")
   * - If not provided, defaults to "?"
   */
  value?: string;
  /**
   * Alt text for image when value is a URL
   */
  alt?: string;
}

export const WorkspaceIcon = React.forwardRef<
  HTMLDivElement,
  WorkspaceIconProps
>(({ className, value, alt, style, ...props }, ref) => {
  const [imageError, setImageError] = React.useState(false);

  // Helper function to check if a string is a URL
  const isUrl = (str: string): boolean => {
    return str.startsWith('http://') || str.startsWith('https://') || str.startsWith('/');
  };

  // Helper function to check if a string is an emoji
  const isEmoji = (str: string): boolean => {
    const emojiRegex = /[\p{Emoji}\p{Emoji_Component}]/u;
    return emojiRegex.test(str);
  };

  // Determine the type and content to display
  const displayInfo = React.useMemo(() => {
    const val = value || "?";

    // Check if it's a URL (image)
    if (isUrl(val)) {
      return { type: 'image' as const, content: val };
    }

    // Check if it's an emoji
    if (isEmoji(val)) {
      return { type: 'emoji' as const, content: val };
    }

    // Otherwise treat as text - take first character and lowercase
    return {
      type: 'text' as const,
      content: val.charAt(0).toLowerCase()
    };
  }, [value]);

  // Reset image error when value changes
  React.useEffect(() => {
    setImageError(false);
  }, [value]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={alt || `${displayInfo.content} icon`}
      className={cn(workspaceIconVariants, className)}
      style={{
        width: "1.4em",
        height: "1.4em",
        fontSize: "inherit",
        ...style,
      }}
      {...props}
    >
      {displayInfo.type === 'image' && !imageError ? (
        <img
          src={displayInfo.content}
          alt={alt || "Workspace icon"}
          className="h-full w-full rounded object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={cn(
          iconContentVariants,
          displayInfo.type === 'text' && "bg-gray-200 text-gray-600 uppercase"
        )}>
          <div style={{ lineHeight: 1, fontSize: displayInfo.type === 'emoji' ? "1em" : "0.65em" }}>
            {displayInfo.content}
          </div>
        </div>
      )}
    </div>
  );
});

WorkspaceIcon.displayName = "WorkspaceIcon";
