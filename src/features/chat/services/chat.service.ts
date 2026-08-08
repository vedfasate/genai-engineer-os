import type { SendMessageInput, SendMessageResult } from '@/features/chat/types'

function createMockResponse({ message, modelId }: SendMessageInput): string {
    return `Here is the architectural breakdown for your query regarding **"${message}"** using **[${modelId}]**:\n\n\`\`\`typescript\n// Optimized pipeline implementation\nexport async function processRequest(payload: string) {\n    const engine = initializeEngine()\n    return await engine.execute(payload)\n}\n\`\`\`\n\n- **Scalability:** Verified across distributed nodes.\n- **Performance:** Optimized for low-latency execution.\n- **Integration:** Ready to swap from mock transport to provider adapters.\n\nLet me know if you would like to refactor this further or test edge cases.`
}

export async function sendMessage(input: SendMessageInput): Promise<SendMessageResult> {
    await new Promise((resolve) => window.setTimeout(resolve, 500))

    return {
        content: createMockResponse(input),
        modelId: input.modelId,
    }
}

export async function streamMessage(
    input: SendMessageInput,
    onChunk: (chunk: string) => void,
    signal?: AbortSignal
): Promise<SendMessageResult> {
    const content = createMockResponse(input)
    const tokens = content.split(/(\s+)/)
    let currentText = ''

    for (const token of tokens) {
        if (signal?.aborted) {
            throw new DOMException('Generation aborted', 'AbortError')
        }

        currentText += token
        onChunk(currentText)
        await new Promise((resolve) => window.setTimeout(resolve, 24))
    }

    return {
        content,
        modelId: input.modelId,
    }
}

export function abortGeneration(controller: AbortController) {
    controller.abort()
}

export function retryMessage(input: SendMessageInput, signal?: AbortSignal) {
    return streamMessage(input, () => undefined, signal)
}
