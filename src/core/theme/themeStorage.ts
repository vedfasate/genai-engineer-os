/**
 * src/core/theme/themeStorage.ts
 * SSR-safe localStorage persistence for the user's theme mode.
 */

import type { ThemeMode } from '@/types/theme.types'
import { STORAGE_KEYS } from '@/core/constants/storageKeys'

const VALID_MODES: ThemeMode[] = ['dark', 'light', 'system']

export function readStoredThemeMode(storageKey: string = STORAGE_KEYS.themeMode): ThemeMode | null {
    if (typeof window === 'undefined') return null
    try {
        const value = window.localStorage.getItem(storageKey)
        return value && VALID_MODES.includes(value as ThemeMode) ? (value as ThemeMode) : null
    } catch {
        return null
    }
}

export function writeStoredThemeMode(mode: ThemeMode, storageKey: string = STORAGE_KEYS.themeMode): void {
    if (typeof window === 'undefined') return
    try {
        window.localStorage.setItem(storageKey, mode)
    } catch {
        // Fail silently — falls back to in-memory state for the session.
    }
}
