export interface InterviewReadiness {
    systemDesign: number
    behavioral: number
    technical: number
}

export function getInterviewReadinessScore(readiness: InterviewReadiness) {
    return Math.round((readiness.systemDesign + readiness.behavioral + readiness.technical) / 3)
}
