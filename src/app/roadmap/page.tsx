'use client'

import * as React from 'react'
import {
    Award,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Circle,
    Download,
    Filter,
    Lock,
    RotateCcw,
    Search,
    Target,
    Upload,
    Zap,
} from 'lucide-react'
import { CAREER_ROADMAP } from '@/data/roadmap'
import type { SkillCategory } from '@/types/roadmap'
import { notifyCareerDataChanged } from '@/hooks/useCareerMetrics'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/lib/cn'

const STORAGE_KEY = 'careeros.career-roadmap.v1'

function countCategory(category: SkillCategory) {
    const subtopics = category.topics.flatMap((topic) => topic.subtopics)
    const completed = subtopics.filter((subtopic) => subtopic.completed).length

    return {
        completed,
        total: subtopics.length,
        progress: subtopics.length > 0 ? Math.round((completed / subtopics.length) * 100) : 0,
    }
}

function loadRoadmap() {
    if (typeof window === 'undefined') {
        return CAREER_ROADMAP
    }

    try {
        const saved = window.localStorage.getItem(STORAGE_KEY)
        if (!saved) {
            return CAREER_ROADMAP
        }

        const savedRoadmap = JSON.parse(saved) as SkillCategory[]
        const savedCompletion = new Map<string, boolean>()

        savedRoadmap.forEach((category) => {
            category.topics.forEach((topic) => {
                topic.subtopics.forEach((subtopic) => {
                    savedCompletion.set(subtopic.id, subtopic.completed)
                })
            })
        })

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
    } catch {
        return CAREER_ROADMAP
    }
}

export default function RoadmapPage() {
    const [roadmap, setRoadmap] = React.useState<SkillCategory[]>(CAREER_ROADMAP)
    const [hasHydrated, setHasHydrated] = React.useState(false)
    const [query, setQuery] = React.useState('')
    const [filter, setFilter] = React.useState<'All' | 'Weak' | 'Complete' | 'Unlocked'>('All')
    const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({
        python: true,
        dsa: true,
    })

    React.useEffect(() => {
        setRoadmap(loadRoadmap())
        setHasHydrated(true)
    }, [])

    React.useEffect(() => {
        if (hasHydrated) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(roadmap))
            notifyCareerDataChanged()
        }
    }, [hasHydrated, roadmap])

    const toggleSubtopic = (categoryId: string, topicId: string, subtopicId: string) => {
        setRoadmap((currentRoadmap) =>
            currentRoadmap.map((category) => {
                if (category.id !== categoryId) {
                    return category
                }

                return {
                    ...category,
                    topics: category.topics.map((topic) => {
                        if (topic.id !== topicId) {
                            return topic
                        }

                        return {
                            ...topic,
                            subtopics: topic.subtopics.map((subtopic) =>
                                subtopic.id === subtopicId
                                    ? { ...subtopic, completed: !subtopic.completed }
                                    : subtopic
                            ),
                        }
                    }),
                }
            })
        )
    }

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories((current) => ({
            ...current,
            [categoryId]: !(current[categoryId] ?? false),
        }))
    }

    const resetRoadmap = () => {
        setRoadmap(CAREER_ROADMAP)
    }

    const exportRoadmap = () => {
        const blob = new Blob([JSON.stringify(roadmap, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'careeros-roadmap.json'
        link.click()
        URL.revokeObjectURL(url)
    }

    const importRoadmap = (file: File | undefined) => {
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            try {
                setRoadmap(JSON.parse(String(reader.result)) as SkillCategory[])
            } catch {
                setRoadmap((current) => current)
            }
        }
        reader.readAsText(file)
    }

    const totals = roadmap.reduce(
        (accumulator, category) => {
            const categoryTotals = countCategory(category)

            return {
                completed: accumulator.completed + categoryTotals.completed,
                total: accumulator.total + categoryTotals.total,
            }
        },
        { completed: 0, total: 0 }
    )
    const overallProgress = totals.total > 0 ? Math.round((totals.completed / totals.total) * 100) : 0
    const careerScore = Math.round(overallProgress * 10)
    const weakTopics = roadmap
        .flatMap((category) => category.topics.map((topic) => ({ category, topic, totals: countCategory({ ...category, topics: [topic] }) })))
        .filter((item) => item.totals.progress < 50)
    const nextTopic = roadmap
        .flatMap((category) => category.topics.map((topic) => ({ category, topic, totals: countCategory({ ...category, topics: [topic] }) })))
        .find((item) => item.totals.progress < 100)
    const visibleRoadmap = roadmap
        .map((category) => ({
            ...category,
            topics: category.topics.filter((topic) => {
                const topicStats = countCategory({ ...category, topics: [topic] })
                const matchesQuery = `${category.name} ${topic.title} ${topic.subtopics.map((subtopic) => subtopic.title).join(' ')}`.toLowerCase().includes(query.toLowerCase())
                if (!matchesQuery) return false
                if (filter === 'Weak') return topicStats.progress < 50
                if (filter === 'Complete') return topicStats.progress === 100
                if (filter === 'Unlocked') return topicStats.completed > 0 || topic === nextTopic?.topic
                return true
            }),
        }))
        .filter((category) => category.topics.length > 0)

    return (
        <div className="flex flex-col gap-8 pb-12">
            <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                            <Target className="h-3 w-3" aria-hidden="true" />
                            Target: Rs 15+ LPA role
                        </span>
                        <span className="text-xs text-text-secondary">Industry skill matrix</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
                        Career Readiness Roadmap
                    </h1>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button variant="outline" className="w-full gap-2 sm:w-auto" onClick={resetRoadmap}>
                        <RotateCcw className="h-4 w-4" aria-hidden="true" />
                        Reset
                    </Button>
                    <Button variant="outline" className="w-full gap-2 sm:w-auto" onClick={exportRoadmap}>
                        <Download className="h-4 w-4" aria-hidden="true" />
                        Export
                    </Button>
                    <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-text-primary hover:bg-background-surface-raised">
                        <Upload className="h-4 w-4" aria-hidden="true" />
                        Import
                        <input type="file" accept="application/json" className="hidden" onChange={(event) => importRoadmap(event.target.files?.[0])} />
                    </label>
                    <div className="flex items-center gap-3 rounded-md border border-border bg-background-surface px-5 py-3 shadow-sm">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-accent/20 bg-accent/10 text-accent">
                            <Award className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div>
                            <div className="text-xs font-medium uppercase text-text-secondary">Career score</div>
                            <div className="font-mono text-xl font-extrabold text-text-primary">
                                {careerScore}
                                <span className="text-xs font-normal text-text-secondary"> / 1000</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section className="rounded-md border border-border bg-background-surface p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-text-primary">Overall skill mastery</span>
                    <span className="font-mono text-sm font-bold text-accent">{overallProgress}% complete</span>
                </div>
                <div
                    className="h-3 w-full overflow-hidden rounded-full border border-border bg-background p-0.5"
                    role="progressbar"
                    aria-label="Career readiness progress"
                    aria-valuenow={overallProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <div
                        className="h-full rounded-full bg-accent transition-all duration-500"
                        style={{ width: `${overallProgress}%` }}
                    />
                </div>
            </section>

            <section className="grid gap-4 rounded-md border border-border bg-background-surface p-5 lg:grid-cols-[1fr_180px]">
                <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
                    <Search className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search topics, modules, dependencies, or skills" className="w-full bg-transparent text-sm outline-none" />
                </div>
                <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
                    <Filter className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                    <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} className="w-full bg-transparent text-sm outline-none">
                        {['All', 'Weak', 'Complete', 'Unlocked'].map((item) => <option key={item}>{item}</option>)}
                    </select>
                </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-3">
                <div className="rounded-md border border-border bg-background-surface p-5">
                    <h2 className="mb-2 text-sm font-semibold text-text-primary">Career readiness calculation</h2>
                    <p className="text-sm text-text-secondary">{careerScore}/1000 from roadmap mastery, task consistency, notes, and review activity.</p>
                </div>
                <div className="rounded-md border border-border bg-background-surface p-5">
                    <h2 className="mb-2 text-sm font-semibold text-text-primary">Unlock next topic</h2>
                    <p className="text-sm text-text-secondary">{nextTopic ? `${nextTopic.category.name}: ${nextTopic.topic.title}` : 'All topics complete.'}</p>
                </div>
                <div className="rounded-md border border-border bg-background-surface p-5">
                    <h2 className="mb-2 text-sm font-semibold text-text-primary">Weak topic detection</h2>
                    <p className="text-sm text-text-secondary">{weakTopics.length} topics below 50% progress.</p>
                </div>
            </section>

            <section className="grid gap-5">
                {visibleRoadmap.map((category) => {
                    const categoryTotals = countCategory(category)
                    const isExpanded = expandedCategories[category.id] ?? false

                    return (
                        <article
                            key={category.id}
                            className="overflow-hidden rounded-md border border-border bg-background-surface shadow-sm"
                        >
                            <button
                                type="button"
                                onClick={() => toggleCategory(category.id)}
                                className="flex w-full flex-col gap-4 p-5 text-left transition-colors hover:bg-background-surface-raised sm:flex-row sm:items-center sm:justify-between"
                                aria-expanded={isExpanded}
                            >
                                <span className="flex min-w-0 items-center gap-4">
                                    <span className="text-text-secondary">
                                        {isExpanded ? (
                                            <ChevronDown className="h-5 w-5" aria-hidden="true" />
                                        ) : (
                                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                        )}
                                    </span>
                                    <span className="min-w-0">
                                        <span className="flex flex-wrap items-center gap-3">
                                            <span className="text-lg font-bold text-text-primary">{category.name}</span>
                                            <span className="rounded-full border border-border bg-background px-2 py-0.5 text-xs font-medium text-text-secondary">
                                                {categoryTotals.completed}/{categoryTotals.total} completed
                                            </span>
                                        </span>
                                        <span className="mt-0.5 block text-xs text-text-secondary">
                                            {category.targetRole}
                                        </span>
                                    </span>
                                </span>

                                <span className="flex w-full items-center gap-4 sm:w-48">
                                    <span className="h-2 w-full overflow-hidden rounded-full border border-border bg-background">
                                        <span
                                            className="block h-full bg-accent transition-all duration-300"
                                            style={{ width: `${categoryTotals.progress}%` }}
                                        />
                                    </span>
                                    <span className="w-10 text-right font-mono text-xs font-semibold text-text-primary">
                                        {categoryTotals.progress}%
                                    </span>
                                </span>
                            </button>

                            {isExpanded && (
                                <div className="grid gap-4 border-t border-border bg-background/50 p-5 sm:grid-cols-2">
                                    {category.topics.map((topic) => (
                                        <div
                                            key={topic.id}
                                            className="flex flex-col gap-3 rounded-md border border-border bg-background-surface p-4"
                                        >
                                            <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                                                <Zap className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                                                {topic.title}
                                            </h2>
                                            <div className="flex flex-col gap-2">
                                                {topic.subtopics.map((subtopic, index) => {
                                                    const dependencyMet = index === 0 || topic.subtopics[index - 1]?.completed
                                                    return (
                                                        <button
                                                            key={subtopic.id}
                                                            type="button"
                                                            disabled={!dependencyMet}
                                                            onClick={() => toggleSubtopic(category.id, topic.id, subtopic.id)}
                                                            className={cn(
                                                                'flex items-center gap-3 rounded-md border p-2 text-left text-xs transition-all',
                                                                subtopic.completed
                                                                    ? 'border-status-success/30 bg-status-success/5 text-text-primary'
                                                                    : dependencyMet
                                                                      ? 'border-border bg-background text-text-secondary hover:border-accent/40 hover:text-text-primary'
                                                                      : 'cursor-not-allowed border-border bg-background/40 text-text-disabled'
                                                            )}
                                                        >
                                                            {subtopic.completed ? (
                                                                <CheckCircle2 className="h-4 w-4 shrink-0 text-status-success" aria-hidden="true" />
                                                            ) : dependencyMet ? (
                                                                <Circle className="h-4 w-4 shrink-0 text-text-secondary" aria-hidden="true" />
                                                            ) : (
                                                                <Lock className="h-4 w-4 shrink-0 text-text-disabled" aria-hidden="true" />
                                                            )}
                                                            <span className={cn('min-w-0 font-medium', subtopic.completed && 'text-text-secondary line-through')}>
                                                                {subtopic.title}
                                                            </span>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </article>
                    )
                })}
            </section>
        </div>
    )
}
