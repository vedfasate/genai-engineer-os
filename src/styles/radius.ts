/**
 * src/styles/radius.ts
 * Border radius scale — raw steps plus semantic aliases so corner
 * rounding stays consistent across every surface in the app.
 */

export const scale = {
    none: "0rem",
    xs: "0.25rem",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    "2xl": "1.5rem",
    full: "9999px",
} as const;

export const semantic = {
    button: scale.sm,
    input: scale.sm,
    card: scale.lg,
    modal: scale.xl,
    badge: scale.full,
    avatar: scale.full,
    tooltip: scale.xs,
    popover: scale.md,
    toast: scale.md,
    checkbox: scale.xs,
} as const;

export const radius = { scale, semantic } as const;
export type Radius = typeof radius;
export default radius;
