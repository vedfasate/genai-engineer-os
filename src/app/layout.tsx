import '@/styles/globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import type { ThemeMode } from '@/types/theme.types'
import { ThemeProvider } from '@/core/theme/ThemeProvider'
import { getThemeBootstrapScript } from '@/core/theme/themeUtils'
import { STORAGE_KEYS } from '@/core/constants/storageKeys'

const THEME_STORAGE_KEY = STORAGE_KEYS.themeMode
const DEFAULT_THEME_MODE: ThemeMode = 'system'

export const metadata: Metadata = {
    title: 'GenAI Engineer OS',
    description:
        'A scalable AI-powered operating system for career development, learning, and project mastery.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: getThemeBootstrapScript(THEME_STORAGE_KEY, DEFAULT_THEME_MODE),
                    }}
                />
            </head>
            <body>
                <ThemeProvider defaultMode={DEFAULT_THEME_MODE} storageKey={THEME_STORAGE_KEY}>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
