// src/shared/ui/Radio.tsx

/**
 * @component Radio
 * @maturity Experimental
 *
 * Component Decision Record
 * --------------------------
 * Decision: Exports two things — `Radio` (a single native radio input
 * with a styled circle, visually identical in construction to
 * Checkbox: `peer sr-only` input + sibling styled span driven by
 * `peer-checked:`) and `RadioGroup` (a declarative wrapper that
 * renders a set of `Radio`s from an `options` array, matching the
 * declarative shape `Select`/`Checkbox` already established).
 * `RadioGroup` is built on top of `Radio` rather than duplicating its
 * markup, so there is exactly one place the visual circle is defined.
 *
 * Decision: `RadioGroup` is controlled only (`value`/`onChange`
 * required) — radios only make sense as a group with shared
 * exclusivity, and an uncontrolled group would need its own internal
 * state duplicate of what most callers already keep in a form
 * library. `Radio` itself can still be used uncontrolled/standalone
 * outside a group if a future consumer needs that.
 *
 * Decision: `RadioGroup` sets `role="radiogroup"` and points
 * `aria-labelledby` at a generated id on its own `label` prop when
 * provided, rather than requiring `Label.tsx` (doesn't exist yet).
 *
 * Decision: Color classes use the fully-qualified tokens that
 * resolve against tailwind.config.ts, per the correction started in
 * Select.tsx.
 */

import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Size } from "@/shared/ui/types";

export interface RadioProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
    size?: Size;
    label?: ReactNode;
    description?: ReactNode;
    error?: boolean;
}

const circleSizeStyles: Record<Size, string> = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
};

const dotSizeStyles: Record<Size, string> = {
    sm: "h-1.5 w-1.5",
    md: "h-2 w-2",
    lg: "h-2.5 w-2.5",
};

const labelTextSizeStyles: Record<Size, string> = {
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base",
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
                <span className="relative inline-flex shrink-0 mt-0.5">
                    <input
                        ref={ref}
                        type="radio"
                        id={id}
                        disabled={disabled}
                        aria-invalid={error || undefined}
                        className={cn("peer sr-only", className)}
                        {...rest}
                    />
                    <span
                        aria-hidden="true"
                        className={cn(
                            "relative flex items-center justify-center shrink-0 rounded-full border",
                            "bg-background-surface transition-colors duration-fast ease-standard",
                            "peer-checked:border-accent",
                            "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-background-base",
                            "peer-disabled:opacity-50 peer-disabled:pointer-events-none",
                            circleSizeStyles[size],
                            error
                                ? "border-status-danger"
                                : "border-border peer-hover:border-border-strong"
                        )}
                    >
                        <span
                            aria-hidden="true"
                            className={cn(
                                "rounded-full bg-accent opacity-0 scale-0 transition-all duration-fast ease-standard",
                                "peer-checked:opacity-100 peer-checked:scale-100",
                                dotSizeStyles[size]
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

Radio.displayName = "Radio";

export interface RadioOption {
    label: ReactNode;
    value: string;
    description?: ReactNode;
    disabled?: boolean;
}

export interface RadioGroupProps {
    /** Shared `name` attribute tying the underlying radio inputs together. */
    name: string;
    value: string;
    onChange: (value: string) => void;
    options: RadioOption[];
    size?: Size;
    /** Optional heading rendered above the group and wired via aria-labelledby. */
    label?: ReactNode;
    orientation?: "vertical" | "horizontal";
    disabled?: boolean;
    error?: string | boolean;
    className?: string;
}

export function RadioGroup({
    name,
    value,
    onChange,
    options,
    size = "md",
    label,
    orientation = "vertical",
    disabled = false,
    error,
    className,
}: RadioGroupProps) {
    const groupLabelId = label ? `${name}-group-label` : undefined;
    const errorId = `${name}-group-error`;
    const hasErrorMessage = typeof error === "string" && error.length > 0;
    const isInvalid = Boolean(error);

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            {label && (
                <span id={groupLabelId} className="text-sm font-medium text-text-primary">
                    {label}
                </span>
            )}
            <div
                role="radiogroup"
                aria-labelledby={groupLabelId}
                aria-describedby={hasErrorMessage ? errorId : undefined}
                aria-invalid={isInvalid || undefined}
                className={cn(
                    "flex gap-3",
                    orientation === "vertical" ? "flex-col" : "flex-row flex-wrap"
                )}
            >
                {options.map((option) => (
                    <Radio
                        key={option.value}
                        name={name}
                        value={option.value}
                        checked={value === option.value}
                        onChange={() => onChange(option.value)}
                        label={option.label}
                        description={option.description}
                        size={size}
                        disabled={disabled || option.disabled}
                        error={isInvalid}
                        id={`${name}-${option.value}`}
                    />
                ))}
            </div>
            {hasErrorMessage && (
                <p id={errorId} role="alert" className="text-sm text-status-danger">
                    {error}
                </p>
            )}
        </div>
    );
}

RadioGroup.displayName = "RadioGroup";
