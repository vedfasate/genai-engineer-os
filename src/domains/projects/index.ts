export interface ProjectHealth {
    name: string
    completion: number
    dueDate?: string
}

export function evaluateProjectHealth(project: ProjectHealth) {
    return project.completion >= 80 ? 'healthy' : 'needs attention'
}
