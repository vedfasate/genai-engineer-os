export const featureFlags = {
    aiMentor: false,
    salaryPredictor: false,
    voiceNotes: false,
    experimentalRoadmap: false,
}

export type FeatureFlagKeys = keyof typeof featureFlags

export function isFeatureEnabled(key: FeatureFlagKeys) {
    return featureFlags[key]
}
