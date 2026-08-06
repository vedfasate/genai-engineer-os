import { colors, type SemanticColorTokens } from './colors'
import type { ResolvedTheme } from '@/types/theme.types'

function toKebabCase(input: string): string {
    return input.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function flatten(obj: Record<string, unknown>, prefix: string, out: Record<string, string>): void {
    for (const key of Object.keys(obj)) {
        const value = obj[key]
        const varName = `${prefix}-${toKebabCase(key)}`
        if (typeof value === 'string') {
            out[varName] = value
        } else if (typeof value === 'object' && value !== null) {
            flatten(value as Record<string, unknown>, varName, out)
        }
    }
}

/** Generate `{ "--color-background-base": "#0A0C11", ... }` for a theme. */
export function generateColorVariables(theme: ResolvedTheme): Record<string, string> {
    const tokens: SemanticColorTokens = colors.semantic[theme]
    const vars: Record<string, string> = {}
    flatten(tokens as unknown as Record<string, unknown>, '--color', vars)
    return vars
}

/** Serialize a variable map for inline style injection. */
export function cssVariablesToString(vars: Record<string, string>): string {
    return Object.entries(vars)
        .map(([key, value]) => `${key}: ${value};`)
        .join(' ')
}
