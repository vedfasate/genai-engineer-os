/**
 * src/styles/colors.ts
 *
 * Canonical color palette and semantic color tokens for GenAI Engineer OS.
 * Dark-first design system. Every color used anywhere in the app must
 * resolve back to a value defined in this file — never hardcode hex
 * values in components, CSS, or Tailwind classes.
 *
 * Structure:
 *  - `palette`   → raw, context-free color ramps (the "paint")
 *  - `semantic`  → purpose-driven aliases built from `palette` (the "usage")
 *
 * Components and Tailwind config should consume `semantic`, not `palette`,
 * except when defining new semantic aliases here.
 */

/** Raw color ramps. Never reference these directly from components. */
export const palette = {
    // Neutral scale — the dark-first base. 950 is near-black, 50 is near-white.
    neutral: {
        50: "#F7F8F9",
        100: "#EDEFF2",
        200: "#DCE0E5",
        300: "#B8C0CC",
        400: "#8A93A3",
        500: "#636D7E",
        600: "#454E5F",
        700: "#2E3541",
        800: "#1C212B",
        900: "#12151C",
        950: "#0A0C11",
    },

    // Primary brand accent — indigo/violet, chosen for a premium developer-tool feel.
    indigo: {
        300: "#A5B4FC",
        400: "#818CF8",
        500: "#6366F1",
        600: "#4F46E5",
        700: "#4338CA",
    },

    // Secondary accent — cyan, used sparingly for highlights and data viz.
    cyan: {
        300: "#67E8F9",
        400: "#22D3EE",
        500: "#06B6D4",
    },

    // Status colors.
    green: {
        400: "#4ADE80",
        500: "#22C55E",
        600: "#16A34A",
    },
    amber: {
        400: "#FBBF24",
        500: "#F59E0B",
        600: "#D97706",
    },
    red: {
        400: "#F87171",
        500: "#EF4444",
        600: "#DC2626",
    },
} as const;

/**
 * Semantic tokens. Components, Tailwind config, and CSS variables should
 * always resolve color through this object so a future theme change only
 * requires edits here.
 */
export interface SemanticColorTokens {
    background: {
        base: string;
        surface: string;
        surfaceRaised: string;
        overlay: string;
    };
    border: {
        subtle: string;
        default: string;
        strong: string;
        focus: string;
    };
    text: {
        primary: string;
        secondary: string;
        tertiary: string;
        disabled: string;
        inverse: string;
    };
    accent: {
        default: string;
        hover: string;
        active: string;
        subtle: string;
        secondary: string;
    };
    status: {
        success: string;
        successSubtle: string;
        warning: string;
        warningSubtle: string;
        danger: string;
        dangerSubtle: string;
        info: string;
    };
    interactive: {
        primaryBg: string;
        primaryBgHover: string;
        primaryBgActive: string;
        primaryText: string;
        secondaryBg: string;
        secondaryBorder: string;
        secondaryText: string;
        disabledBg: string;
        disabledText: string;
    };
}

const dark: SemanticColorTokens = {
    background: {
        base: palette.neutral[950],
        surface: palette.neutral[900],
        surfaceRaised: palette.neutral[800],
        overlay: palette.neutral[800],
    },
    border: {
        subtle: palette.neutral[800],
        default: palette.neutral[700],
        strong: palette.neutral[600],
        focus: palette.indigo[500],
    },
    text: {
        primary: palette.neutral[50],
        secondary: palette.neutral[300],
        tertiary: palette.neutral[400],
        disabled: palette.neutral[600],
        inverse: palette.neutral[950],
    },
    accent: {
        default: palette.indigo[500],
        hover: palette.indigo[400],
        active: palette.indigo[600],
        subtle: palette.indigo[700],
        secondary: palette.cyan[400],
    },
    status: {
        success: palette.green[500],
        successSubtle: palette.green[600],
        warning: palette.amber[500],
        warningSubtle: palette.amber[600],
        danger: palette.red[500],
        dangerSubtle: palette.red[600],
        info: palette.cyan[400],
    },
    interactive: {
        primaryBg: palette.indigo[500],
        primaryBgHover: palette.indigo[400],
        primaryBgActive: palette.indigo[600],
        primaryText: palette.neutral[50],
        secondaryBg: "transparent",
        secondaryBorder: palette.neutral[700],
        secondaryText: palette.neutral[100],
        disabledBg: palette.neutral[800],
        disabledText: palette.neutral[600],
    },
};

const light: SemanticColorTokens = {
    background: {
        base: palette.neutral[100],
        surface: palette.neutral[50],
        surfaceRaised: "#FFFFFF",
        overlay: "#FFFFFF",
    },
    border: {
        subtle: palette.neutral[200],
        default: palette.neutral[300],
        strong: palette.neutral[400],
        focus: palette.indigo[500],
    },
    text: {
        primary: palette.neutral[950],
        secondary: palette.neutral[700],
        tertiary: palette.neutral[500],
        disabled: palette.neutral[300],
        inverse: palette.neutral[50],
    },
    accent: {
        default: palette.indigo[500],
        hover: palette.indigo[600],
        active: palette.indigo[700],
        subtle: palette.indigo[300],
        secondary: palette.cyan[500],
    },
    status: {
        success: palette.green[600],
        successSubtle: palette.green[500],
        warning: palette.amber[600],
        warningSubtle: palette.amber[500],
        danger: palette.red[600],
        dangerSubtle: palette.red[500],
        info: palette.cyan[500],
    },
    interactive: {
        primaryBg: palette.indigo[500],
        primaryBgHover: palette.indigo[600],
        primaryBgActive: palette.indigo[700],
        primaryText: palette.neutral[50],
        secondaryBg: "transparent",
        secondaryBorder: palette.neutral[300],
        secondaryText: palette.neutral[900],
        disabledBg: palette.neutral[200],
        disabledText: palette.neutral[400],
    },
};

export const semantic = { dark, light } as const;

/** Convenience aggregate export for consumers that want everything at once. */
export const colors = {
    palette,
    semantic,
} as const;

export type Palette = typeof palette;
export type Semantic = typeof semantic;
export type Colors = typeof colors;

export default colors;
