'use client'

import type { ReactNode } from 'react'
import type { ThemeMode } from '@/types/theme.types'
import { ThemeProvider } from '@/core/theme/ThemeProvider'
import { STORAGE_KEYS } from '@/core/constants/storageKeys'
import { AuthProvider } from './AuthProvider'
import { WorkspaceProvider } from './WorkspaceProvider'

const DEFAULT_THEME_MODE: ThemeMode = 'system'

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider defaultMode={DEFAULT_THEME_MODE} storageKey={STORAGE_KEYS.themeMode}>
            <AuthProvider>
                <WorkspaceProvider>{children}</WorkspaceProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}
