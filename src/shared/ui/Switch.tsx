// src/shared/ui/Switch.tsx

/**
 * @component Switch
 * @maturity Experimental
 *
 * Component Decision Record
 * --------------------------
 * Decision: Uses `role="switch"` semantics via a native
 * `<input type="checkbox" role="switch">` — checkboxes are the
 * correct underlying control for a binary on/off toggle (form
 * submission, `:checked`, Space to toggle all come free), and adding
 * `role="switch"` overrides the accessible role announced to screen
 * readers to "switch" without changing any underlying behavior.
 *
 * Decision: Same `peer sr-only` + styled sibling pattern as
 * Checkbox/Radio, for one consistent construction technique across
 * every toggle-style primitive in this file set.
 *
 * Decision: The thumb's translate distance is expressed as a fixed
 * per-size Tailwind class (`peer-checked:translate-x-4` etc.) rather
 * than computed from track/thumb dimensions at runtime — the sizes
 * are a fixed, known set (`sm`/`md`/`lg`), so a lookup table is
 * simpler and has zero runtime cost.
 *
 * Decision: Color classes use the fully-qualified tokens that
 * resolve against tailwind.config.ts, per the correction started in
 * Select.tsx.
 */

import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Size } from "@/shared/ui/types";

export interface SwitchProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
    size?: Size;
    label?: ReactNode;
    description?: ReactNode;
    error?: boolean;
}

const trackSizeStyles: Record<Size, string> = {
    sm: "h-5 w-9",
    md: "h-6 w-11",
    lg: "h-7 w-[3.25rem]",
};

const thumbSizeStyles: Record<Size, string> = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-5 w-5",
};

const thumbTranslateStyles: Record<Size, string> = {
    sm: "peer-checked:translate-x-4",
    md: "peer-checked:translate-x-5",
    lg: "peer-checked:translate-x-6",
};

const labelTextSizeStyles: Record<Size, string> = {
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base",
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
    (
        { size = "md", label, description, error = false, disabled, className, id, ...rest },
        ref
    ) => {
        return (
            <label
                htmlFor={id}
                className={cn(
                    "inline-flex items-start gap-2",
                    disabled ? "cursor-not-allowed" : "cursor-pointer"
                )}
            >
                <span className="relative inline-flex shrink-0">
                    <input
                        ref={ref}
                        type="checkbox"
                        role="switch"
                        id={id}
                        disabled={disabled}
                        aria-invalid={error || undefined}
                        className={cn("peer sr-only", className)}
                        {...rest}
                    />
                    <span
                        aria-hidden="true"
                        className={cn(
                            "flex items-center shrink-0 rounded-full border p-0.5",
                            "bg-background-surface-raised transition-colors duration-fast ease-standard",
                            "peer-checked:bg-accent",
                            "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-background-base",
                            "peer-disabled:opacity-50 peer-disabled:pointer-events-none",
                            trackSizeStyles[size],
                            error ? "border-status-danger" : "border-border peer-checked:border-accent"
                        )}
                    >
                        <span
                            aria-hidden="true"
                            className={cn(
                                "rounded-full bg-text-inverse shadow-sm transition-transform duration-fast ease-standard",
                                thumbSizeStyles[size],
                                thumbTranslateStyles[size]
                            )}
                        />
                    </span>
                </span>

                {(label || description) && (
                    <span className="flex flex-col">
                        {label && (
                            <span
                                className={cn(
                                    labelTextSizeStyles[size],
                                    "font-medium text-text-primary",
                                    disabled && "text-text-disabled"
                                )}
                            >
                                {label}
                            </span>
                        )}
                        {description && (
                            <span
                                className={cn(
                                    "text-sm text-text-secondary",
                                    disabled && "text-text-disabled"
                                )}
                            >
                                {description}
                            </span>
                        )}
                    </span>
                )}
            </label>
        );
    }
);

Switch.displayName = "Switch";
