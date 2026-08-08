import type { ModelConfiguration } from '@/features/chat/types'

export const CHAT_MODELS: ModelConfiguration[] = [
    {
        id: 'gemini-2.5-pro',
        label: 'Gemini 2.5 Pro',
        provider: 'Google',
        capability: '2M Context',
        contextWindow: 2000000,
        vision: true,
        reasoning: true,
        realtime: false,
    },
    {
        id: 'claude-3-5-sonnet',
        label: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        capability: 'Reasoning',
        contextWindow: 200000,
        vision: true,
        reasoning: true,
        realtime: false,
    },
    {
        id: 'gpt-4o',
        label: 'GPT-4o',
        provider: 'OpenAI',
        capability: 'Vision',
        contextWindow: 128000,
        vision: true,
        reasoning: false,
        realtime: true,
    },
    {
        id: 'deepseek-r1',
        label: 'DeepSeek R1',
        provider: 'DeepSeek',
        capability: 'Reasoning',
        contextWindow: 128000,
        vision: false,
        reasoning: true,
        realtime: false,
    },
    {
        id: 'grok-3',
        label: 'Grok 3',
        provider: 'xAI',
        capability: 'Realtime',
        contextWindow: 128000,
        vision: true,
        reasoning: true,
        realtime: true,
    },
]

export const DEFAULT_CHAT_MODEL_ID = CHAT_MODELS[0].id

export function getChatModel(modelId: string) {
    return CHAT_MODELS.find((model) => model.id === modelId) ?? CHAT_MODELS[0]
}
