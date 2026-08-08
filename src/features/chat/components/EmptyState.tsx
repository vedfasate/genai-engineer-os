import { Terminal } from 'lucide-react'
import { SuggestedPrompts } from '@/features/chat/components/SuggestedPrompts'

interface EmptyStateProps {
    onPromptSelect: (prompt: string) => void
}

export function EmptyState({ onPromptSelect }: EmptyStateProps) {
    return (
        <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent">
                <Terminal className="h-6 w-6" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">How can I assist your engineering workflow?</h2>
            <p className="text-sm text-text-secondary">
                Choose a suggested prompt below or type your query to begin reasoning across models.
            </p>
            <SuggestedPrompts onSelect={onPromptSelect} />
        </div>
    )
}
