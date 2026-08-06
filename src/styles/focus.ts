/**
 * src/styles/focus.ts
 * Accessibility-focused interaction tokens. Kept separate from
 * shadows.ts because focus treatment is a keyboard-accessibility
 * concern, not a visual elevation concern, even though both happen
 * to use box-shadow syntax under the hood.
 */

import { palette } from "./colors";

/** Standard focus ring — accent-colored glow used on most interactive elements. */
export const focusRing = `0 0 0 3px ${palette.indigo[500]}66`;

/** Tighter ring for compact controls (checkboxes, small icon buttons). */
export const focusRingTight = `0 0 0 2px ${palette.indigo[500]}80`;

/** High-contrast variant for users with prefers-contrast: more or forced-colors mode. */
export const highContrastFocusRing = `0 0 0 3px ${palette.neutral[50]}, 0 0 0 5px ${palette.indigo[500]}`;

/** Outline fallback for elements where box-shadow rings are unsuitable (e.g. table rows). */
export const outline = {
    width: "2px",
    style: "solid",
    color: palette.indigo[500],
    offset: "2px",
} as const;

/** Distance the focus ring sits from the element edge, kept independent of border width. */
export const focusOffset = "2px";

export const semantic = {
    default: focusRing,
    tight: focusRingTight,
    highContrast: highContrastFocusRing,
    outline,
    offset: focusOffset,
} as const;

export const focus = {
    focusRing,
    focusRingTight,
    highContrastFocusRing,
    outline,
    focusOffset,
    semantic,
} as const;

export type Focus = typeof focus;
export default focus;
