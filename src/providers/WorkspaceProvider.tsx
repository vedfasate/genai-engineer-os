'use client'

import type { ReactNode } from 'react'

/**
 * @purpose MVP workspace provider boundary.
 *
 * Future project, chat, and active workspace state should be introduced here
 * instead of being coupled directly to the app shell.
 */
export function WorkspaceProvider({ children }: { children: ReactNode }) {
    return <>{children}</>
}
