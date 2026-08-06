"use client"

import type { ThemeMode } from '@/types/theme.types'
import { useTheme } from './useTheme'

const OPTIONS: { mode: ThemeMode; label: string }[] = [
    { mode: 'light', label: 'Light' },
    { mode: 'dark', label: 'Dark' },
    { mode: 'system', label: 'System' },
]

export function ThemeSwitcher() {
    const { mode, setMode } = useTheme()

    return (
        <div
            role="radiogroup"
            aria-label="Theme"
            style={{
                display: 'inline-flex',
                gap: '4px',
                padding: '4px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-background-surface)',
                border: '1px solid var(--color-border-subtle)',
            }}
        >
            {OPTIONS.map((option) => {
                const isActive = mode === option.mode
                return (
                    <button
                        key={option.mode}
                        type="button"
                        role="radio"
                        aria-checked={isActive}
                        onClick={() => setMode(option.mode)}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '0.875rem',
                            fontFamily: 'Inter, sans-serif',
                            cursor: 'pointer',
                            backgroundColor: isActive ? 'var(--color-accent-default)' : 'transparent',
                            color: isActive ? 'var(--color-interactive-primary-text)' : 'var(--color-text-secondary)',
                            transition: 'background-color 0.15s ease, color 0.15s ease',
                        }}
                    >
                        {option.label}
                    </button>
                )
            })}
        </div>
    )
}
