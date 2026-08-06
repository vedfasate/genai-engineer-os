/**
 * src/styles/opacity.ts
 * Opacity scale, expressed as decimals for direct use in CSS/inline styles.
 */

export const scale = {
    0: 0,
    5: 0.05,
    10: 0.1,
    20: 0.2,
    40: 0.4,
    60: 0.6,
    80: 0.8,
    90: 0.9,
    100: 1,
} as const;

export const semantic = {
    disabled: scale[40],
    hoverOverlay: scale[10],
    activeOverlay: scale[20],
    backdrop: scale[60],
    divider: scale[80],
} as const;

export const opacity = { scale, semantic } as const;
export type Opacity = typeof opacity;
export default opacity;
