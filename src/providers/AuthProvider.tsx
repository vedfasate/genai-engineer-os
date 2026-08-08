'use client'

import type { ReactNode } from 'react'

/**
 * @purpose MVP authentication provider boundary.
 *
 * Supabase-backed session state will plug in here once authentication work
 * becomes a real feature dependency.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
    return <>{children}</>
}
