import { RotateCcw, Sparkles } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { ModelSelector } from '@/features/chat/components/ModelSelector'

interface ChatHeaderProps {
    selectedModelId: string
    onModelChange: (modelId: string) => void
    onClear: () => void
}

export function ChatHeader({ selectedModelId, onModelChange, onClear }: ChatHeaderProps) {
    return (
        <div className="flex flex-col gap-4 border-b border-border bg-background-surface/80 px-4 py-4 backdrop-blur-md lg:flex-row lg:items-center lg:justify-between lg:px-6">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-accent shadow-inner">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                    <h1 className="text-base font-bold leading-none tracking-tight text-text-primary">
                        AI Engineering Copilot
                    </h1>
                    <p className="mt-1 text-xs text-text-secondary">Unified multi-model reasoning workspace</p>
                </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-text-secondary hover:text-text-primary"
                    onClick={onClear}
                >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    Clear Chat
                </Button>
                <ModelSelector value={selectedModelId} onChange={onModelChange} />
            </div>
        </div>
    )
}
