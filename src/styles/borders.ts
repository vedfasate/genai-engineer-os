/**
 * src/styles/borders.ts
 * Border width and style tokens. Color comes from colors.ts,
 * rounding from radius.ts — this file governs thickness only.
 */

export const width = {
    none: "0px",
    hairline: "1px",
    thin: "1px",
    medium: "2px",
    thick: "3px",
} as const;

export const style = {
    solid: "solid",
    dashed: "dashed",
} as const;

export const semantic = {
    divider: width.hairline,
    input: width.thin,
    inputFocus: width.medium,
    card: width.hairline,
    emphasizedCard: width.medium,
} as const;

export const borders = { width, style, semantic } as const;
export type Borders = typeof borders;
export default borders;
