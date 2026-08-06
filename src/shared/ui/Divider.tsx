// src/shared/ui/Divider.tsx

/**
 * @component Divider
 * @maturity Experimental
 *
 * Component Decision Record
 * --------------------------
 * Decision: Supports horizontal (default) and vertical orientation via
 * a single `orientation` prop — both render as a single line, only the
 * axis differs.
 *
 * Decision: Renders a native <hr> for horizontal orientation (implicit
 * role="separator") and a <div role="separator" aria-orientation="vertical">
 * for vertical, since <hr> has no meaningful vertical rendering model.
 *
 * Decision: DividerProps stays typed as ComponentPropsWithoutRef<"hr">,
 * even though the vertical branch renders a <div>. The component's
 * primary semantic identity is an <hr> — that's what the public API
 * should describe, not be widened to <div> just because one internal
 * branch needs it. `...rest` is spread on BOTH branches now (fixed —
 * a prior revision silently dropped it on the vertical branch). The
 * vertical branch's spread requires a narrow, explicit cast of the
 * hr-typed rest object onto the div element; this is safe in practice
 * because the props this component's type actually admits (className,
 * data-*, aria-*, standard DOM event handlers) are valid on both
 * elements — the cast is scoped to exactly the one line that needs it,
 * not exposed as the component's public contract.
 *
 * Decision: NOT building a labeled/text divider ("— OR —" style) here —
 * a different rendering shape, deferred until a real consumer needs it.
 *
 * Decision: Not memoized — trivial render cost.
 */

import { cn } from "@/lib/cn";

export type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps extends React.ComponentPropsWithoutRef<"hr"> {
    orientation?: DividerOrientation;
}

export function Divider({
    orientation = "horizontal",
    className,
    ...rest
}: DividerProps) {
    if (orientation === "vertical") {
        return (
            <div
                role="separator"
                aria-orientation="vertical"
                data-orientation="vertical"
                className={cn("w-px self-stretch bg-border", className)}
                {...(rest as React.ComponentPropsWithoutRef<"div">)}
            />
        );
    }

    return (
        <hr
            data-orientation="horizontal"
            className={cn("h-px w-full border-0 bg-border", className)}
            {...rest}
        />
    );
}

Divider.displayName = "Divider";
