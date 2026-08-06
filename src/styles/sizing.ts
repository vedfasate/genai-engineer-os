/**
 * src/styles/sizing.ts
 * Dimensional tokens: widths, heights, and named component sizes.
 * Distinct from spacing.ts (gaps/padding) and layout.ts (app-shell dimensions).
 */

/** Control height scale — shared by buttons, inputs, selects. */
export const controlHeight = {
    xs: "1.75rem",
    sm: "2rem",
    md: "2.5rem",
    lg: "3rem",
    xl: "3.5rem",
} as const;

/** Icon size scale, paired 1:1 with controlHeight steps for visual balance. */
export const iconSize = {
    xs: "0.875rem",
    sm: "1rem",
    md: "1.25rem",
    lg: "1.5rem",
    xl: "2rem",
} as const;

/** Avatar diameter scale. */
export const avatarSize = {
    xs: "1.5rem",
    sm: "2rem",
    md: "2.5rem",
    lg: "3.5rem",
    xl: "5rem",
    "2xl": "7rem",
} as const;

/** Modal width presets. */
export const modalWidth = {
    sm: "24rem",
    md: "32rem",
    lg: "42rem",
    xl: "56rem",
    full: "calc(100vw - 2rem)",
} as const;

/** Drawer/panel width presets. */
export const drawerWidth = {
    sm: "20rem",
    md: "28rem",
    lg: "36rem",
} as const;

/** Card max-width presets, for cards not stretching to their grid cell. */
export const cardMaxWidth = {
    sm: "20rem",
    md: "28rem",
    lg: "36rem",
} as const;

export const sizing = {
    controlHeight,
    iconSize,
    avatarSize,
    modalWidth,
    drawerWidth,
    cardMaxWidth,
} as const;

export type Sizing = typeof sizing;
export default sizing;
