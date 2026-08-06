"use client"

/** Convenience hook for Framer Motion variants — one source of truth via ThemeProvider. */
import { useTheme } from './useTheme'

export function useReducedMotion(): boolean {
    return useTheme().reducedMotion
}
