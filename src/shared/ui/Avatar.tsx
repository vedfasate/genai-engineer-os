// src/shared/ui/Avatar.tsx

/**
 * @component Avatar
 * @maturity Experimental
 *
 * Component Decision Record
 * --------------------------
 * Decision: When `src` is provided without `alt`, a development-only
 * console.warn fires. useEffect is called unconditionally on every
 * render (React's Rules of Hooks); the NODE_ENV/src/alt check lives
 * INSIDE the effect body, not around the hook call itself. This is
 * behaviorally identical to the previous version but requires no
 * eslint-disable and no discussion of whether the pattern is safe —
 * it simply follows the rule directly.
 */

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import type { Size } from "@/shared/ui/types";

export interface AvatarProps extends React.ComponentPropsWithoutRef<"span"> {
    src?: string;
    alt?: string;
    fallback?: string;
    size?: Size;
}

const sizeStyles: Record<Size, string> = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
};

export function Avatar({
    src,
    alt,
    fallback,
    size = "md",
    className,
    ...rest
}: AvatarProps) {
    const [imageFailed, setImageFailed] = useState(false);
    const showImage = Boolean(src) && !imageFailed;
    const showFallbackText = !showImage && Boolean(fallback);

    useEffect(() => {
        if (process.env.NODE_ENV !== "production" && src && !alt) {
            console.warn(
                '[Avatar] "src" was provided without "alt". Avatars usually represent identity, not decoration — pass a descriptive alt (e.g. the person\'s name) unless this avatar is genuinely decorative.'
            );
        }
    }, [src, alt]);

    return (
        <span
            data-size={size}
            className={cn(
                "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-secondary text-primary font-medium select-none",
                sizeStyles[size],
                className
            )}
            {...rest}
        >
            {showImage ? (
                <img
                    src={src}
                    alt={alt ?? ""}
                    onError={() => setImageFailed(true)}
                    className="h-full w-full object-cover"
                />
            ) : showFallbackText ? (
                <span aria-hidden={!alt || undefined}>{fallback}</span>
            ) : (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-3/5 w-3/5 opacity-60"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                </svg>
            )}
        </span>
    );
}

Avatar.displayName = "Avatar";
