type Listener<T = any> = (payload: T) => void

const listeners = new Map<string, Listener[]>()

export const eventBus = {
    publish<T>(event: string, payload: T) {
        listeners.get(event)?.forEach((listener) => listener(payload))
    },
    subscribe<T>(event: string, listener: Listener<T>) {
        const existing = listeners.get(event) ?? []
        listeners.set(event, [...existing, listener as Listener])
        return () => {
            listeners.set(
                event,
                (listeners.get(event) ?? []).filter((item) => item !== listener)
            )
        }
    },
}
