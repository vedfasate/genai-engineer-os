'use client'

import * as React from 'react'
import { loadCareerMetrics, type CareerMetrics } from '@/lib/careerData'

export function useCareerMetrics() {
    const [metrics, setMetrics] = React.useState<CareerMetrics>(() => loadCareerMetrics())

    React.useEffect(() => {
        const refresh = () => setMetrics(loadCareerMetrics())
        refresh()
        window.addEventListener('storage', refresh)
        window.addEventListener('careeros:data-changed', refresh)
        return () => {
            window.removeEventListener('storage', refresh)
            window.removeEventListener('careeros:data-changed', refresh)
        }
    }, [])

    return metrics
}

export function notifyCareerDataChanged() {
    window.dispatchEvent(new Event('careeros:data-changed'))
}
