'use client'

import { AlertTriangle } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background-base p-6">
            <EmptyState
                icon={<AlertTriangle className="h-6 w-6 text-status-danger" />}
                title="Application Error"
                description={error.message || 'An unexpected error occurred in the application shell.'}
                action={<Button onClick={reset}>Try again</Button>}
            />
        </div>
    )
}
