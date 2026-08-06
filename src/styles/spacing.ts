/**
 * src/styles/spacing.ts
 *
 * Canonical spacing system — space BETWEEN things only. Structural
 * dimensions (widths/heights) live in sizing.ts; app-shell dimensions
 * (container, sidebar, navbar, page) live in layout.ts. This keeps
 * "how far apart" strictly separate from "how big."
 */

export const scale = {
    0: "0rem",
    px: "0.0625rem",
    0.5: "0.125rem",
    1: "0.25rem",
    1.5: "0.375rem",
    2: "0.5rem",
    2.5: "0.625rem",
    3: "0.75rem",
    4: "1rem",
    5: "1.25rem",
    6: "1.5rem",
    8: "2rem",
    10: "2.5rem",
    12: "3rem",
    16: "4rem",
    20: "5rem",
    24: "6rem",
    32: "8rem",
    40: "10rem",
    48: "12rem",
} as const;

export const micro = {
    none: scale[0],
    hairline: scale.px,
    tightest: scale[0.5],
    tight: scale[1],
    compact: scale[1.5],
    default: scale[2],
} as const;

export const component = {
    paddingX: scale[4],
    paddingY: scale[2.5],
    gap: scale[2],
    gapLoose: scale[4],
} as const;

export const section = {
    gapSmall: scale[8],
    gap: scale[12],
    gapLarge: scale[16],
    paddingY: scale[16],
} as const;

export const grid = {
    gapTight: scale[2],
    gap: scale[4],
    gapLoose: scale[6],
    gapSection: scale[8],
} as const;

export const gap = {
    xs: scale[1],
    sm: scale[2],
    md: scale[4],
    lg: scale[6],
    xl: scale[8],
} as const;

export const padding = {
    xs: scale[2],
    sm: scale[3],
    md: scale[4],
    lg: scale[6],
    xl: scale[8],
} as const;

export const margin = {
    xs: scale[2],
    sm: scale[3],
    md: scale[4],
    lg: scale[6],
    xl: scale[8],
} as const;

export const card = {
    paddingCompact: scale[4],
    padding: scale[6],
    paddingLarge: scale[8],
    gap: scale[4],
    headerGap: scale[2],
} as const;

export const modal = {
    padding: scale[6],
    headerGap: scale[4],
    footerGap: scale[6],
    viewportMargin: scale[4],
} as const;

export const form = {
    fieldGap: scale[4],
    groupGap: scale[8],
    labelGap: scale[1.5],
    helperTextGap: scale[1],
} as const;

export const button = {
    paddingXSmall: { x: scale[2.5], y: scale[1] },
    paddingSmall: { x: scale[3], y: scale[1.5] },
    paddingMedium: { x: scale[4], y: scale[2.5] },
    paddingLarge: { x: scale[6], y: scale[3] },
    iconGap: scale[2],
} as const;

export const input = {
    paddingX: scale[3],
    paddingY: scale[2.5],
    iconGap: scale[2],
    addonGap: scale[2],
} as const;

export const icon = {
    gapTight: scale[1],
    gap: scale[2],
    gapLoose: scale[3],
} as const;

export const avatar = {
    stackOverlap: scale[2],
    labelGap: scale[2],
} as const;

export const table = {
    cellPaddingX: scale[4],
    cellPaddingY: scale[3],
    headerPaddingY: scale[2.5],
} as const;

export const tooltip = {
    paddingX: scale[2.5],
    paddingY: scale[1.5],
    offset: scale[2],
} as const;

export const popover = {
    padding: scale[4],
    offset: scale[2],
} as const;

export const badge = {
    paddingX: scale[2],
    paddingY: scale[0.5],
    iconGap: scale[1],
} as const;

export const toast = {
    padding: scale[4],
    stackGap: scale[3],
    viewportMargin: scale[6],
} as const;

export const emptyState = {
    paddingY: scale[16],
    iconGap: scale[4],
    actionGap: scale[6],
} as const;

export const timeline = {
    nodeGap: scale[8],
    connectorWidth: scale[0.5],
    markerOffset: scale[3],
} as const;

export const calendar = {
    cellPadding: scale[2],
    cellGap: scale.px,
    headerGap: scale[4],
} as const;

export const chart = {
    padding: scale[4],
    legendGap: scale[3],
    axisLabelGap: scale[2],
} as const;

export const spacing = {
    scale,
    micro,
    component,
    section,
    grid,
    gap,
    padding,
    margin,
    card,
    modal,
    form,
    button,
    input,
    icon,
    avatar,
    table,
    tooltip,
    popover,
    badge,
    toast,
    emptyState,
    timeline,
    calendar,
    chart,
} as const;

export type SpacingScale = typeof scale;
export type Spacing = typeof spacing;
export default spacing;
