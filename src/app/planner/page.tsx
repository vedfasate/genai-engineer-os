'use client'

import * as React from 'react'
import { AlertCircle, Calendar, CheckCircle2, CheckSquare, Circle, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/lib/cn'

type PlannerCategory = 'Python' | 'DSA' | 'SQL' | 'BIA Class' | 'System Design' | 'General'
type PlannerPriority = 'High' | 'Medium' | 'Low'

interface PlannerTask {
    id: string
    title: string
    description: string
    category: PlannerCategory
    priority: PlannerPriority
    completed: boolean
    dueDate: string
}

const STORAGE_KEY = 'careeros.planner.v1'
const LEGACY_TASKS_STORAGE_KEY = 'careeros.tasks.v1'

const CATEGORIES: PlannerCategory[] = ['Python', 'DSA', 'SQL', 'BIA Class', 'System Design', 'General']
const PRIORITIES: PlannerPriority[] = ['High', 'Medium', 'Low']

const INITIAL_TASKS: PlannerTask[] = [
    {
        id: 't1',
        title: 'Complete Python OOP and decorators practice',
        description: 'Write small examples for classes, decorators, generators, and common interview explanations.',
        category: 'Python',
        priority: 'High',
        completed: false,
        dueDate: 'Today',
    },
    {
        id: 't2',
        title: 'Solve 3 LeetCode problems on two pointers',
        description: 'Focus on clean edge-case handling and writing the pattern summary after each problem.',
        category: 'DSA',
        priority: 'High',
        completed: true,
        dueDate: 'Today',
    },
    {
        id: 't3',
        title: 'Review SQL window functions and CTEs',
        description: 'Practice ROW_NUMBER, RANK, running totals, and one CTE-heavy analytics query.',
        category: 'SQL',
        priority: 'Medium',
        completed: false,
        dueDate: 'Tomorrow',
    },
    {
        id: 't4',
        title: 'Prepare pre-study notes before BIA classes start',
        description: 'List weak topics and convert them into planner tasks before the course rhythm begins.',
        category: 'BIA Class',
        priority: 'High',
        completed: false,
        dueDate: 'In 10 days',
    },
]

function createTaskId() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID()
    }

    return `task-${Date.now()}`
}

function normalizeTask(task: Partial<PlannerTask>): PlannerTask {
    return {
        id: task.id ?? createTaskId(),
        title: task.title ?? 'Untitled task',
        description: task.description ?? '',
        category: task.category ?? 'General',
        priority: task.priority ?? 'Medium',
        completed: task.completed ?? false,
        dueDate: task.dueDate ?? 'Today',
    }
}

function loadPlannerTasks() {
    if (typeof window === 'undefined') {
        return INITIAL_TASKS
    }

    try {
        const saved = window.localStorage.getItem(STORAGE_KEY)
        const legacySaved = window.localStorage.getItem(LEGACY_TASKS_STORAGE_KEY)
        const rawTasks = saved ?? legacySaved

        if (!rawTasks) {
            return INITIAL_TASKS
        }

        const parsedTasks = JSON.parse(rawTasks) as Partial<PlannerTask>[]
        const normalizedTasks = parsedTasks.map(normalizeTask)

        if (!saved && legacySaved) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedTasks))
        }

        return normalizedTasks
    } catch {
        return INITIAL_TASKS
    }
}

export default function PlannerPage() {
    const [tasks, setTasks] = React.useState<PlannerTask[]>(INITIAL_TASKS)
    const [hasHydrated, setHasHydrated] = React.useState(false)
    const [newTitle, setNewTitle] = React.useState('')
    const [newDescription, setNewDescription] = React.useState('')
    const [newDueDate, setNewDueDate] = React.useState('Today')
    const [newCategory, setNewCategory] = React.useState<PlannerCategory>('Python')
    const [newPriority, setNewPriority] = React.useState<PlannerPriority>('Medium')

    React.useEffect(() => {
        setTasks(loadPlannerTasks())
        setHasHydrated(true)
    }, [])

    React.useEffect(() => {
        if (hasHydrated) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
        }
    }, [hasHydrated, tasks])

    const addTask = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const title = newTitle.trim()
        if (!title) {
            return
        }

        setTasks((currentTasks) => [
            {
                id: createTaskId(),
                title,
                description: newDescription.trim(),
                category: newCategory,
                priority: newPriority,
                completed: false,
                dueDate: newDueDate.trim() || 'Today',
            },
            ...currentTasks,
        ])
        setNewTitle('')
        setNewDescription('')
        setNewDueDate('Today')
    }

    const toggleTask = (id: string) => {
        setTasks((currentTasks) =>
            currentTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
        )
    }

    const deleteTask = (id: string) => {
        setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
    }

    const completedCount = tasks.filter((task) => task.completed).length
    const totalCount = tasks.length
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    return (
        <div className="flex flex-col gap-8 pb-12">
            <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                            <CheckSquare className="h-3 w-3" aria-hidden="true" />
                            Daily Execution
                        </span>
                        <span className="text-xs text-text-secondary">Local-first study planner</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Planner</h1>
                </div>

                <div className="flex items-center gap-4 rounded-md border border-border bg-background-surface px-4 py-2.5">
                    <div className="text-right">
                        <div className="text-xs font-medium text-text-secondary">Daily progress</div>
                        <div className="text-sm font-bold text-text-primary">
                            {completedCount} / {totalCount} completed
                        </div>
                    </div>
                    <div className="h-2 w-16 overflow-hidden rounded-full border border-border bg-background">
                        <div className="h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            <form
                onSubmit={addTask}
                className="grid gap-3 rounded-md border border-border bg-background-surface p-5 shadow-sm lg:grid-cols-[1fr_160px_150px_140px_auto]"
            >
                <div className="flex flex-col gap-3 lg:col-span-1">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(event) => setNewTitle(event.target.value)}
                        placeholder="What do you need to study or build today?"
                        className="min-h-10 rounded-md border border-border bg-background px-4 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:ring-2 focus:ring-accent/50"
                    />
                    <textarea
                        value={newDescription}
                        onChange={(event) => setNewDescription(event.target.value)}
                        placeholder="Add a short description or success criteria..."
                        className="min-h-20 resize-y rounded-md border border-border bg-background px-4 py-2.5 text-sm text-text-primary outline-none placeholder:text-text-secondary focus:ring-2 focus:ring-accent/50"
                    />
                </div>
                <select
                    value={newCategory}
                    onChange={(event) => setNewCategory(event.target.value as PlannerCategory)}
                    className="min-h-10 rounded-md border border-border bg-background px-3 py-2.5 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent/50"
                >
                    {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <select
                    value={newPriority}
                    onChange={(event) => setNewPriority(event.target.value as PlannerPriority)}
                    className="min-h-10 rounded-md border border-border bg-background px-3 py-2.5 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent/50"
                >
                    {PRIORITIES.map((priority) => (
                        <option key={priority} value={priority}>
                            {priority} priority
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    value={newDueDate}
                    onChange={(event) => setNewDueDate(event.target.value)}
                    aria-label="Due date"
                    className="min-h-10 rounded-md border border-border bg-background px-3 py-2.5 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent/50"
                />
                <Button type="submit" className="shrink-0 gap-2 self-start">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add
                </Button>
            </form>

            <div className="grid gap-3">
                {tasks.length === 0 ? (
                    <div className="rounded-md border border-border bg-background-surface py-12 text-center text-sm text-text-secondary">
                        No tasks pending. Add your first study goal above.
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className={cn(
                                'group flex items-start justify-between gap-4 rounded-md border p-4 shadow-sm transition-all',
                                task.completed
                                    ? 'border-status-success/20 bg-background-surface/40 opacity-70'
                                    : 'border-border bg-background-surface hover:border-accent/40'
                            )}
                        >
                            <div className="flex min-w-0 flex-1 items-start gap-3.5">
                                <button
                                    type="button"
                                    onClick={() => toggleTask(task.id)}
                                    className="mt-0.5 shrink-0 text-text-secondary transition-colors hover:text-accent"
                                    aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
                                >
                                    {task.completed ? (
                                        <CheckCircle2 className="h-5 w-5 text-status-success" aria-hidden="true" />
                                    ) : (
                                        <Circle className="h-5 w-5" aria-hidden="true" />
                                    )}
                                </button>
                                <div className="flex min-w-0 flex-col gap-2">
                                    <div>
                                        <span
                                            className={cn(
                                                'block truncate text-sm font-medium text-text-primary',
                                                task.completed && 'text-text-secondary line-through'
                                            )}
                                        >
                                            {task.title}
                                        </span>
                                        {task.description && (
                                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-secondary">
                                                {task.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                                        <span className="rounded border border-border bg-background px-2 py-0.5">
                                            {task.category}
                                        </span>
                                        <span
                                            className={cn(
                                                'inline-flex items-center gap-1 rounded px-1.5 py-0.5',
                                                task.priority === 'High'
                                                    ? 'bg-status-danger/10 text-status-danger'
                                                    : task.priority === 'Medium'
                                                      ? 'bg-status-warning/10 text-status-warning'
                                                      : 'text-text-secondary'
                                            )}
                                        >
                                            {task.priority === 'High' && (
                                                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                                            )}
                                            {task.priority}
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Calendar className="h-3 w-3" aria-hidden="true" />
                                            {task.dueDate}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => deleteTask(task.id)}
                                className="rounded-md p-2 text-text-secondary opacity-100 transition-all hover:bg-background hover:text-status-danger sm:opacity-0 sm:group-hover:opacity-100"
                                aria-label={`Delete ${task.title}`}
                            >
                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
