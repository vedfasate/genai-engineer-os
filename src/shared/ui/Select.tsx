/**
 * @component Select
 * @maturity Experimental
 *
 * Component Decision Record
 * --------------------------
 * Decision: Renders a native <select> rather than a custom listbox
 * built on a popover. A native element gets correct keyboard
 * handling, screen reader semantics, and the platform's own mobile
 * picker for free. Popover/Dropdown (not yet built in this repo)
 * would be required for a custom listbox, and this primitive has no
 * reason to wait on them — it can be swapped for a Combobox later if
 * a real consumer needs search-within-options or multi-select.
 *
 * Decision: The native arrow is hidden via `appearance-none` and
 * replaced with a `lucide-react` ChevronDown in an absolutely
 * positioned, `pointer-events-none` span — the same "icon slot"
 * pattern Button already uses for its leading/trailing icons, so the
 * control still submits/behaves as a real <select> underneath.
 *
 * Decision: Options are passed as a typed `options` array rather than
 * accepting raw <option> children. This keeps the public API
 * declarative, matches how Button/Avatar avoid exposing internal DOM
 * structure, and lets a future Combobox reuse the same
 * `SelectOption` shape without inheriting native <select> markup.
 *
 * Decision: `error` accepts either a string (rendered as a message
 * below the control, wired up via aria-describedby, with
 * role="alert") or `true` (error styling only, no message). This
 * lets callers already validating with react-hook-form/zod pass a
 * field error message straight through without a second prop.
 *
 * Decision: No Label/FormField wrapper here. `Label.tsx` does not
 * exist yet in this repo, and the blueprint's own extraction policy
 * (§35) is to wait for at least three real consumers before building
 * a shared wrapper. Callers associate a label via `id` themselves
 * until a FormField primitive is actually justified.
 *
 * Decision: Color utility classes use the fully-qualified token paths
 * that actually resolve against tailwind.config.ts's nested `colors`
 * extension (e.g. `bg-background-surface`, `text-text-primary`,
 * `border-status-danger`) rather than the flattened names
 * (`bg-surface-secondary`, `text-primary`, `bg-danger`) currently
 * used in Button.tsx/Avatar.tsx. Those flattened names do not match
 * any generated Tailwind utility and silently render no CSS — a
 * pre-existing issue out of scope for this file. Select intentionally
 * does not copy it forward; Button/Avatar should be patched to match
 * in a follow-up pass.
 *
 * Decision: forwardRef, consistent with Button/Avatar, so this
 * composes inside react-hook-form's register() without a wrapper.
 */

import { forwardRef, useId } from "react";
import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Size } from "@/shared/ui/types";

export interface SelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}

export interface SelectProps
    extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
    /** Options rendered inside the native <select>. */
    options: SelectOption[];
    /** Size scale, shared with other UI Foundation primitives. Defaults to "md". */
    size?: Size;
    /** Rendered as a disabled, hidden first option when nothing is selected. */
    placeholder?: string;
    /** Validation error. A string renders a message below the control; `true` applies error styling only. */
    error?: string | boolean;
    /** Stretches the select to fill its container's width. Defaults to false, matching Button's fullWidth default. */
    fullWidth?: boolean;
}

const baseStyles = [
    "appearance-none",
    "font-normal",
    "rounded-md border",
    "bg-background-surface text-text-primary",
    "transition-colors duration-fast ease-standard",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent focus-visible:ring-offset-background-base",
    "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-text-disabled",
].join(" ");

const sizeStyles: Record<Size, string> = {
    sm: "h-8 pl-3 pr-8 text-sm",
    md: "h-10 pl-3.5 pr-9 text-sm",
    lg: "h-12 pl-4 pr-10 text-base",
};

const chevronSizeStyles: Record<Size, string> = {
    sm: "h-4 w-4 right-2.5",
    md: "h-4 w-4 right-3",
    lg: "h-5 w-5 right-3.5",
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    (
        {
            options,
            size = "md",
            placeholder,
            error,
            fullWidth = false,
            disabled,
            className,
            id,
            "aria-describedby": ariaDescribedBy,
            ...rest
        },
        ref
    ) => {
        const generatedId = useId();
        const selectId = id ?? generatedId;
        const errorId = `${selectId}-error`;
        const hasErrorMessage = typeof error === "string" && error.length > 0;
        const isInvalid = Boolean(error);

        const describedBy = [hasErrorMessage ? errorId : null, ariaDescribedBy ?? null]
            .filter(Boolean)
            .join(" ");

        return (
            <div className={cn(fullWidth ? "w-full" : "inline-block")}>
                <div className="relative">
                    <select
                        ref={ref}
                        id={selectId}
                        disabled={disabled}
                        aria-invalid={isInvalid || undefined}
                        aria-describedby={describedBy || undefined}
                        data-size={size}
                        data-invalid={isInvalid || undefined}
                        className={cn(
                            baseStyles,
                            sizeStyles[size],
                            fullWidth && "w-full",
                            isInvalid
                                ? "border-status-danger focus-visible:ring-status-danger"
                                : "border-border hover:border-border-strong",
                            className
                        )}
                        {...rest}
                    >
                        {placeholder && (
                            <option value="" disabled hidden>
                                {placeholder}
                            </option>
                        )}
                        {options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <span
                        aria-hidden="true"
                        className={cn(
                            "pointer-events-none absolute top-1/2 -translate-y-1/2 text-text-tertiary",
                            chevronSizeStyles[size]
                        )}
                    >
                        <ChevronDown className="h-full w-full" />
                    </span>
                </div>

                {hasErrorMessage && (
                    <p id={errorId} role="alert" className="mt-1.5 text-sm text-status-danger">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Select.displayName = "Select";
