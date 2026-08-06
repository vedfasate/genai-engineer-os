export interface AnalyticsSummary {
    activeUsers: number
    completionRate: number
    goalProgress: number
}

export function createAnalyticsSnapshot(summary: AnalyticsSummary) {
    return {
        ...summary,
        updatedAt: new Date().toISOString(),
    }
}
