"use client"

/**
 * src/core/theme/ThemeProvider.tsx
 * Resolves and applies theme mode, persists selection, reacts to OS
 * theme + reduced-motion changes, and applies the resolved theme via
 * `data-theme` on <html> — the same attribute globals.css and
 * tailwind.config.ts both key off of.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ThemeMode, ResolvedTheme, ThemeProviderProps } from '@/types/theme.types'
import { ThemeContext } from './ThemeContext'
import { readStoredThemeMode, writeStoredThemeMode } from './themeStorage'
import { resolveTheme, applyThemeAttribute, getSystemReducedMotion } from './themeUtils'

const DEFAULT_STORAGE_KEY = 'genai-os-theme-mode'
const DEFAULT_MODE: ThemeMode = 'system'

export function ThemeProvider({
    children,
    defaultMode = DEFAULT_MODE,
    storageKey = DEFAULT_STORAGE_KEY,
}: ThemeProviderProps) {
    const [mode, setModeState] = useState<ThemeMode>(() =>
        readStoredThemeMode(storageKey) ?? defaultMode
    )
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolveTheme(mode))
    const [reducedMotion, setReducedMotion] = useState(false)

    useEffect(() => {
        const resolved = resolveTheme(mode)
        setResolvedTheme(resolved)
        applyThemeAttribute(resolved)
        writeStoredThemeMode(mode, storageKey)
    }, [mode, storageKey])

    useEffect(() => {
        if (mode !== 'system') return
        const mql = window.matchMedia('(prefers-color-scheme: light)')
        const handleChange = () => {
            const resolved = resolveTheme('system')
            setResolvedTheme(resolved)
            applyThemeAttribute(resolved)
        }
        mql.addEventListener('change', handleChange)
        return () => mql.removeEventListener('change', handleChange)
    }, [mode])

    useEffect(() => {
        setReducedMotion(getSystemReducedMotion())
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
        const handleChange = () => setReducedMotion(mql.matches)
        mql.addEventListener('change', handleChange)
        return () => mql.removeEventListener('change', handleChange)
    }, [])

    const setMode = useCallback((next: ThemeMode) => setModeState(next), [])

    const toggleTheme = useCallback(() => {
        setModeState((prev) => (resolveTheme(prev) === 'dark' ? 'light' : 'dark'))
    }, [])

    const value = useMemo(
        () => ({ mode, resolvedTheme, setMode, toggleTheme, reducedMotion }),
        [mode, resolvedTheme, setMode, toggleTheme, reducedMotion]
    )

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
