'use client'

import * as React from 'react'
import { CalendarDays, Clock, Plus } from 'lucide-react'
import { notifyCareerDataChanged } from '@/hooks/useCareerMetrics'
import {
    loadCalendarEvents,
    loadPlannerTasks,
    saveCalendarEvents,
    type CalendarEvent,
    type PlannerTask,
} from '@/lib/careerData'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/lib/cn'

const EVENT_TYPES: CalendarEvent['type'][] = ['Study', 'Exam', 'Interview', 'Deadline', 'Revision', 'Rest']
const RECURRENCE: CalendarEvent['recurring'][] = ['None', 'Daily', 'Weekly', 'Monthly']

function createId() {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `event-${Date.now()}`
}

function today() {
    return new Date().toISOString().slice(0, 10)
}

function expandRecurringEvents(events: CalendarEvent[], days: string[]) {
    const visibleDays = new Set(days)

    return events.flatMap((event) => {
        if (event.recurring === 'None') {
            return visibleDays.has(event.date) ? [event] : []
        }

        return days
            .filter((day) => {
                const source = new Date(`${event.date}T00:00:00`)
                const target = new Date(`${day}T00:00:00`)
                if (target < source) return false
                const diffDays = Math.round((target.getTime() - source.getTime()) / 86400000)
                if (event.recurring === 'Daily') return true
                if (event.recurring === 'Weekly') return diffDays % 7 === 0
                return source.getDate() === target.getDate()
            })
            .map((day) => ({ ...event, id: `${event.id}-${day}`, date: day }))
    })
}

function plannerTasksToDeadlineEvents(tasks: PlannerTask[]): CalendarEvent[] {
    return tasks
        .filter((task) => !task.archived && !task.completed && task.dueDate)
        .map((task) => ({
            id: `planner-deadline-${task.id}`,
            title: task.title,
            date: task.dueDate,
            startTime: '17:00',
            endTime: '17:30',
            type: 'Deadline',
            recurring: task.recurring ?? 'None',
        }))
}

export default function CalendarPage() {
    const [events, setEvents] = React.useState<CalendarEvent[]>([])
    const [plannerTasks, setPlannerTasks] = React.useState<PlannerTask[]>([])
    const [hasHydrated, setHasHydrated] = React.useState(false)
    const [view, setView] = React.useState<'Month' | 'Week' | 'Day' | 'Agenda'>('Month')
    const [form, setForm] = React.useState({
        title: '',
        date: today(),
        startTime: '09:00',
        endTime: '10:00',
        type: 'Study' as CalendarEvent['type'],
        recurring: 'None' as CalendarEvent['recurring'],
    })

    React.useEffect(() => {
        const refreshPlannerTasks = () => setPlannerTasks(loadPlannerTasks())

        setEvents(loadCalendarEvents())
        refreshPlannerTasks()
        setHasHydrated(true)
        window.addEventListener('storage', refreshPlannerTasks)
        window.addEventListener('careeros:data-changed', refreshPlannerTasks)

        return () => {
            window.removeEventListener('storage', refreshPlannerTasks)
            window.removeEventListener('careeros:data-changed', refreshPlannerTasks)
        }
    }, [])

    React.useEffect(() => {
        if (!hasHydrated) return
        saveCalendarEvents(events)
        notifyCareerDataChanged()
    }, [events, hasHydrated])

    const addEvent = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!form.title.trim()) return
        setEvents((current) => [{ id: createId(), ...form, title: form.title.trim() }, ...current])
        setForm((current) => ({ ...current, title: '' }))
    }

    const days = Array.from({ length: view === 'Month' ? 30 : view === 'Week' ? 7 : 1 }, (_, index) => {
        const date = new Date()
        date.setDate(date.getDate() + index)
        return date.toISOString().slice(0, 10)
    })
    const plannerDeadlineEvents = plannerTasksToDeadlineEvents(plannerTasks)
    const visibleEvents = expandRecurringEvents([...events, ...plannerDeadlineEvents], days).sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`))

    return (
        <div className="flex flex-col gap-8 pb-12">
            <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                        <CalendarDays className="h-3 w-3" /> Study Schedule
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Calendar</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                    {(['Month', 'Week', 'Day', 'Agenda'] as const).map((item) => (
                        <button key={item} type="button" onClick={() => setView(item)} className={cn('rounded-md border px-3 py-2 text-sm', view === item ? 'border-accent bg-accent/10 text-accent' : 'border-border text-text-secondary')}>
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={addEvent} className="grid gap-3 rounded-md border border-border bg-background-surface p-5 lg:grid-cols-[1fr_150px_110px_110px_140px_140px_auto]">
                <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Schedule study, exam, interview, deadline, revision, or rest" className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50" />
                <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
                <input type="time" value={form.startTime} onChange={(event) => setForm({ ...form, startTime: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
                <input type="time" value={form.endTime} onChange={(event) => setForm({ ...form, endTime: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
                <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value as CalendarEvent['type'] })} className="rounded-md border border-border bg-background px-3 py-2 text-sm">{EVENT_TYPES.map((type) => <option key={type}>{type}</option>)}</select>
                <select value={form.recurring} onChange={(event) => setForm({ ...form, recurring: event.target.value as CalendarEvent['recurring'] })} className="rounded-md border border-border bg-background px-3 py-2 text-sm">{RECURRENCE.map((item) => <option key={item}>{item}</option>)}</select>
                <Button type="submit" className="gap-2"><Plus className="h-4 w-4" />Add</Button>
            </form>

            {view === 'Agenda' ? (
                <div className="grid gap-3">
                    {visibleEvents.map((event) => <EventRow key={event.id} event={event} />)}
                </div>
            ) : (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {days.map((day) => (
                        <section key={day} className="min-h-40 rounded-md border border-border bg-background-surface p-4">
                            <h2 className="mb-3 text-sm font-semibold text-text-primary">{day}</h2>
                            <div className="grid gap-2">
                                {visibleEvents.filter((event) => event.date === day).map((event) => <EventRow key={event.id} event={event} />)}
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </div>
    )
}

function EventRow({ event }: { event: CalendarEvent }) {
    return (
        <div className="rounded-md border border-border bg-background px-3 py-2">
            <div className="flex items-center justify-between gap-3">
                <span className="truncate text-sm font-medium text-text-primary">{event.title}</span>
                <span className="rounded border border-border px-2 py-0.5 text-xs text-text-secondary">{event.type}</span>
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-text-secondary">
                <Clock className="h-3 w-3" /> {event.date} - {event.startTime}-{event.endTime} - {event.recurring}
            </div>
        </div>
    )
}
