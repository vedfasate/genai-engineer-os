/**
 * src/types/theme.types.ts
 * Core type definitions for the theme system.
 */

import type { ReactNode } from 'react'

export type ThemeMode = 'dark' | 'light' | 'system'
export type ResolvedTheme = 'dark' | 'light'

export interface ThemeContextValue {
    mode: ThemeMode
    resolvedTheme: ResolvedTheme
    setMode: (mode: ThemeMode) => void
    toggleTheme: () => void
    reducedMotion: boolean
}

export interface ThemeProviderProps {
    children: ReactNode
    defaultMode?: ThemeMode
    storageKey?: string
}
