/**
 * src/styles/glass.ts
 * Glassmorphism tokens. Used selectively — navbar, command palette,
 * and select overlays — never as a default surface treatment.
 */

import { palette } from "./colors";

export const blur = {
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "40px",
} as const;

export const background = {
    light: `${palette.neutral[800]}99`,
    medium: `${palette.neutral[900]}CC`,
    heavy: `${palette.neutral[950]}E6`,
} as const;

export const border = {
    subtle: `${palette.neutral[600]}40`,
    default: `${palette.neutral[500]}33`,
} as const;

export const semantic = {
    navbar: { background: background.medium, blur: blur.lg, border: border.subtle } as const,
    sidebar: { background: background.heavy, blur: blur.md, border: border.subtle } as const,
    commandPalette: { background: background.medium, blur: blur.xl, border: border.default } as const,
    popoverGlass: { background: background.light, blur: blur.sm, border: border.subtle } as const,
} as const;

export const glass = { blur, background, border, semantic } as const;
export type Glass = typeof glass;
export default glass;
