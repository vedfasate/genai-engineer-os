'use client'

import * as React from 'react'
import { ClipboardCheck, Save } from 'lucide-react'
import { notifyCareerDataChanged } from '@/hooks/useCareerMetrics'
import { useCareerMetrics } from '@/hooks/useCareerMetrics'
import { STORAGE_KEYS, type DailyReview } from '@/lib/careerData'
import { Button } from '@/shared/ui/Button'

function today() {
    return new Date().toISOString().slice(0, 10)
}

function createId() {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `review-${Date.now()}`
}

export default function DailyReviewPage() {
    const metrics = useCareerMetrics()
    const [reviews, setReviews] = React.useState<DailyReview[]>([])
    const [form, setForm] = React.useState<Omit<DailyReview, 'id'>>({
        date: today(),
        achievements: '',
        missedTasks: '',
        tomorrowPriorities: '',
        reflection: '',
        studyHours: 0,
        mood: 'Good',
        careerScoreChange: 0,
    })

    React.useEffect(() => {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEYS.reviews)
            setReviews(raw ? (JSON.parse(raw) as DailyReview[]) : [])
        } catch {
            setReviews([])
        }
    }, [])

    React.useEffect(() => {
        window.localStorage.setItem(STORAGE_KEYS.reviews, JSON.stringify(reviews))
        notifyCareerDataChanged()
    }, [reviews])

    React.useEffect(() => {
        const todayKey = today()
        const completedToday = metrics.tasks
            .filter((task) => task.completedAt?.slice(0, 10) === todayKey)
            .map((task) => task.title)
            .join('\n')
        const missedTasks = metrics.tasks
            .filter((task) => !task.completed && !task.archived && task.dueDate < todayKey)
            .map((task) => task.title)
            .join('\n')
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const tomorrowKey = tomorrow.toISOString().slice(0, 10)
        const tomorrowPriorities = metrics.tasks
            .filter((task) => !task.completed && !task.archived && task.dueDate === tomorrowKey)
            .map((task) => task.title)
            .join('\n')

        setForm((current) => ({
            ...current,
            achievements: current.achievements || completedToday,
            missedTasks: current.missedTasks || missedTasks,
            tomorrowPriorities: current.tomorrowPriorities || tomorrowPriorities,
            careerScoreChange: current.careerScoreChange || metrics.careerScore,
        }))
    }, [metrics.tasks, metrics.careerScore])

    const saveReview = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setReviews((current) => [{ id: createId(), ...form }, ...current.filter((review) => review.date !== form.date)])
    }

    return (
        <div className="flex flex-col gap-8 pb-12">
            <div className="border-b border-border pb-6">
                <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                    <ClipboardCheck className="h-3 w-3" /> Daily Closure
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Daily Review</h1>
            </div>

            <form onSubmit={saveReview} className="grid gap-4 rounded-md border border-border bg-background-surface p-5 lg:grid-cols-2">
                <input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
                <select value={form.mood} onChange={(event) => setForm({ ...form, mood: event.target.value as DailyReview['mood'] })} className="rounded-md border border-border bg-background px-3 py-2 text-sm">
                    {['Low', 'Okay', 'Good', 'Great'].map((mood) => <option key={mood}>{mood}</option>)}
                </select>
                <textarea value={form.achievements} onChange={(event) => setForm({ ...form, achievements: event.target.value })} placeholder="Today's achievements" className="min-h-28 rounded-md border border-border bg-background px-3 py-2 text-sm" />
                <textarea value={form.missedTasks} onChange={(event) => setForm({ ...form, missedTasks: event.target.value })} placeholder="Missed tasks" className="min-h-28 rounded-md border border-border bg-background px-3 py-2 text-sm" />
                <textarea value={form.tomorrowPriorities} onChange={(event) => setForm({ ...form, tomorrowPriorities: event.target.value })} placeholder="Tomorrow's priorities" className="min-h-28 rounded-md border border-border bg-background px-3 py-2 text-sm" />
                <textarea value={form.reflection} onChange={(event) => setForm({ ...form, reflection: event.target.value })} placeholder="Reflection" className="min-h-28 rounded-md border border-border bg-background px-3 py-2 text-sm" />
                <input type="number" min={0} step={0.5} value={form.studyHours} onChange={(event) => setForm({ ...form, studyHours: Number(event.target.value) })} placeholder="Study hours" className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
                <input type="number" value={form.careerScoreChange} onChange={(event) => setForm({ ...form, careerScoreChange: Number(event.target.value) })} placeholder="Career score change" className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
                <Button type="submit" className="gap-2 lg:col-span-2"><Save className="h-4 w-4" />Save Review</Button>
            </form>

            <section className="rounded-md border border-border bg-background-surface p-5">
                <h2 className="mb-4 text-base font-semibold text-text-primary">Review History</h2>
                <div className="grid gap-3">
                    {reviews.map((review) => (
                        <article key={review.id} className="rounded-md border border-border bg-background p-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="font-semibold text-text-primary">{review.date}</span>
                                <span className="text-text-secondary">{review.studyHours}h - {review.mood} - {review.careerScoreChange >= 0 ? '+' : ''}{review.careerScoreChange}</span>
                            </div>
                            <p className="mt-2 text-sm text-text-secondary">{review.achievements || 'No achievements recorded.'}</p>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    )
}
