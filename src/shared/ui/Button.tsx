// src/shared/ui/Button.tsx

/**
 * @component Button
 * @maturity Experimental
 *
 * Component Decision Record
 * --------------------------
 * Decision: Implement variants/sizes as plain lookup maps rather than
 * class-variance-authority. CVA is not part of the approved dependency
 * list and a static Record<> gives the same type-safe variant switching
 * without a new runtime dependency.
 *
 * Decision: Styling is 100% Tailwind utility classes that resolve to
 * design tokens already extended in tailwind.config.ts (colors, radius,
 * shadows, motion durations/easing) — no raw hex/px values.
 *
 * Decision: Loading state disables the button and swaps the leading
 * icon slot for a spinner rather than unmounting children, so the
 * button's width does not jump and screen readers get a stable label
 * via aria-busy instead of a changing accessible name.
 *
 * Decision: forwardRef is used so this primitive is composable inside
 * future Tooltip/Popover/Dropdown trigger patterns without a wrapper.
 */

import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Size } from "@/shared/ui/types";

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "danger";

export interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Visual style. Defaults to "primary". */
    variant?: ButtonVariant;
    /** Size scale, shared with other UI Foundation primitives. Defaults to "md". */
    size?: Size;
    /** Shows a spinner in place of the leading icon and disables interaction. */
    isLoading?: boolean;
    /** Icon rendered before the label. Hidden while isLoading. */
    leadingIcon?: ReactNode;
    /** Icon rendered after the label. Hidden while isLoading. */
    trailingIcon?: ReactNode;
    /** Stretches the button to fill its container's width. */
    fullWidth?: boolean;
}

const baseStyles = [
    "inline-flex items-center justify-center gap-2",
    "font-medium select-none whitespace-nowrap",
    "rounded-md border border-transparent",
    "transition-colors duration-fast ease-standard",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:ring-offset-background-base",
    "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
].join(" ");

const variantStyles: Record<ButtonVariant, string> = {
    primary: cn(
        "bg-accent text-text-inverse",
        "hover:bg-accent-hover",
        "active:bg-accent-active",
        "shadow-sm"
    ),
    secondary: cn(
        "bg-background-surface-raised text-text-primary",
        "hover:bg-background-overlay",
        "active:bg-background-surface"
    ),
    outline: cn(
        "bg-transparent text-text-primary border-border",
        "hover:bg-background-surface-raised",
        "active:bg-background-surface"
    ),
    ghost: cn(
        "bg-transparent text-text-primary",
        "hover:bg-background-surface-raised",
        "active:bg-background-surface"
    ),
    danger: cn(
        "bg-status-danger text-text-inverse",
        "hover:bg-status-danger-subtle",
        "active:bg-status-danger-subtle",
        "shadow-sm"
    ),
};

const sizeStyles: Record<Size, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = "primary",
            size = "md",
            isLoading = false,
            leadingIcon,
            trailingIcon,
            fullWidth = false,
            disabled,
            className,
            children,
            type = "button",
            ...rest
        },
        ref
    ) => {
        const isDisabled = disabled || isLoading;

        return (
            <button
                ref={ref}
                type={type}
                disabled={isDisabled}
                aria-busy={isLoading || undefined}
                aria-disabled={isDisabled || undefined}
                data-variant={variant}
                data-size={size}
                data-loading={isLoading || undefined}
                data-disabled={isDisabled || undefined}
                className={cn(
                    baseStyles,
                    variantStyles[variant],
                    sizeStyles[size],
                    fullWidth && "w-full",
                    className
                )}
                {...rest}
            >
                {isLoading ? (
                    <Loader2 className="animate-spin" aria-hidden="true" />
                ) : (
                    leadingIcon && (
                        <span aria-hidden="true" className="inline-flex shrink-0">
                            {leadingIcon}
                        </span>
                    )
                )}

                {children}

                {!isLoading && trailingIcon && (
                    <span aria-hidden="true" className="inline-flex shrink-0">
                        {trailingIcon}
                    </span>
                )}
            </button>
        );
    }
);

Button.displayName = "Button";
