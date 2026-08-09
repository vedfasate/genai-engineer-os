'use client'

import { BarChart3, Flame, LineChart, Target } from 'lucide-react'
import { useCareerMetrics } from '@/hooks/useCareerMetrics'

export default function AnalyticsPage() {
    const metrics = useCareerMetrics()
    const skillRows = metrics.roadmap.map((category) => {
        const subtopics = category.topics.flatMap((topic) => topic.subtopics)
        const completed = subtopics.filter((subtopic) => subtopic.completed).length
        return { label: category.name, value: subtopics.length ? Math.round((completed / subtopics.length) * 100) : 0 }
    })
    const totalStudyHours = metrics.reviews.reduce((total, review) => total + review.studyHours, 0)
    const codingTasks = metrics.tasks.filter((task) => ['Python', 'DSA', 'SQL'].includes(task.category)).length
    const activityDays = Array.from({ length: 35 }, (_, index) => {
        const date = new Date()
        date.setDate(date.getDate() - (34 - index))
        const key = date.toISOString().slice(0, 10)
        const completedTasks = metrics.tasks.filter((task) => task.completedAt?.slice(0, 10) === key).length
        const reviewHours = metrics.reviews.find((review) => review.date === key)?.studyHours ?? 0
        const intensity = Math.min(1, completedTasks * 0.25 + reviewHours * 0.12)

        return { intensity }
    })

    return (
        <div className="flex flex-col gap-8 pb-12">
            <div className="border-b border-border pb-6">
                <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                    <LineChart className="h-3 w-3" /> Progress Intelligence
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Analytics</h1>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <Metric title="Career score" value={`${metrics.careerScore}/1000`} icon={<Target className="h-4 w-4" />} />
                <Metric title="Study hours" value={`${totalStudyHours}h`} icon={<BarChart3 className="h-4 w-4" />} />
                <Metric title="Coding tasks" value={codingTasks} icon={<LineChart className="h-4 w-4" />} />
                <Metric title="Streak" value={`${metrics.studyStreak}d`} icon={<Flame className="h-4 w-4" />} />
            </div>

            <section className="rounded-md border border-border bg-background-surface p-5">
                <h2 className="mb-4 text-base font-semibold text-text-primary">Career Score Graph</h2>
                <Bars values={[metrics.weeklyProgress, metrics.monthlyProgress, metrics.roadmapCompletion, Math.round(metrics.careerScore / 10)]} labels={['Weekly', 'Monthly', 'Roadmap', 'Score']} />
            </section>

            <section className="grid gap-5 xl:grid-cols-2">
                <Panel title="Skill Graph" rows={skillRows} />
                <Panel title="Weak Areas" rows={metrics.weakTopics.map((topic) => ({ label: topic, value: 35 }))} />
                <Panel title="Topic Completion" rows={skillRows} />
                <Panel title="Goal Tracking" rows={[{ label: 'Weekly progress', value: metrics.weeklyProgress }, { label: 'Monthly progress', value: metrics.monthlyProgress }, { label: 'Roadmap completion', value: metrics.roadmapCompletion }]} />
            </section>

            <section className="rounded-md border border-border bg-background-surface p-5">
                <h2 className="mb-4 text-base font-semibold text-text-primary">Productivity Report</h2>
                <p className="text-sm leading-6 text-text-secondary">
                    You have {metrics.pendingTasks} pending tasks, {metrics.notesCount} notes, {metrics.completedToday} tasks completed today, and a {metrics.studyStreak}-day study streak.
                </p>
                <div className="mt-5 grid grid-cols-7 gap-2">
                    {activityDays.map((day, index) => (
                        <div
                            key={index}
                            className="aspect-square rounded-sm border border-border bg-accent"
                            style={{ opacity: day.intensity > 0 ? 0.2 + day.intensity * 0.8 : 0.08 }}
                        />
                    ))}
                </div>
            </section>
        </div>
    )
}

function Metric({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
    return <div className="rounded-md border border-border bg-background-surface p-5"><div className="mb-4 text-text-secondary">{icon}</div><div className="text-xs uppercase text-text-secondary">{title}</div><div className="mt-1 text-2xl font-bold text-text-primary">{value}</div></div>
}

function Bars({ values, labels }: { values: number[]; labels: string[] }) {
    return <div className="grid gap-3">{values.map((value, index) => <div key={labels[index]}><div className="mb-1 flex justify-between text-xs text-text-secondary"><span>{labels[index]}</span><span>{value}%</span></div><div className="h-3 rounded-full border border-border bg-background"><div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} /></div></div>)}</div>
}

function Panel({ title, rows }: { title: string; rows: { label: string; value: number }[] }) {
    return <section className="rounded-md border border-border bg-background-surface p-5"><h2 className="mb-4 text-base font-semibold text-text-primary">{title}</h2><Bars values={rows.map((row) => row.value)} labels={rows.map((row) => row.label)} /></section>
}
