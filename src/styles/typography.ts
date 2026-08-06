/**
 * src/styles/typography.ts
 *
 * Canonical typography system for GenAI Engineer OS.
 * Mirrors the palette/semantic structure of colors.ts:
 *  - `scale`     → raw, context-free type primitives (the "paint")
 *  - `semantic`  → purpose-driven text style aliases (the "usage")
 *
 * Components should consume `semantic`, not `scale`, except when
 * defining new semantic aliases here.
 *
 * Theming note: typography does not change between dark and light
 * themes (only color does), so this file has no theme variants.
 * It is written to remain stable when `src/store` introduces a
 * light-theme mode driven purely by colors.ts.
 */

/** Raw font family stacks. Never reference these directly from components. */
export const fontFamily = {
    /** Primary UI and body face — used for nearly all interface text. */
    sans: [
        "Inter",
        "-apple-system",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "sans-serif",
    ],
    /** Monospace face — code blocks, data tables, numeric readouts. */
    mono: [
        "JetBrains Mono",
        "SFMono-Regular",
        "Menlo",
        "Consolas",
        "Liberation Mono",
        "monospace",
    ],
} as const;

/** Raw font weights. Never reference these directly from components. */
export const fontWeight = {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
} as const;

/**
 * Raw type scale. Each step defines fontSize, lineHeight, and
 * letterSpacing together, since these three values are tuned as a set
 * and should never be adjusted independently in component code.
 */
export const scale = {
    xs: { fontSize: "0.75rem", lineHeight: "1rem", letterSpacing: "0em" },
    sm: { fontSize: "0.875rem", lineHeight: "1.25rem", letterSpacing: "0em" },
    base: { fontSize: "1rem", lineHeight: "1.5rem", letterSpacing: "0em" },
    lg: { fontSize: "1.125rem", lineHeight: "1.75rem", letterSpacing: "-0.01em" },
    xl: { fontSize: "1.25rem", lineHeight: "1.875rem", letterSpacing: "-0.01em" },
    "2xl": { fontSize: "1.5rem", lineHeight: "2rem", letterSpacing: "-0.015em" },
    "3xl": { fontSize: "1.875rem", lineHeight: "2.25rem", letterSpacing: "-0.02em" },
    "4xl": { fontSize: "2.25rem", lineHeight: "2.5rem", letterSpacing: "-0.02em" },
    "5xl": { fontSize: "3rem", lineHeight: "1.1", letterSpacing: "-0.025em" },
} as const;

/**
 * Semantic text styles. Components and Tailwind config should always
 * resolve typography through this object so a future scale change
 * only requires edits here.
 */
export const semantic = {
    display: {
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.bold,
        ...scale["5xl"],
    },
    h1: {
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.bold,
        ...scale["4xl"],
    },
    h2: {
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.semibold,
        ...scale["3xl"],
    },
    h3: {
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.semibold,
        ...scale["2xl"],
    },
    h4: {
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.semibold,
        ...scale.xl,
    },
    bodyLarge: {
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.regular,
        ...scale.lg,
    },
    body: {
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.regular,
        ...scale.base,
    },
    bodySmall: {
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.regular,
        ...scale.sm,
    },
    caption: {
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.medium,
        ...scale.xs,
    },
    label: {
        fontFamily: fontFamily.sans,
        fontWeight: fontWeight.medium,
        ...scale.sm,
    },
    code: {
        fontFamily: fontFamily.mono,
        fontWeight: fontWeight.regular,
        ...scale.sm,
    },
} as const;

/** Convenience aggregate export for consumers that want everything at once. */
export const typography = {
    fontFamily,
    fontWeight,
    scale,
    semantic,
} as const;

export type FontFamily = typeof fontFamily;
export type FontWeight = typeof fontWeight;
export type TypeScale = typeof scale;
export type TypographySemantic = typeof semantic;
export type Typography = typeof typography;

export default typography;
