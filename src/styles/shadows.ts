/**
 * src/styles/shadows.ts
 * Elevation shadows. Dark surfaces need lighter, more diffuse shadows
 * than light-theme UIs — heavy black shadows disappear against a
 * near-black background, so these lean on subtle light-edge highlights
 * plus soft dark falloff to read as elevation.
 */

export const scale = {
    none: "none",
    xs: "0 1px 2px rgba(0, 0, 0, 0.4)",
    sm: "0 2px 4px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)",
    md: "0 4px 8px rgba(0, 0, 0, 0.45), 0 2px 4px rgba(0, 0, 0, 0.3)",
    lg: "0 8px 16px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.35)",
    xl: "0 16px 32px rgba(0, 0, 0, 0.55), 0 8px 16px rgba(0, 0, 0, 0.4)",
    "2xl": "0 24px 48px rgba(0, 0, 0, 0.6), 0 12px 24px rgba(0, 0, 0, 0.45)",
} as const;

export const semantic = {
    card: scale.sm,
    cardHover: scale.md,
    dropdown: scale.lg,
    modal: scale["2xl"],
    tooltip: scale.xs,
    popover: scale.md,
    toast: scale.lg,
} as const;

export const shadows = { scale, semantic } as const;
export type Shadows = typeof shadows;
export default shadows;
