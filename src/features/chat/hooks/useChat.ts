'use client'

import * as React from 'react'
import { DEFAULT_CHAT_MODEL_ID } from '@/features/chat/registry/models'
import { streamMessage } from '@/features/chat/services/chat.service'
import type { ChatMessage, Conversation } from '@/features/chat/types'

const INITIAL_ASSISTANT_MESSAGE: ChatMessage = {
    id: 'welcome',
    role: 'assistant',
    content:
        'Hello! I am your GenAI Engineer OS copilot. Select an LLM model above and let me know what architecture, code, or engineering problem you want to tackle today.',
    modelId: DEFAULT_CHAT_MODEL_ID,
    timestamp: 'Just now',
    status: 'completed',
}

function getTimeLabel() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function createConversation(modelId: string): Conversation {
    const now = new Date().toISOString()

    return {
        id: crypto.randomUUID(),
        title: 'New AI Chat',
        messages: [{ ...INITIAL_ASSISTANT_MESSAGE, modelId }],
        settings: { modelId },
        createdAt: now,
        updatedAt: now,
    }
}

interface SendOptions {
    appendUserMessage?: boolean
}

export function useChat(initialModelId = DEFAULT_CHAT_MODEL_ID) {
    const [conversation, setConversation] = React.useState<Conversation>(() => createConversation(initialModelId))
    const abortControllerRef = React.useRef<AbortController | null>(null)

    const selectedModelId = conversation.settings.modelId
    const messages = conversation.messages
    const isStreaming = messages.some((message) => message.status === 'streaming' || message.status === 'pending')

    const setSelectedModelId = React.useCallback((modelId: string) => {
        setConversation((current) => ({
            ...current,
            settings: { ...current.settings, modelId },
            updatedAt: new Date().toISOString(),
        }))
    }, [])

    const resetConversation = React.useCallback(() => {
        abortControllerRef.current?.abort()
        abortControllerRef.current = null
        setConversation(createConversation(selectedModelId))
    }, [selectedModelId])

    const send = React.useCallback(
        async (content: string, options: SendOptions = {}) => {
            const trimmedContent = content.trim()
            const appendUserMessage = options.appendUserMessage ?? true

            if (!trimmedContent || isStreaming) {
                return
            }

            const controller = new AbortController()
            abortControllerRef.current = controller

            const assistantMessageId = crypto.randomUUID()
            const now = new Date().toISOString()
            const userMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: 'user',
                content: trimmedContent,
                timestamp: getTimeLabel(),
                status: 'completed',
            }

            const pendingAssistantMessage: ChatMessage = {
                id: assistantMessageId,
                role: 'assistant',
                content: '',
                modelId: selectedModelId,
                timestamp: getTimeLabel(),
                status: 'pending',
            }

            setConversation((current) => ({
                ...current,
                messages: [
                    ...current.messages,
                    ...(appendUserMessage ? [userMessage] : []),
                    pendingAssistantMessage,
                ],
                title: current.messages.length <= 1 ? trimmedContent.slice(0, 48) : current.title,
                updatedAt: now,
            }))

            try {
                await streamMessage(
                    {
                        conversationId: conversation.id,
                        modelId: selectedModelId,
                        message: trimmedContent,
                    },
                    (chunk) => {
                        setConversation((current) => ({
                            ...current,
                            messages: current.messages.map((message) =>
                                message.id === assistantMessageId
                                    ? {
                                          ...message,
                                          content: chunk,
                                          status: 'streaming',
                                      }
                                    : message
                            ),
                            updatedAt: new Date().toISOString(),
                        }))
                    },
                    controller.signal
                )

                setConversation((current) => ({
                    ...current,
                    messages: current.messages.map((message) =>
                        message.id === assistantMessageId ? { ...message, status: 'completed' } : message
                    ),
                    updatedAt: new Date().toISOString(),
                }))
            } catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') {
                    setConversation((current) => ({
                        ...current,
                        messages: current.messages.map((message) =>
                            message.id === assistantMessageId
                                ? {
                                      ...message,
                                      content: `${message.content}\n\n*[Generation stopped]*`,
                                      status: 'completed',
                                  }
                                : message
                        ),
                        updatedAt: new Date().toISOString(),
                    }))
                    return
                }

                setConversation((current) => ({
                    ...current,
                    messages: current.messages.map((message) =>
                        message.id === assistantMessageId
                            ? {
                                  ...message,
                                  content: 'The response failed before completion. Retry will be available here once provider adapters are connected.',
                                  status: 'error',
                              }
                            : message
                    ),
                    updatedAt: new Date().toISOString(),
                }))
            } finally {
                abortControllerRef.current = null
            }
        },
        [conversation.id, isStreaming, selectedModelId]
    )

    const abort = React.useCallback(() => {
        abortControllerRef.current?.abort()
        abortControllerRef.current = null
    }, [])

    const retryLastMessage = React.useCallback(async () => {
        if (isStreaming) {
            return
        }

        const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user')

        if (!lastUserMessage) {
            return
        }

        setConversation((current) => {
            const lastAssistantIndex = [...current.messages]
                .map((message, index) => ({ message, index }))
                .reverse()
                .find(({ message }) => message.role === 'assistant' && message.id !== 'welcome')?.index

            if (lastAssistantIndex === undefined) {
                return current
            }

            return {
                ...current,
                messages: current.messages.filter((_, index) => index !== lastAssistantIndex),
                updatedAt: new Date().toISOString(),
            }
        })

        await send(lastUserMessage.content, { appendUserMessage: false })
    }, [isStreaming, messages, send])

    return {
        conversation,
        messages,
        selectedModelId,
        isStreaming,
        setSelectedModelId,
        resetConversation,
        send,
        abort,
        retryLastMessage,
    }
}
