// src/shared/ui/Progress.tsx

/**
 * @component Progress
 * @maturity Experimental
 *
 * Component Decision Record
 * --------------------------
 * Decision: The determinate fill is a plain `<div>` with an inline
 * `style={{ width: ... }}` and a CSS `transition-[width]` — no
 * animation library needed for a value that just grows/shrinks.
 *
 * Decision: The indeterminate state uses `framer-motion` (already an
 * approved dependency, unlike a hand-rolled CSS `@keyframes`, which
 * would require adding a keyframe block to `globals.css` — a file
 * out of scope for this component). The bar's `x` position is
 * animated via `motion.div`'s `animate` prop with `repeat: Infinity`.
 * This is the first use of `framer-motion` in `src/shared/ui/`; every
 * other primitive so far has been CSS-only because their transitions
 * were one-shot, not looping.
 *
 * Decision: `role="progressbar"` with `aria-valuenow`/`aria-valuemin`/
 * `aria-valuemax` is omitted entirely (not set to 0) when
 * `indeterminate` is true, per WAI-ARIA guidance — an indeterminate
 * progressbar should not report a numeric value at all.
 *
 * Decision: Color classes use the fully-qualified tokens that
 * resolve against tailwind.config.ts, per the correction started in
 * Select.tsx.
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import type { Size } from "@/shared/ui/types";

export type ProgressVariant = "default" | "success" | "warning" | "danger";

export interface ProgressProps {
    /** Current value. Ignored when `indeterminate` is true. */
    value?: number;
    /** Defaults to 100. */
    max?: number;
    size?: Size;
    variant?: ProgressVariant;
    /** Renders a continuously looping bar instead of a fixed-width fill, for unknown-duration work. */
    indeterminate?: boolean;
    /** Accessible label. Required if there is no visible surrounding text describing what this measures. */
    label?: string;
    /** Renders the current percentage next to the bar. Ignored when `indeterminate`. */
    showValue?: boolean;
    className?: string;
}

const trackSizeStyles: Record<Size, string> = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
};

const fillVariantStyles: Record<ProgressVariant, string> = {
    default: "bg-accent",
    success: "bg-status-success",
    warning: "bg-status-warning",
    danger: "bg-status-danger",
};

export function Progress({
    value = 0,
    max = 100,
    size = "md",
    variant = "default",
    indeterminate = false,
    label,
    showValue = false,
    className,
}: ProgressProps) {
    const clampedValue = Math.min(Math.max(value, 0), max);
    const percentage = max > 0 ? (clampedValue / max) * 100 : 0;

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div
                role="progressbar"
                aria-label={label}
                aria-valuenow={indeterminate ? undefined : clampedValue}
                aria-valuemin={indeterminate ? undefined : 0}
                aria-valuemax={indeterminate ? undefined : max}
                className={cn(
                    "relative flex-1 overflow-hidden rounded-full bg-background-surface-raised",
                    trackSizeStyles[size]
                )}
            >
                {indeterminate ? (
                    <motion.div
                        className={cn("absolute inset-y-0 w-1/3 rounded-full", fillVariantStyles[variant])}
                        animate={{ x: ["-100%", "300%"] }}
                        transition={{ duration: 1.2, ease: "easeInOut", repeat: Infinity }}
                    />
                ) : (
                    <div
                        className={cn(
                            "h-full rounded-full transition-[width] duration-medium ease-standard",
                            fillVariantStyles[variant]
                        )}
                        style={{ width: `${percentage}%` }}
                    />
                )}
            </div>

            {showValue && !indeterminate && (
                <span className="text-sm text-text-secondary tabular-nums">
                    {Math.round(percentage)}%
                </span>
            )}
        </div>
    );
}

Progress.displayName = "Progress";
