'use client'

import * as React from 'react'
import { Paperclip, Send, Square } from 'lucide-react'
import { Button } from '@/shared/ui/Button'

interface ChatInputProps {
    selectedModelId: string
    isStreaming: boolean
    input: string
    onInputChange: (value: string) => void
    onSend: (message: string) => void
    onAbort: () => void
}

export function ChatInput({ selectedModelId, isStreaming, input, onInputChange, onSend, onAbort }: ChatInputProps) {
    const submit = React.useCallback(() => {
        if (!input.trim() || isStreaming) {
            return
        }

        onSend(input)
        onInputChange('')
    }, [input, isStreaming, onInputChange, onSend])

    return (
        <div className="border-t border-border bg-background-surface/80 p-4 backdrop-blur-md">
            <form
                className="flex items-end gap-3"
                onSubmit={(event) => {
                    event.preventDefault()
                    submit()
                }}
            >
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-11 w-11 shrink-0 rounded-lg p-0"
                    aria-label="Attach file"
                >
                    <Paperclip className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                </Button>
                <textarea
                    className="max-h-40 min-h-11 min-w-0 flex-1 resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary shadow-inner outline-none transition-all placeholder:text-text-secondary focus:ring-2 focus:ring-accent/50"
                    placeholder={`Message ${selectedModelId}...`}
                    value={input}
                    rows={1}
                    onChange={(event) => onInputChange(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.shiftKey) {
                            event.preventDefault()
                            submit()
                        }
                    }}
                />
                {isStreaming ? (
                    <Button
                        type="button"
                        variant="outline"
                        className="h-11 shrink-0 rounded-lg px-4 text-text-primary sm:px-5"
                        onClick={onAbort}
                    >
                        <Square className="h-3.5 w-3.5 sm:mr-2" aria-hidden="true" />
                        <span className="hidden sm:inline">Stop</span>
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        disabled={!input.trim()}
                        className="h-11 shrink-0 rounded-lg bg-accent px-4 text-white shadow-md hover:bg-accent-hover sm:px-6"
                    >
                        <Send className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                        <span className="hidden sm:inline">Send</span>
                    </Button>
                )}
            </form>
        </div>
    )
}
