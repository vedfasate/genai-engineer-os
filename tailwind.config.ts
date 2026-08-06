import type { Config } from 'tailwindcss'
import { tokens } from './src/styles'

function colorVar(name: string): string {
    return `var(--color-${name})`
}

const config: Config = {
    darkMode: ['selector', '[data-theme="dark"]'],
    content: [
        './src/app/**/*.{ts,tsx}',
        './src/features/**/*.{ts,tsx}',
        './src/shared/**/*.{ts,tsx}',
        './src/widgets/**/*.{ts,tsx}',
        './src/core/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                background: {
                    base: colorVar('background-base'),
                    surface: colorVar('background-surface'),
                    'surface-raised': colorVar('background-surface-raised'),
                    overlay: colorVar('background-overlay'),
                },
                border: {
                    subtle: colorVar('border-subtle'),
                    DEFAULT: colorVar('border-default'),
                    strong: colorVar('border-strong'),
                    focus: colorVar('border-focus'),
                },
                text: {
                    primary: colorVar('text-primary'),
                    secondary: colorVar('text-secondary'),
                    tertiary: colorVar('text-tertiary'),
                    disabled: colorVar('text-disabled'),
                    inverse: colorVar('text-inverse'),
                },
                accent: {
                    DEFAULT: colorVar('accent-default'),
                    hover: colorVar('accent-hover'),
                    active: colorVar('accent-active'),
                    subtle: colorVar('accent-subtle'),
                    secondary: colorVar('accent-secondary'),
                },
                status: {
                    success: colorVar('status-success'),
                    'success-subtle': colorVar('status-success-subtle'),
                    warning: colorVar('status-warning'),
                    'warning-subtle': colorVar('status-warning-subtle'),
                    danger: colorVar('status-danger'),
                    'danger-subtle': colorVar('status-danger-subtle'),
                    info: colorVar('status-info'),
                },
            },
            fontFamily: {
                sans: tokens.typography.fontFamily.sans,
                mono: tokens.typography.fontFamily.mono,
            },
            fontSize: Object.fromEntries(
                Object.entries(tokens.typography.scale).map(([key, value]) => [
                    key,
                    [value.fontSize, { lineHeight: value.lineHeight, letterSpacing: value.letterSpacing }],
                ])
            ),
            fontWeight: tokens.typography.fontWeight,
            spacing: tokens.spacing.scale,
            borderRadius: tokens.radius.scale,
            boxShadow: tokens.shadows.scale,
            maxWidth: tokens.layout.container,
            transitionDuration: Object.fromEntries(
                Object.entries(tokens.duration).map(([key, value]) => [key, `${value * 1000}ms`])
            ),
            transitionTimingFunction: tokens.easing,
            backdropBlur: tokens.glass.blur,
        },
    },
    plugins: [],
}

export default config
