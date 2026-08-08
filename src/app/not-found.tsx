import Link from 'next/link'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { EmptyState } from '@/shared/ui/EmptyState'

export default function NotFound() {
    return (
        <div className="flex h-full w-full flex-1 items-center justify-center p-6">
            <EmptyState
                icon={<FileQuestion className="h-6 w-6 text-text-secondary" />}
                title="Page not found"
                description="The page you are looking for does not exist or has been moved."
                action={
                    <Link href="/dashboard">
                        <Button>Return to Dashboard</Button>
                    </Link>
                }
            />
        </div>
    )
}
