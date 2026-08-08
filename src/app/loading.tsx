import { Loader2 } from 'lucide-react'

export default function GlobalLoading() {
    return (
        <div className="flex h-full w-full flex-1 items-center justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-text-secondary" aria-hidden="true" />
        </div>
    )
}
