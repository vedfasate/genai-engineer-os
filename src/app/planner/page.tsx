'use client'

import * as React from 'react'
import { Archive, Calendar, CheckCircle2, Circle, Clock, Plus, Search, Trash2 } from 'lucide-react'
import { notifyCareerDataChanged } from '@/hooks/useCareerMetrics'
import {
    loadPlannerTasks,
    savePlannerTasks,
    type PlannerCategory,
    type PlannerPriority,
    type PlannerTask,
} from '@/lib/careerData'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/lib/cn'

const CATEGORIES: PlannerCategory[] = ['Python', 'DSA', 'SQL', 'BIA Class', 'System Design', 'General']
const PRIORITIES: PlannerPriority[] = ['High', 'Medium', 'Low']

const INITIAL_TASKS: PlannerTask[] = [
    {
        id: 't1',
        title: 'Complete Python OOP and decorators practice',
        description: 'Write examples for classes, decorators, generators, and interview explanations.',
        category: 'Python',
        priority: 'High',
        completed: false,
        dueDate: new Date().toISOString().slice(0, 10),
        estimatedMinutes: 60,
        actualMinutes: 0,
        subtasks: [],
        recurring: 'None',
    },
]

function createId(prefix = 'task') {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${prefix}-${Date.now()}`
}

function isWithinPlannerView(dueDate: string, view: 'Daily' | 'Weekly' | 'Monthly') {
    const today = new Date()
    const due = new Date(`${dueDate}T00:00:00`)
    const start = new Date(today)
    start.setHours(0, 0, 0, 0)
    const end = new Date(start)
    end.setDate(start.getDate() + (view === 'Daily' ? 1 : view === 'Weekly' ? 7 : 30))

    return due >= start && due < end
}

export default function PlannerPage() {
    const [tasks, setTasks] = React.useState<PlannerTask[]>(INITIAL_TASKS)
    const [hasHydrated, setHasHydrated] = React.useState(false)
    const [query, setQuery] = React.useState('')
    const [filter, setFilter] = React.useState<'All' | 'Pending' | 'Completed' | 'Archived'>('All')
    const [sort, setSort] = React.useState<'Due date' | 'Priority' | 'Category'>('Due date')
    const [view, setView] = React.useState<'Daily' | 'Weekly' | 'Monthly'>('Daily')
    const [form, setForm] = React.useState({
        title: '',
        description: '',
        category: 'Python' as PlannerCategory,
        priority: 'Medium' as PlannerPriority,
        dueDate: new Date().toISOString().slice(0, 10),
        estimatedMinutes: 45,
        actualMinutes: 0,
        subtask: '',
        recurring: 'None' as PlannerTask['recurring'],
    })

    React.useEffect(() => {
        const loaded = loadPlannerTasks()
        setTasks(loaded.length > 0 ? loaded : INITIAL_TASKS)
        setHasHydrated(true)
    }, [])

    React.useEffect(() => {
        if (hasHydrated) {
            savePlannerTasks(tasks)
            notifyCareerDataChanged()
        }
    }, [hasHydrated, tasks])

    const addTask = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const title = form.title.trim()
        if (!title) return

        setTasks((current) => [
            {
                id: createId(),
                title,
                description: form.description.trim(),
                category: form.category,
                priority: form.priority,
                completed: false,
                dueDate: form.dueDate,
                estimatedMinutes: Number(form.estimatedMinutes) || 0,
                actualMinutes: Number(form.actualMinutes) || 0,
                subtasks: form.subtask.trim()
                    ? [{ id: createId('subtask'), title: form.subtask.trim(), completed: false }]
                    : [],
                recurring: form.recurring,
            },
            ...current,
        ])
        setForm((current) => ({ ...current, title: '', description: '', subtask: '' }))
    }

    const updateTask = (id: string, updates: Partial<PlannerTask>) => {
        setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...updates } : task)))
    }

    const toggleTask = (task: PlannerTask) => {
        updateTask(task.id, {
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : undefined,
        })
    }

    const toggleSubtask = (task: PlannerTask, subtaskId: string) => {
        updateTask(task.id, {
            subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
            ),
        })
    }

    const bulkComplete = () => {
        setTasks((current) =>
            current.map((task) =>
                task.completed || task.archived ? task : { ...task, completed: true, completedAt: new Date().toISOString() }
            )
        )
    }

    const visibleTasks = tasks
        .filter((task) => {
            if (filter === 'Pending' && (task.completed || task.archived)) return false
            if (filter === 'Completed' && !task.completed) return false
            if (filter === 'Archived' && !task.archived) return false
            if (filter === 'All' && task.archived) return false
            if (!task.archived && !isWithinPlannerView(task.dueDate, view)) return false
            const text = `${task.title} ${task.description} ${task.category}`.toLowerCase()
            return text.includes(query.toLowerCase())
        })
        .sort((a, b) => {
            if (sort === 'Priority') return PRIORITIES.indexOf(a.priority) - PRIORITIES.indexOf(b.priority)
            if (sort === 'Category') return a.category.localeCompare(b.category)
            return a.dueDate.localeCompare(b.dueDate)
        })

    const completedCount = tasks.filter((task) => task.completed && !task.archived).length
    const activeCount = tasks.filter((task) => !task.archived).length
    const progress = activeCount > 0 ? Math.round((completedCount / activeCount) * 100) : 0
    const completedHistory = tasks.filter((task) => task.completed).slice(0, 5)

    return (
        <div className="flex flex-col gap-8 pb-12">
            <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                            {view} Planner
                        </span>
                        <span className="text-xs text-text-secondary">{progress}% execution progress</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Planner</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                    {(['Daily', 'Weekly', 'Monthly'] as const).map((item) => (
                        <button
                            key={item}
                            type="button"
                            onClick={() => setView(item)}
                            className={cn('rounded-md border px-3 py-2 text-sm', view === item ? 'border-accent bg-accent/10 text-accent' : 'border-border text-text-secondary')}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={addTask} className="grid gap-3 rounded-md border border-border bg-background-surface p-5 lg:grid-cols-4">
                <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Task title" className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50 lg:col-span-2" />
                <select value={form.priority} onChange={(event) => setForm({ ...form, priority: event.target.value as PlannerPriority })} className="rounded-md border border-border bg-background px-3 py-2 text-sm">{PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}</select>
                <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as PlannerCategory })} className="rounded-md border border-border bg-background px-3 py-2 text-sm">{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select>
                <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Description or success criteria" className="min-h-20 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50 lg:col-span-2" />
                <input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
                <select value={form.recurring} onChange={(event) => setForm({ ...form, recurring: event.target.value as PlannerTask['recurring'] })} className="rounded-md border border-border bg-background px-3 py-2 text-sm">
                    {['None', 'Daily', 'Weekly', 'Monthly'].map((item) => <option key={item}>{item}</option>)}
                </select>
                <input type="number" min={0} value={form.estimatedMinutes} onChange={(event) => setForm({ ...form, estimatedMinutes: Number(event.target.value) })} placeholder="Estimated min" className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
                <input type="number" min={0} value={form.actualMinutes} onChange={(event) => setForm({ ...form, actualMinutes: Number(event.target.value) })} placeholder="Actual min" className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
                <input value={form.subtask} onChange={(event) => setForm({ ...form, subtask: event.target.value })} placeholder="First subtask" className="rounded-md border border-border bg-background px-3 py-2 text-sm lg:col-span-2" />
                <Button type="submit" className="gap-2"><Plus className="h-4 w-4" />Add</Button>
            </form>

            <div className="grid gap-3 rounded-md border border-border bg-background-surface p-4 lg:grid-cols-[1fr_auto_auto_auto]">
                <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
                    <Search className="h-4 w-4 text-text-secondary" />
                    <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks" className="w-full bg-transparent text-sm outline-none" />
                </div>
                <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} className="rounded-md border border-border bg-background px-3 py-2 text-sm">{['All', 'Pending', 'Completed', 'Archived'].map((item) => <option key={item}>{item}</option>)}</select>
                <select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className="rounded-md border border-border bg-background px-3 py-2 text-sm">{['Due date', 'Priority', 'Category'].map((item) => <option key={item}>{item}</option>)}</select>
                <Button type="button" variant="outline" onClick={bulkComplete}>Complete visible</Button>
            </div>

            <div className="grid gap-3">
                {visibleTasks.map((task) => {
                    const subtaskProgress = task.subtasks.length > 0 ? Math.round((task.subtasks.filter((subtask) => subtask.completed).length / task.subtasks.length) * 100) : 0
                    return (
                        <article key={task.id} className="rounded-md border border-border bg-background-surface p-4">
                            <div className="flex items-start justify-between gap-4">
                                <button type="button" onClick={() => toggleTask(task)} className="mt-0.5 text-text-secondary hover:text-accent">
                                    {task.completed ? <CheckCircle2 className="h-5 w-5 text-status-success" /> : <Circle className="h-5 w-5" />}
                                </button>
                                <div className="min-w-0 flex-1">
                                    <h2 className={cn('truncate text-sm font-semibold text-text-primary', task.completed && 'text-text-secondary line-through')}>{task.title}</h2>
                                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-secondary">{task.description || 'No description added.'}</p>
                                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-text-secondary">
                                        <span className="rounded border border-border bg-background px-2 py-0.5">{task.priority}</span>
                                        <span className="rounded border border-border bg-background px-2 py-0.5">{task.category}</span>
                                        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{task.dueDate}</span>
                                        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{task.actualMinutes}/{task.estimatedMinutes} min</span>
                                        {task.subtasks.length > 0 && <span>{subtaskProgress}% subtasks</span>}
                                        {task.recurring !== 'None' && <span>{task.recurring}</span>}
                                    </div>
                                    {task.subtasks.length > 0 && (
                                        <div className="mt-3 grid gap-2">
                                            {task.subtasks.map((subtask) => (
                                                <button
                                                    key={subtask.id}
                                                    type="button"
                                                    onClick={() => toggleSubtask(task, subtask.id)}
                                                    className="flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1 text-left text-xs text-text-secondary hover:text-text-primary"
                                                >
                                                    {subtask.completed ? (
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-status-success" />
                                                    ) : (
                                                        <Circle className="h-3.5 w-3.5" />
                                                    )}
                                                    <span className={cn(subtask.completed && 'line-through')}>{subtask.title}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <button type="button" onClick={() => updateTask(task.id, { archived: true })} className="rounded-md p-2 text-text-secondary hover:text-accent" aria-label="Archive task"><Archive className="h-4 w-4" /></button>
                                    <button type="button" onClick={() => setTasks((current) => current.filter((item) => item.id !== task.id))} className="rounded-md p-2 text-text-secondary hover:text-status-danger" aria-label="Delete task"><Trash2 className="h-4 w-4" /></button>
                                </div>
                            </div>
                        </article>
                    )
                })}
            </div>

            <section className="rounded-md border border-border bg-background-surface p-5">
                <h2 className="mb-3 text-base font-semibold text-text-primary">Completed History</h2>
                <div className="grid gap-2">
                    {completedHistory.length === 0 ? <p className="text-sm text-text-secondary">No completed tasks yet.</p> : completedHistory.map((task) => (
                        <div key={task.id} className="rounded-md border border-border bg-background px-3 py-2 text-sm text-text-secondary">{task.title}</div>
                    ))}
                </div>
            </section>
        </div>
    )
}
