export interface CareerScore {
    totalPoints: number
    skills: Record<string, number>
    readiness: number
}

export function calculateCareerScore(data: CareerScore): CareerScore {
    return {
        ...data,
        totalPoints: Object.values(data.skills).reduce((sum, value) => sum + value, 0),
    }
}
