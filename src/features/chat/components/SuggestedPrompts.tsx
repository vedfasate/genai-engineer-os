const SUGGESTED_PROMPTS = [
    'Generate React component with Tailwind',
    'Review Python code for memory leaks',
    'Plan system design for microservices',
    'Explain RAG architecture patterns',
]

interface SuggestedPromptsProps {
    onSelect: (prompt: string) => void
}

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
    return (
        <div className="grid w-full gap-2 pt-2 sm:grid-cols-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                    key={prompt}
                    type="button"
                    onClick={() => onSelect(prompt)}
                    className="rounded-lg border border-border bg-background p-3 text-left text-xs text-text-secondary transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-background-surface-hover hover:text-text-primary"
                >
                    {prompt}
                </button>
            ))}
        </div>
    )
}
