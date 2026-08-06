/**
 * src/styles/layout.ts
 * App-shell structural dimensions: containers, sidebar, navbar, page.
 * These describe the shell itself, distinct from generic sizing.ts
 * (component dimensions) and spacing.ts (gaps/padding).
 */

import { scale as spacingScale } from "./spacing";

export const container = {
    sm: "40rem",
    md: "48rem",
    lg: "64rem",
    xl: "80rem",
    "2xl": "90rem",
    "3xl": "100rem",
} as const;

export const sidebar = {
    widthCollapsed: "4.5rem",
    widthExpanded: "16rem",
    paddingX: spacingScale[3],
    paddingY: spacingScale[4],
    itemGap: spacingScale[1],
    sectionGap: spacingScale[6],
} as const;

export const navbar = {
    height: "4rem",
    paddingX: spacingScale[6],
    itemGap: spacingScale[4],
} as const;

export const page = {
    paddingTop: spacingScale[8],
    paddingBottom: spacingScale[16],
    headerGap: spacingScale[6],
    gutter: {
        mobile: spacingScale[4],
        tablet: spacingScale[6],
        desktop: spacingScale[8],
        ultraWide: spacingScale[12],
    },
} as const;

export const layout = { container, sidebar, navbar, page } as const;
export type Layout = typeof layout;
export default layout;
