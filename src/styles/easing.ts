/**
 * src/styles/easing.ts
 * Easing curves as cubic-bezier arrays (Framer Motion) with CSS-string
 * equivalents for non-Framer contexts (globals.css, Tailwind config).
 */

export const curve = {
    standard: [0.4, 0, 0.2, 1] as const,
    emphasized: [0.2, 0, 0, 1] as const,
    decelerate: [0, 0, 0.2, 1] as const,
    accelerate: [0.4, 0, 1, 1] as const,
} as const;

export const css = {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    emphasized: "cubic-bezier(0.2, 0, 0, 1)",
    decelerate: "cubic-bezier(0, 0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0, 1, 1)",
} as const;

export const easing = {
    standard: curve.standard,
    emphasized: curve.emphasized,
    decelerate: curve.decelerate,
    accelerate: curve.accelerate,
} as const;

export type Easing = typeof easing;
export default easing;
