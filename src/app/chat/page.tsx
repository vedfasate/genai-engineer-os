/**
 * @maturity Experimental
 * @purpose Multi-model AI Chat interface supporting ChatGPT, Claude, Gemini, DeepSeek, and Grok.
 */
'use client'

import * as React from 'react'
import { ChatHeader, ChatInput, MessageList, useChat } from '@/features/chat'

export default function AIChatPage() {
    const [input, setInput] = React.useState('')
    const injectedPromptRef = React.useRef<string | null>(null)
    const chat = useChat()

    React.useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search)
        const prompt = searchParams.get('prompt')

        if (!prompt || injectedPromptRef.current === prompt) {
            return
        }

        injectedPromptRef.current = prompt
        setInput(prompt)
    }, [])

    return (
        <div className="flex h-[calc(100vh-8.5rem)] min-h-[640px] flex-col overflow-hidden rounded-lg border border-border bg-background-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_18px_48px_rgba(0,0,0,0.22)]">
            <ChatHeader
                selectedModelId={chat.selectedModelId}
                onModelChange={chat.setSelectedModelId}
                onClear={chat.resetConversation}
            />
            <MessageList
                messages={chat.messages}
                onPromptSelect={chat.send}
                onRetryLastMessage={chat.retryLastMessage}
            />
            <ChatInput
                selectedModelId={chat.selectedModelId}
                isStreaming={chat.isStreaming}
                input={input}
                onInputChange={setInput}
                onSend={chat.send}
                onAbort={chat.abort}
            />
        </div>
    )
}
