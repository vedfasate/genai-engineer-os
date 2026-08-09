'use client'

import * as React from 'react'
import * as XLSX from 'xlsx'
import {
    Award,
    CheckCircle2,
    Circle,
    FileSpreadsheet,
    FolderOpen,
    Plus,
    Save,
    Sparkles,
    Trash2,
} from 'lucide-react'
import { notifyCareerDataChanged, useCareerMetrics } from '@/hooks/useCareerMetrics'
import {
    createRoadmapFromTemplate,
    loadActiveRoadmapId,
    loadRoadmaps,
    saveActiveRoadmapId,
    saveRoadmaps,
} from '@/lib/careerData'
import type { RoadmapTopic, SkillCategory, SubTopic, UserRoadmap } from '@/types/roadmap'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/lib/cn'

function createId(prefix: string) {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${prefix}-${Date.now()}`
}

function createBlankRoadmap(): UserRoadmap {
    const now = new Date().toISOString()
    return {
        id: createId('roadmap'),
        title: 'Untitled Roadmap',
        description: 'Custom learning plan.',
        createdAt: now,
        updatedAt: now,
        categories: [],
    }
}

function emptyModule(): SkillCategory {
    return { id: createId('module'), name: 'New Module', targetRole: 'Learning goal', topics: [] }
}

function emptyTopic(): RoadmapTopic {
    return { id: createId('topic'), title: 'New Topic', subtopics: [] }
}

function emptySubtopic(title = 'New Item'): SubTopic {
    return { id: createId('subtopic'), title, completed: false }
}

function countRoadmap(categories: SkillCategory[]) {
    const subtopics = categories.flatMap((category) => category.topics.flatMap((topic) => topic.subtopics))
    const completed = subtopics.filter((subtopic) => subtopic.completed).length
    return {
        completed,
        total: subtopics.length,
        progress: subtopics.length > 0 ? Math.round((completed / subtopics.length) * 100) : 0,
    }
}

function importJsonRoadmap(text: string): UserRoadmap {
    const parsed = JSON.parse(text) as Partial<UserRoadmap> | SkillCategory[]
    const now = new Date().toISOString()

    if (Array.isArray(parsed)) {
        return {
            ...createBlankRoadmap(),
            title: 'Imported Roadmap',
            createdAt: now,
            updatedAt: now,
            categories: parsed,
        }
    }

    return {
        ...createBlankRoadmap(),
        ...parsed,
        id: createId('roadmap'),
        title: parsed.title?.trim() || 'Imported Roadmap',
        description: parsed.description ?? 'Imported learning plan.',
        createdAt: now,
        updatedAt: now,
        categories: parsed.categories ?? [],
    }
}

async function importExcelRoadmap(file: File): Promise<UserRoadmap> {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' })
    const rows = workbook.SheetNames.flatMap((sheetName) =>
        XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], { defval: '' })
    )
    const modules = new Map<string, SkillCategory>()

    rows.forEach((row, index) => {
        const values = Object.values(row).map((value) => String(value).trim()).filter(Boolean)
        if (values.length === 0) return

        const moduleName = values[0] || `Module ${index + 1}`
        const topicTitle = values[1] || moduleName
        const subtopicTitle = values.slice(2).join(' - ') || topicTitle

        if (!modules.has(moduleName)) {
            modules.set(moduleName, {
                id: createId('module'),
                name: moduleName,
                targetRole: 'Imported curriculum',
                topics: [],
            })
        }

        const roadmapModule = modules.get(moduleName)!
        let topic = roadmapModule.topics.find((item) => item.title === topicTitle)
        if (!topic) {
            topic = { id: createId('topic'), title: topicTitle, subtopics: [] }
            roadmapModule.topics.push(topic)
        }

        if (!topic.subtopics.some((item) => item.title === subtopicTitle)) {
            topic.subtopics.push(emptySubtopic(subtopicTitle))
        }
    })

    return {
        ...createBlankRoadmap(),
        title: file.name.replace(/\.[^.]+$/, ''),
        description: 'Imported from Excel.',
        categories: Array.from(modules.values()),
    }
}

export default function RoadmapPage() {
    const metrics = useCareerMetrics()
    const [roadmaps, setRoadmaps] = React.useState<UserRoadmap[]>([])
    const [activeId, setActiveId] = React.useState<string | null>(null)
    const [hasHydrated, setHasHydrated] = React.useState(false)
    const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})
    const [importError, setImportError] = React.useState('')
    const activeRoadmap = roadmaps.find((roadmap) => roadmap.id === activeId) ?? roadmaps[0] ?? null
    const stats = countRoadmap(activeRoadmap?.categories ?? [])

    React.useEffect(() => {
        const loaded = loadRoadmaps()
        const savedActiveId = loadActiveRoadmapId()
        setRoadmaps(loaded)
        setActiveId(savedActiveId ?? loaded[0]?.id ?? null)
        setHasHydrated(true)
    }, [])

    React.useEffect(() => {
        if (!hasHydrated) return
        saveRoadmaps(roadmaps)
        saveActiveRoadmapId(activeId)
        notifyCareerDataChanged()
    }, [activeId, hasHydrated, roadmaps])

    const commitRoadmaps = (nextRoadmaps: UserRoadmap[], nextActiveId = activeId) => {
        setRoadmaps(nextRoadmaps)
        setActiveId(nextActiveId)
    }

    const addRoadmap = (roadmap: UserRoadmap) => {
        commitRoadmaps([{ ...roadmap, updatedAt: new Date().toISOString() }, ...roadmaps], roadmap.id)
    }

    const updateActiveRoadmap = (updater: (roadmap: UserRoadmap) => UserRoadmap) => {
        if (!activeRoadmap) return
        setRoadmaps((current) =>
            current.map((roadmap) =>
                roadmap.id === activeRoadmap.id ? { ...updater(roadmap), updatedAt: new Date().toISOString() } : roadmap
            )
        )
    }

    const deleteRoadmap = (id: string) => {
        const next = roadmaps.filter((roadmap) => roadmap.id !== id)
        commitRoadmaps(next, next[0]?.id ?? null)
    }

    const handleImport = async (file: File | undefined) => {
        if (!file) return
        setImportError('')
        try {
            if (file.name.endsWith('.json')) {
                addRoadmap(importJsonRoadmap(await file.text()))
                return
            }

            addRoadmap(await importExcelRoadmap(file))
        } catch {
            setImportError('Import failed. Use a valid JSON, XLS, or XLSX roadmap file.')
        }
    }

    return (
        <div className="flex flex-col gap-8 pb-12">
            <header className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                        <FolderOpen className="h-3 w-3" aria-hidden="true" />
                        Roadmap Manager
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">My Roadmaps</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" className="gap-2" onClick={() => addRoadmap(createBlankRoadmap())}>
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Blank
                    </Button>
                    <Button type="button" variant="outline" className="gap-2" onClick={() => addRoadmap(createRoadmapFromTemplate())}>
                        <Sparkles className="h-4 w-4" aria-hidden="true" />
                        Use Template
                    </Button>
                    <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-text-primary hover:bg-background-surface-raised">
                        <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
                        Import
                        <input type="file" accept=".json,.xls,.xlsx" className="hidden" onChange={(event) => handleImport(event.target.files?.[0])} />
                    </label>
                </div>
            </header>

            {importError && <div className="rounded-md border border-status-danger/30 bg-status-danger/10 px-4 py-3 text-sm text-status-danger">{importError}</div>}

            {roadmaps.length === 0 ? (
                <section className="rounded-md border border-border bg-background-surface p-8">
                    <h2 className="text-lg font-bold text-text-primary">No roadmap yet</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                        Create a blank roadmap, copy the built-in template, or import your BIA Excel file. Imported roadmaps become your editable copy.
                    </p>
                </section>
            ) : (
                <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
                    <aside className="grid content-start gap-3">
                        {roadmaps.map((roadmap) => {
                            const roadmapStats = countRoadmap(roadmap.categories)
                            const isActive = roadmap.id === activeRoadmap?.id
                            return (
                                <button
                                    key={roadmap.id}
                                    type="button"
                                    onClick={() => setActiveId(roadmap.id)}
                                    className={cn(
                                        'rounded-md border bg-background-surface p-4 text-left transition-colors hover:border-accent/40',
                                        isActive ? 'border-accent/60' : 'border-border'
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="font-semibold text-text-primary">{roadmap.title}</div>
                                            <div className="mt-1 text-xs text-text-secondary">{roadmapStats.progress}% complete</div>
                                        </div>
                                        <span className="text-xs text-text-secondary">{roadmapStats.completed}/{roadmapStats.total}</span>
                                    </div>
                                </button>
                            )
                        })}
                    </aside>

                    {activeRoadmap && (
                        <main className="flex flex-col gap-5">
                            <section className="rounded-md border border-border bg-background-surface p-5">
                                <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                                    <div className="grid gap-3">
                                        <input
                                            value={activeRoadmap.title}
                                            onChange={(event) => updateActiveRoadmap((roadmap) => ({ ...roadmap, title: event.target.value }))}
                                            className="rounded-md border border-border bg-background px-3 py-2 text-xl font-bold text-text-primary outline-none focus:ring-2 focus:ring-accent/50"
                                        />
                                        <input
                                            value={activeRoadmap.description}
                                            onChange={(event) => updateActiveRoadmap((roadmap) => ({ ...roadmap, description: event.target.value }))}
                                            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-text-secondary outline-none focus:ring-2 focus:ring-accent/50"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2 lg:justify-end">
                                        <Button type="button" variant="outline" className="gap-2" onClick={() => updateActiveRoadmap((roadmap) => ({ ...roadmap, categories: [...roadmap.categories, emptyModule()] }))}>
                                            <Plus className="h-4 w-4" aria-hidden="true" />
                                            Module
                                        </Button>
                                        <Button type="button" variant="outline" className="gap-2" onClick={() => deleteRoadmap(activeRoadmap.id)}>
                                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                                    <Metric icon={<Award className="h-4 w-4" />} label="Career Score" value={`${metrics.careerScore}/1000`} />
                                    <Metric icon={<CheckCircle2 className="h-4 w-4" />} label="Roadmap Progress" value={`${stats.progress}%`} />
                                    <Metric icon={<Save className="h-4 w-4" />} label="Items" value={`${stats.completed}/${stats.total}`} />
                                </div>
                            </section>

                            {activeRoadmap.categories.length === 0 ? (
                                <section className="rounded-md border border-border bg-background-surface p-6">
                                    <h2 className="font-semibold text-text-primary">This roadmap is blank</h2>
                                    <p className="mt-2 text-sm text-text-secondary">Add a module to start building your own structure.</p>
                                </section>
                            ) : (
                                <section className="grid gap-4">
                                    {activeRoadmap.categories.map((category) => (
                                        <RoadmapModule
                                            key={category.id}
                                            category={category}
                                            expanded={expanded[category.id] ?? true}
                                            onToggleExpanded={() => setExpanded((current) => ({ ...current, [category.id]: !(current[category.id] ?? true) }))}
                                            onChange={(nextCategory) =>
                                                updateActiveRoadmap((roadmap) => ({
                                                    ...roadmap,
                                                    categories: roadmap.categories.map((item) => (item.id === category.id ? nextCategory : item)),
                                                }))
                                            }
                                            onDelete={() =>
                                                updateActiveRoadmap((roadmap) => ({
                                                    ...roadmap,
                                                    categories: roadmap.categories.filter((item) => item.id !== category.id),
                                                }))
                                            }
                                        />
                                    ))}
                                </section>
                            )}
                        </main>
                    )}
                </div>
            )}
        </div>
    )
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-md border border-border bg-background p-4">
            <div className="mb-3 text-accent">{icon}</div>
            <div className="text-xs uppercase text-text-secondary">{label}</div>
            <div className="mt-1 text-xl font-bold text-text-primary">{value}</div>
        </div>
    )
}

function RoadmapModule({
    category,
    expanded,
    onToggleExpanded,
    onChange,
    onDelete,
}: {
    category: SkillCategory
    expanded: boolean
    onToggleExpanded: () => void
    onChange: (category: SkillCategory) => void
    onDelete: () => void
}) {
    return (
        <article className="rounded-md border border-border bg-background-surface p-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_1fr_auto_auto]">
                <input value={category.name} onChange={(event) => onChange({ ...category, name: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold text-text-primary" />
                <input value={category.targetRole} onChange={(event) => onChange({ ...category, targetRole: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2 text-sm text-text-secondary" />
                <Button type="button" variant="outline" onClick={() => onChange({ ...category, topics: [...category.topics, emptyTopic()] })}>Add Topic</Button>
                <Button type="button" variant="outline" onClick={onDelete}>Delete</Button>
            </div>
            <button type="button" onClick={onToggleExpanded} className="mt-3 text-xs font-medium text-accent">
                {expanded ? 'Hide topics' : 'Show topics'}
            </button>
            {expanded && (
                <div className="mt-4 grid gap-3">
                    {category.topics.map((topic) => (
                        <RoadmapTopicEditor
                            key={topic.id}
                            topic={topic}
                            onChange={(nextTopic) => onChange({ ...category, topics: category.topics.map((item) => (item.id === topic.id ? nextTopic : item)) })}
                            onDelete={() => onChange({ ...category, topics: category.topics.filter((item) => item.id !== topic.id) })}
                        />
                    ))}
                </div>
            )}
        </article>
    )
}

function RoadmapTopicEditor({
    topic,
    onChange,
    onDelete,
}: {
    topic: RoadmapTopic
    onChange: (topic: RoadmapTopic) => void
    onDelete: () => void
}) {
    return (
        <div className="rounded-md border border-border bg-background p-3">
            <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                <input value={topic.title} onChange={(event) => onChange({ ...topic, title: event.target.value })} className="rounded-md border border-border bg-background-surface px-3 py-2 text-sm font-medium text-text-primary" />
                <Button type="button" variant="outline" onClick={() => onChange({ ...topic, subtopics: [...topic.subtopics, emptySubtopic()] })}>Add Item</Button>
                <Button type="button" variant="outline" onClick={onDelete}>Delete</Button>
            </div>
            <div className="mt-3 grid gap-2">
                {topic.subtopics.map((subtopic) => (
                    <div key={subtopic.id} className="grid gap-2 sm:grid-cols-[auto_1fr_auto]">
                        <button
                            type="button"
                            onClick={() => onChange({ ...topic, subtopics: topic.subtopics.map((item) => (item.id === subtopic.id ? { ...item, completed: !item.completed } : item)) })}
                            className="rounded-md border border-border p-2 text-text-secondary hover:text-accent"
                            aria-label="Toggle completion"
                        >
                            {subtopic.completed ? <CheckCircle2 className="h-4 w-4 text-status-success" /> : <Circle className="h-4 w-4" />}
                        </button>
                        <input
                            value={subtopic.title}
                            onChange={(event) => onChange({ ...topic, subtopics: topic.subtopics.map((item) => (item.id === subtopic.id ? { ...item, title: event.target.value } : item)) })}
                            className={cn('rounded-md border border-border bg-background-surface px-3 py-2 text-sm text-text-primary', subtopic.completed && 'text-text-secondary line-through')}
                        />
                        <button
                            type="button"
                            onClick={() => onChange({ ...topic, subtopics: topic.subtopics.filter((item) => item.id !== subtopic.id) })}
                            className="rounded-md border border-border p-2 text-text-secondary hover:text-status-danger"
                            aria-label="Delete item"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
