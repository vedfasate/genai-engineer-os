export function logEvent(name: string, payload?: unknown) {
    console.log('[Event]', name, payload)
}

export function logPerformance(metric: string, value: number) {
    console.log('[Performance]', metric, value)
}
