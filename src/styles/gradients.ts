/**
 * src/styles/gradients.ts
 * Shared gradients, derived from colors.ts. Kept few and purposeful —
 * gradients are an accent, not a default background treatment.
 */

import { palette } from "./colors";

export const semantic = {
    accentGlow: `radial-gradient(circle at 50% 0%, ${palette.indigo[500]}33, transparent 70%)`,
    heroBackground: `linear-gradient(180deg, ${palette.neutral[900]} 0%, ${palette.neutral[950]} 100%)`,
    cardHighlight: `linear-gradient(135deg, ${palette.neutral[800]} 0%, ${palette.neutral[900]} 100%)`,
    accentText: `linear-gradient(90deg, ${palette.indigo[400]} 0%, ${palette.cyan[400]} 100%)`,
    progressBar: `linear-gradient(90deg, ${palette.indigo[600]} 0%, ${palette.indigo[400]} 100%)`,
} as const;

export const gradients = { semantic } as const;
export type Gradients = typeof gradients;
export default gradients;
