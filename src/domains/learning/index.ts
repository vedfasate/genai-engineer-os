export interface LearningProgress {
    completedLessons: number
    streakDays: number
    xpEarned: number
}

export function getLearningProgressSummary(progress: LearningProgress) {
    return `${progress.completedLessons} lessons, ${progress.streakDays} day streak, ${progress.xpEarned} XP`
}
