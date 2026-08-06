/**
 * src/styles/density.ts
 * Density modes for enterprise users. Each mode provides explicit
 * control height + padding overrides — not a multiplier — so density
 * changes stay predictable and designer-controlled.
 */

import { controlHeight } from "./sizing";

export type DensityMode = "comfortable" | "compact" | "ultraCompact";

export const modes: Record<
    DensityMode,
    { controlHeight: string; paddingX: string; paddingY: string; rowGap: string }
> = {
    comfortable: {
        controlHeight: controlHeight.md,
        paddingX: "1rem",
        paddingY: "0.625rem",
        rowGap: "0.75rem",
    },
    compact: {
        controlHeight: controlHeight.sm,
        paddingX: "0.75rem",
        paddingY: "0.375rem",
        rowGap: "0.5rem",
    },
    ultraCompact: {
        controlHeight: controlHeight.xs,
        paddingX: "0.5rem",
        paddingY: "0.25rem",
        rowGap: "0.25rem",
    },
} as const;

export const defaultDensity: DensityMode = "comfortable";

export const density = { modes, defaultDensity } as const;
export type Density = typeof density;
export default density;
