/**
 * src/styles/tokens.ts
 * Barrel export for the entire design token system. This is the ONLY
 * file the rest of the app (and tailwind.config.ts) should import
 * tokens from — never reach into an individual styles/*.ts file
 * directly from component code.
 */

import { colors } from "./colors";
import { typography } from "./typography";
import { spacing } from "./spacing";
import { sizing } from "./sizing";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { motion } from "./motion";
import { glass } from "./glass";
import { gradients } from "./gradients";
import { borders } from "./borders";
import { opacity } from "./opacity";
import { duration } from "./durations";
import { easing } from "./easing";
import { layout } from "./layout";
import { density } from "./density";
import { focus } from "./focus";

export const tokens = {
    colors,
    typography,
    spacing,
    sizing,
    radius,
    shadows,
    motion,
    glass,
    gradients,
    borders,
    opacity,
    duration,
    easing,
    layout,
    density,
    focus,
} as const;

export type Tokens = typeof tokens;
export default tokens;

export type { Colors } from "./colors";
export type { Typography } from "./typography";
export type { Spacing } from "./spacing";
export type { Sizing } from "./sizing";
export type { Radius } from "./radius";
export type { Shadows } from "./shadows";
export type { Motion } from "./motion";
export type { Glass } from "./glass";
export type { Gradients } from "./gradients";
export type { Borders } from "./borders";
export type { Duration } from "./durations";
export type { Easing } from "./easing";
export type { Layout } from "./layout";
export type { Density } from "./density";
export type { Focus } from "./focus";
