'use client'

import * as React from 'react'
import { ChatMessage } from '@/features/chat/components/ChatMessage'
import { EmptyState } from '@/features/chat/components/EmptyState'
import type { ChatMessage as ChatMessageType } from '@/features/chat/types'

interface MessageListProps {
    messages: ChatMessageType[]
    onPromptSelect: (prompt: string) => void
    onRetryLastMessage: () => void
}

export function MessageList({ messages, onPromptSelect, onRetryLastMessage }: MessageListProps) {
    const messagesEndRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    return (
        <div className="flex-1 space-y-6 overflow-y-auto p-4 lg:p-6">
            {messages.length === 1 && <EmptyState onPromptSelect={onPromptSelect} />}
            {messages.map((message) => (
                <ChatMessage key={message.id} message={message} onRetry={onRetryLastMessage} />
            ))}
            <div ref={messagesEndRef} />
        </div>
    )
}
