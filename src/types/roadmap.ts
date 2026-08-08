export interface SubTopic {
    id: string
    title: string
    completed: boolean
}

export interface RoadmapTopic {
    id: string
    title: string
    subtopics: SubTopic[]
}

export interface SkillCategory {
    id: string
    name: string
    targetRole: string
    topics: RoadmapTopic[]
}
