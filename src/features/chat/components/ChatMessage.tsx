'use client'

import * as React from 'react'
import { Bot, Check, Copy, Cpu, Loader2, RotateCw, User } from 'lucide-react'
import { cn } from '@/lib/cn'
import { getChatModel } from '@/features/chat/registry/models'
import { MarkdownRenderer } from '@/features/chat/components/MarkdownRenderer'
import type { ChatMessage as ChatMessageType } from '@/features/chat/types'

interface ChatMessageProps {
    message: ChatMessageType
    onRetry?: () => void
}

export function ChatMessage({ message, onRetry }: ChatMessageProps) {
    const [copied, setCopied] = React.useState(false)
    const model = message.modelId ? getChatModel(message.modelId) : null
    const isAssistant = message.role === 'assistant'
    const isThinking = isAssistant && message.status === 'pending'
    const isStreaming = isAssistant && message.status === 'streaming'

    const handleCopy = React.useCallback(async () => {
        await navigator.clipboard.writeText(message.content)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1800)
    }, [message.content])

    return (
        <div
            className={cn(
                'group flex max-w-4xl animate-in items-start gap-4 fade-in duration-300',
                message.role === 'user' && 'ml-auto flex-row-reverse'
            )}
        >
            <div
                className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-medium shadow-sm',
                    message.role === 'user'
                        ? 'border-transparent bg-accent text-white'
                        : 'border-border bg-background text-text-primary'
                )}
            >
                {message.role === 'user' ? (
                    <User className="h-4 w-4" aria-hidden="true" />
                ) : (
                    <Bot className="h-4 w-4" aria-hidden="true" />
                )}
            </div>

            <div
                className={cn(
                    'flex max-w-[min(42rem,calc(100vw-9rem))] flex-col gap-2 rounded-lg p-4 text-sm shadow-sm',
                    message.role === 'user'
                        ? 'rounded-tr-sm bg-accent text-white'
                        : 'rounded-tl-sm border border-border bg-background text-text-primary'
                )}
            >
                {isAssistant && model && (
                    <div className="mb-1 flex items-center gap-1.5 border-b border-border/50 pb-2 text-xs text-text-secondary">
                        <Cpu className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                        <span className="font-mono font-medium">{model.id}</span>
                        <span className="text-text-tertiary">/ {model.capability}</span>
                        {isStreaming && (
                            <span className="ml-auto flex items-center gap-1.5 text-accent">
                                <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                                Thinking...
                            </span>
                        )}
                    </div>
                )}
                {isThinking ? (
                    <div className="flex items-center gap-2 text-text-secondary">
                        <span>Thinking</span>
                        <span className="inline-flex w-8 animate-pulse font-mono text-accent">...</span>
                    </div>
                ) : (
                    <MarkdownRenderer content={message.content} />
                )}
                {isAssistant && message.status === 'completed' && message.content && (
                    <div className="mt-1 flex items-center gap-2 border-t border-border/40 pt-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background-surface/60 px-2 text-xs text-text-secondary transition-colors hover:text-text-primary"
                            title="Copy text"
                        >
                            {copied ? (
                                <Check className="h-3 w-3 text-status-success" aria-hidden="true" />
                            ) : (
                                <Copy className="h-3 w-3" aria-hidden="true" />
                            )}
                            {copied ? 'Copied' : 'Copy'}
                        </button>
                        {onRetry && (
                            <button
                                type="button"
                                onClick={onRetry}
                                className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background-surface/60 px-2 text-xs text-text-secondary transition-colors hover:text-text-primary"
                                title="Retry generation"
                            >
                                <RotateCw className="h-3 w-3" aria-hidden="true" />
                                Retry
                            </button>
                        )}
                    </div>
                )}
                <span
                    className={cn(
                        'mt-1 self-end font-mono text-[10px] opacity-70',
                        message.role === 'user' ? 'text-white/80' : 'text-text-secondary'
                    )}
                >
                    {message.status === 'streaming' ? 'Streaming' : message.timestamp}
                </span>
            </div>
        </div>
    )
}
