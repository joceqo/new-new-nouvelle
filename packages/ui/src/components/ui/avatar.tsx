import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Flex from "@/components/design_system/Layout/Flex";

const avatarVariants = cva(
  "relative shrink-0 overflow-hidden rounded-md bg-gray-200",
  {
    variants: {
      size: {
        sm: "h-6 w-6 text-xs",
        default: "h-8 w-8 text-sm",
        lg: "h-12 w-12 text-base",
        xl: "h-16 w-16 text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    // Get initials from fallback text
    const getInitials = (text: string) => {
      return text
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    const displayFallback = fallback ? getInitials(fallback) : "?";

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size, className }))}
        {...props}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <Flex
            align="center"
            justify="center"
            className="h-full w-full font-semibold text-gray-600"
          >
            {displayFallback}
          </Flex>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { avatarVariants };
