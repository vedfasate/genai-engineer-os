export type ChatRole = 'user' | 'assistant'

export type MessageStatus = 'pending' | 'streaming' | 'completed' | 'error'

export interface ChatMessage {
    id: string
    role: ChatRole
    content: string
    timestamp: string
    status: MessageStatus
    modelId?: string
}

export interface ConversationSettings {
    modelId: string
}

export interface ConversationSummary {
    id: string
    title: string
    updatedAt: string
    modelId: string
}

export interface Conversation {
    id: string
    title: string
    messages: ChatMessage[]
    settings: ConversationSettings
    createdAt: string
    updatedAt: string
}

export interface ModelConfiguration {
    id: string
    label: string
    provider: string
    capability: string
    contextWindow: number
    vision: boolean
    reasoning: boolean
    realtime: boolean
}

export interface SendMessageInput {
    conversationId: string
    modelId: string
    message: string
}

export interface SendMessageResult {
    content: string
    modelId: string
}
