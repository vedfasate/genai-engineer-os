'use client'

import { CAREER_ROADMAP } from '@/data/roadmap'
import type { SkillCategory } from '@/types/roadmap'

export const STORAGE_KEYS = {
    planner: 'careeros.planner.v1',
    legacyTasks: 'careeros.tasks.v1',
    roadmap: 'careeros.career-roadmap.v1',
    notes: 'careeros.notes.v1',
    calendar: 'careeros.calendar.v1',
    reviews: 'careeros.daily-reviews.v1',
}

export type PlannerPriority = 'High' | 'Medium' | 'Low'
export type PlannerCategory = 'Python' | 'DSA' | 'SQL' | 'BIA Class' | 'System Design' | 'General'

export interface PlannerTask {
    id: string
    title: string
    description: string
    category: PlannerCategory
    priority: PlannerPriority
    completed: boolean
    dueDate: string
    estimatedMinutes: number
    actualMinutes: number
    subtasks: { id: string; title: string; completed: boolean }[]
    archived?: boolean
    completedAt?: string
    recurring?: 'None' | 'Daily' | 'Weekly' | 'Monthly'
}

export interface NoteSummary {
    id: string
    title: string
    body: string
    updatedAt: string
    tags?: string[]
    folder?: string
    pinned?: boolean
    bookmarked?: boolean
}

export interface CalendarEvent {
    id: string
    title: string
    date: string
    startTime: string
    endTime: string
    type: 'Study' | 'Exam' | 'Interview' | 'Deadline' | 'Revision' | 'Rest'
    recurring: 'None' | 'Daily' | 'Weekly' | 'Monthly'
}

export interface DailyReview {
    id: string
    date: string
    achievements: string
    missedTasks: string
    tomorrowPriorities: string
    reflection: string
    studyHours: number
    mood: 'Low' | 'Okay' | 'Good' | 'Great'
    careerScoreChange: number
}

export interface CareerMetrics {
    tasks: PlannerTask[]
    notes: NoteSummary[]
    roadmap: SkillCategory[]
    events: CalendarEvent[]
    reviews: DailyReview[]
    completedToday: number
    pendingTasks: number
    roadmapCompletion: number
    notesCount: number
    studyStreak: number
    weeklyProgress: number
    monthlyProgress: number
    careerScore: number
    upcomingDeadlines: CalendarEvent[]
    recentActivity: { id: string; title: string; detail: string }[]
    weakTopics: string[]
}

const today = () => new Date().toISOString().slice(0, 10)

function readJson<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') {
        return fallback
    }

    try {
        const raw = window.localStorage.getItem(key)
        return raw ? (JSON.parse(raw) as T) : fallback
    } catch {
        return fallback
    }
}

function normalizeTask(task: Partial<PlannerTask>): PlannerTask {
    return {
        id: task.id ?? `task-${Date.now()}`,
        title: task.title ?? 'Untitled task',
        description: task.description ?? '',
        category: task.category ?? 'General',
        priority: task.priority ?? 'Medium',
        completed: task.completed ?? false,
        dueDate: task.dueDate ?? today(),
        estimatedMinutes: task.estimatedMinutes ?? 45,
        actualMinutes: task.actualMinutes ?? 0,
        subtasks: task.subtasks ?? [],
        archived: task.archived ?? false,
        completedAt: task.completedAt,
        recurring: task.recurring ?? 'None',
    }
}

export function loadPlannerTasks(): PlannerTask[] {
    if (typeof window === 'undefined') {
        return []
    }

    const saved = window.localStorage.getItem(STORAGE_KEYS.planner) ?? window.localStorage.getItem(STORAGE_KEYS.legacyTasks)
    if (!saved) {
        return []
    }

    try {
        return (JSON.parse(saved) as Partial<PlannerTask>[]).map(normalizeTask)
    } catch {
        return []
    }
}

export function savePlannerTasks(tasks: PlannerTask[]) {
    window.localStorage.setItem(STORAGE_KEYS.planner, JSON.stringify(tasks))
}

function loadRoadmap(): SkillCategory[] {
    const saved = readJson<SkillCategory[] | null>(STORAGE_KEYS.roadmap, null)
    if (!saved) {
        return CAREER_ROADMAP
    }

    const savedCompletion = new Map<string, boolean>()
    saved.forEach((category) =>
        category.topics.forEach((topic) =>
            topic.subtopics.forEach((subtopic) => savedCompletion.set(subtopic.id, subtopic.completed))
        )
    )

    return CAREER_ROADMAP.map((category) => ({
        ...category,
        topics: category.topics.map((topic) => ({
            ...topic,
            subtopics: topic.subtopics.map((subtopic) => ({
                ...subtopic,
                completed: savedCompletion.get(subtopic.id) ?? subtopic.completed,
            })),
        })),
    }))
}

function roadmapProgress(roadmap: SkillCategory[]) {
    const subtopics = roadmap.flatMap((category) => category.topics.flatMap((topic) => topic.subtopics))
    const completed = subtopics.filter((subtopic) => subtopic.completed).length
    return subtopics.length > 0 ? Math.round((completed / subtopics.length) * 100) : 0
}

function calculateStreak(tasks: PlannerTask[], reviews: DailyReview[]) {
    const activeDays = new Set([
        ...tasks.filter((task) => task.completedAt).map((task) => task.completedAt!.slice(0, 10)),
        ...reviews.filter((review) => review.studyHours > 0).map((review) => review.date),
    ])

    let streak = 0
    const cursor = new Date()
    while (activeDays.has(cursor.toISOString().slice(0, 10))) {
        streak += 1
        cursor.setDate(cursor.getDate() - 1)
    }

    return streak
}

export function loadCareerMetrics(): CareerMetrics {
    const tasks = loadPlannerTasks()
    const notes = readJson<NoteSummary[]>(STORAGE_KEYS.notes, [])
    const roadmap = loadRoadmap()
    const events = readJson<CalendarEvent[]>(STORAGE_KEYS.calendar, [])
    const reviews = readJson<DailyReview[]>(STORAGE_KEYS.reviews, [])

    return buildCareerMetrics(tasks, notes, roadmap, events, reviews)
}

export function getDefaultCareerMetrics(): CareerMetrics {
    return buildCareerMetrics([], [], CAREER_ROADMAP, [], [])
}

function buildCareerMetrics(
    tasks: PlannerTask[],
    notes: NoteSummary[],
    roadmap: SkillCategory[],
    events: CalendarEvent[],
    reviews: DailyReview[]
): CareerMetrics {
    const todayKey = today()
    const activeTasks = tasks.filter((task) => !task.archived)
    const completedToday = tasks.filter((task) => task.completed && task.completedAt?.slice(0, 10) === todayKey).length
    const pendingTasks = activeTasks.filter((task) => !task.completed).length
    const completion = roadmapProgress(roadmap)
    const weeklyProgress = Math.min(100, Math.round((tasks.filter((task) => task.completed).length / Math.max(tasks.length, 1)) * 100))
    const monthStudyHours = reviews.reduce((total, review) => total + review.studyHours, 0)
    const monthlyProgress = Math.min(100, Math.round((monthStudyHours / 80) * 100))
    const weakTopics = roadmap
        .flatMap((category) => category.topics.map((topic) => ({ category: category.name, topic })))
        .filter(({ topic }) => topic.subtopics.some((subtopic) => !subtopic.completed))
        .slice(0, 5)
        .map(({ category, topic }) => `${category}: ${topic.title}`)

    const careerScore = Math.min(
        1000,
        Math.round(completion * 6 + weeklyProgress * 1.5 + monthlyProgress + Math.min(notes.length, 40) * 3)
    )

    return {
        tasks,
        notes,
        roadmap,
        events,
        reviews,
        completedToday,
        pendingTasks,
        roadmapCompletion: completion,
        notesCount: notes.length,
        studyStreak: calculateStreak(tasks, reviews),
        weeklyProgress,
        monthlyProgress,
        careerScore,
        upcomingDeadlines: events
            .filter((event) => ['Deadline', 'Exam', 'Interview'].includes(event.type) && event.date >= todayKey)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 5),
        recentActivity: [
            ...tasks.filter((task) => task.completed).slice(0, 3).map((task) => ({
                id: task.id,
                title: `Completed ${task.title}`,
                detail: task.completedAt ?? 'Recently',
            })),
            ...notes.slice(0, 2).map((note) => ({ id: note.id, title: `Updated ${note.title}`, detail: note.updatedAt })),
        ],
        weakTopics,
    }
}
