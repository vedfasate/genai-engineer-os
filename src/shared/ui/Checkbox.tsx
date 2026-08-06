// src/shared/ui/Checkbox.tsx

/**
 * @component Checkbox
 * @maturity Experimental
 *
 * Component Decision Record
 * --------------------------
 * Decision: Renders a real native <input type="checkbox"> visually
 * hidden with `peer sr-only` (kept in the accessibility tree and
 * still keyboard-focusable — not `display:none`, not bare
 * `opacity-0`), with a sibling <span> as the visible box styled
 * through `peer-checked:` / `peer-indeterminate:` / `peer-disabled:`
 * / `peer-focus-visible:` variants. This keeps native semantics
 * (Space to toggle, form submission, `:checked`/`:indeterminate`
 * pseudo-classes, screen reader "checked" state) instead of
 * reimplementing them with a div + onClick + role="checkbox".
 *
 * Decision: `indeterminate` is not a settable JSX attribute — the DOM
 * only exposes it as an imperative property. This component keeps an
 * internal ref, assigns `.indeterminate` in a `useEffect`, and merges
 * any forwarded ref via a small local callback so callers still get
 * the underlying <input> (e.g. for react-hook-form's register()).
 * Visual state for both checked and indeterminate is then driven
 * entirely by CSS (`peer-checked:` / `peer-indeterminate:`) rather
 * than a JS ternary choosing which icon to render — indeterminate is
 * a real native pseudo-class once `.indeterminate` is set, so there's
 * no reason to duplicate that logic in render.
 *
 * Decision: `label`/`description` are accepted as props (rendered
 * inline, associated via a generated id, wrapped in a real <label>)
 * rather than requiring a separate `Label.tsx` — that file doesn't
 * exist yet in this repo, and per §35's extraction policy a shared
 * wrapper waits for three real consumers, not the other way around.
 *
 * Decision: Color classes use the fully-qualified tokens that
 * actually resolve against tailwind.config.ts (`bg-background-surface`,
 * `border-border`, `bg-accent`, `text-text-inverse`,
 * `border-status-danger`, etc.), continuing the correction started in
 * Select.tsx rather than the flattened names still present in
 * Button.tsx/Avatar.tsx (tracked as pre-existing debt, out of scope
 * here).
 *
 * Decision: Box corner radius uses `rounded-xs`, matching
 * `radius.semantic.checkbox` (`scale.xs` = 0.25rem) from
 * `src/styles/radius.ts` — the token that was actually defined for
 * this component, rather than reusing Button's `rounded-md`.
 *
 * Decision: forwardRef, consistent with every other primitive in this
 * file set.
 */

import { forwardRef, useEffect, useId, useRef } from "react";
import type { InputHTMLAttributes, ReactNode, Ref, MutableRefObject } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/cn";
import type { Size } from "@/shared/ui/types";

export interface CheckboxProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
    /** Size scale, shared with other UI Foundation primitives. Defaults to "md". */
    size?: Size;
    /** Label rendered next to the box. */
    label?: ReactNode;
    /** Optional supporting text rendered below the label. */
    description?: ReactNode;
    /**
     * Renders the box in its indeterminate ("partial") visual state via
     * the native `.indeterminate` DOM property. Does not affect the
     * `checked` value — pair with a controlled `checked` prop.
     */
    indeterminate?: boolean;
    /** Validation error. A string renders a message below the control; `true` applies error styling only. */
    error?: string | boolean;
}

const boxSizeStyles: Record<Size, string> = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
};

const iconSizeStyles: Record<Size, string> = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
};

const labelTextSizeStyles: Record<Size, string> = {
    sm: "text-sm",
    md: "text-sm",
    lg: "text-base",
};

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
    if (!ref) return;
    if (typeof ref === "function") {
        ref(value);
    } else {
        (ref as MutableRefObject<T | null>).current = value;
    }
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    (
        {
            size = "md",
            label,
            description,
            indeterminate = false,
            error,
            disabled,
            className,
            id,
            "aria-describedby": ariaDescribedBy,
            ...rest
        },
        forwardedRef
    ) => {
        const internalRef = useRef<HTMLInputElement | null>(null);
        const generatedId = useId();
        const checkboxId = id ?? generatedId;
        const descriptionId = `${checkboxId}-description`;
        const errorId = `${checkboxId}-error`;
        const hasErrorMessage = typeof error === "string" && error.length > 0;
        const isInvalid = Boolean(error);

        useEffect(() => {
            if (internalRef.current) {
                internalRef.current.indeterminate = indeterminate;
            }
        }, [indeterminate]);

        const describedBy = [
            description ? descriptionId : null,
            hasErrorMessage ? errorId : null,
            ariaDescribedBy ?? null,
        ]
            .filter(Boolean)
            .join(" ");

        return (
            <div className="inline-flex flex-col gap-1">
                <label
                    htmlFor={checkboxId}
                    className={cn(
                        "inline-flex items-start gap-2",
                        disabled ? "cursor-not-allowed" : "cursor-pointer"
                    )}
                >
                    <span className="relative inline-flex shrink-0 mt-0.5">
                        <input
                            ref={(node) => {
                                internalRef.current = node;
                                setRef(forwardedRef, node);
                            }}
                            type="checkbox"
                            id={checkboxId}
                            disabled={disabled}
                            aria-invalid={isInvalid || undefined}
                            aria-describedby={describedBy || undefined}
                            data-size={size}
                            data-invalid={isInvalid || undefined}
                            className={cn("peer sr-only", className)}
                            {...rest}
                        />
                        <span
                            aria-hidden="true"
                            className={cn(
                                "relative flex items-center justify-center shrink-0",
                                "rounded-xs border bg-background-surface",
                                "transition-colors duration-fast ease-standard",
                                "peer-checked:bg-accent peer-checked:border-accent",
                                "peer-indeterminate:bg-accent peer-indeterminate:border-accent",
                                "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-background-base",
                                "peer-disabled:opacity-50 peer-disabled:pointer-events-none",
                                boxSizeStyles[size],
                                isInvalid
                                    ? "border-status-danger"
                                    : "border-border peer-hover:border-border-strong"
                            )}
                        >
                            <Check
                                className={cn(
                                    iconSizeStyles[size],
                                    "absolute text-text-inverse opacity-0 transition-opacity",
                                    "peer-checked:opacity-100 peer-indeterminate:opacity-0"
                                )}
                                strokeWidth={3}
                            />
                            <Minus
                                className={cn(
                                    iconSizeStyles[size],
                                    "absolute text-text-inverse opacity-0 transition-opacity",
                                    "peer-indeterminate:opacity-100"
                                )}
                                strokeWidth={3}
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
                                    id={descriptionId}
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

                {hasErrorMessage && (
                    <p id={errorId} role="alert" className="text-sm text-status-danger">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";
