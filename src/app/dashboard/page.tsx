'use client'

import Link from 'next/link'
import {
    BarChart3,
    BookOpen,
    CalendarDays,
    CheckCircle,
    Clock,
    FileText,
    ListTodo,
    MessageSquare,
    Plus,
    Sparkles,
    Target,
} from 'lucide-react'
import { DashboardCard, StatCard } from '@/components/dashboard/DashboardWidgets'
import { useCareerMetrics } from '@/hooks/useCareerMetrics'
import { Button } from '@/shared/ui/Button'

export default function DashboardPage() {
    const metrics = useCareerMetrics()

    const quickActions = [
        { label: 'Add task', href: '/planner', icon: Plus },
        { label: 'Review roadmap', href: '/roadmap', icon: Target },
        { label: 'Write note', href: '/notes', icon: FileText },
        { label: 'Daily review', href: '/daily-review', icon: CheckCircle },
    ]

    return (
        <div className="flex flex-col gap-8 pb-12">
            <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-1 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                            <Sparkles className="h-3 w-3" aria-hidden="true" />
                            Live Workspace
                        </span>
                        <span className="text-xs text-text-secondary">Career score {metrics.careerScore}/1000</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
                        Engineering Command Center
                    </h1>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link href="/chat">
                        <Button variant="outline" className="w-full gap-2 sm:w-auto">
                            <MessageSquare className="h-4 w-4" aria-hidden="true" />
                            Open Chat
                        </Button>
                    </Link>
                    <Link href="/planner">
                        <Button className="w-full gap-2 bg-accent text-white hover:bg-accent-hover sm:w-auto">
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            Add Task
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Career Score" value={metrics.careerScore} trend="/1000" icon={<Target className="h-4 w-4" />} />
                <StatCard title="Today Completed" value={metrics.completedToday} trend="today" icon={<CheckCircle className="h-4 w-4" />} />
                <StatCard title="Pending Tasks" value={metrics.pendingTasks} trend="open" icon={<ListTodo className="h-4 w-4" />} />
                <StatCard title="Roadmap" value={`${metrics.roadmapCompletion}%`} trend="complete" icon={<BookOpen className="h-4 w-4" />} />
                <StatCard title="Notes" value={metrics.notesCount} trend="saved" icon={<FileText className="h-4 w-4" />} />
                <StatCard title="Study Streak" value={`${metrics.studyStreak}d`} trend="active" icon={<Clock className="h-4 w-4" />} />
                <StatCard title="Weekly Progress" value={`${metrics.weeklyProgress}%`} trend="tasks" icon={<BarChart3 className="h-4 w-4" />} />
                <StatCard title="Monthly Progress" value={`${metrics.monthlyProgress}%`} trend="hours" icon={<CalendarDays className="h-4 w-4" />} />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
                <DashboardCard interactive={false}>
                    <h2 className="mb-4 text-base font-semibold text-text-primary">Recent Activity</h2>
                    <div className="grid gap-3">
                        {metrics.recentActivity.length === 0 ? (
                            <p className="text-sm text-text-secondary">Complete a task or update a note to start the activity feed.</p>
                        ) : (
                            metrics.recentActivity.map((activity) => (
                                <div key={activity.id} className="rounded-md border border-border bg-background px-3 py-2">
                                    <div className="text-sm font-medium text-text-primary">{activity.title}</div>
                                    <div className="text-xs text-text-secondary">{activity.detail}</div>
                                </div>
                            ))
                        )}
                    </div>
                </DashboardCard>

                <DashboardCard interactive={false}>
                    <h2 className="mb-4 text-base font-semibold text-text-primary">Quick Actions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action) => {
                            const Icon = action.icon
                            return (
                                <Link
                                    key={action.href}
                                    href={action.href}
                                    className="flex min-h-20 flex-col justify-between rounded-md border border-border bg-background p-3 text-sm font-medium text-text-primary transition-colors hover:border-accent/40 hover:bg-background-surface-raised"
                                >
                                    <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                                    {action.label}
                                </Link>
                            )
                        })}
                    </div>
                </DashboardCard>

                <DashboardCard interactive={false}>
                    <h2 className="mb-4 text-base font-semibold text-text-primary">Upcoming Deadlines</h2>
                    <div className="grid gap-3">
                        {metrics.upcomingDeadlines.length === 0 ? (
                            <p className="text-sm text-text-secondary">No exam, interview, or deadline events scheduled.</p>
                        ) : (
                            metrics.upcomingDeadlines.map((event) => (
                                <div key={event.id} className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2">
                                    <div>
                                        <div className="text-sm font-medium text-text-primary">{event.title}</div>
                                        <div className="text-xs text-text-secondary">{event.type}</div>
                                    </div>
                                    <div className="text-xs font-semibold text-accent">{event.date}</div>
                                </div>
                            ))
                        )}
                    </div>
                </DashboardCard>

                <DashboardCard interactive={false}>
                    <h2 className="mb-4 text-base font-semibold text-text-primary">Weak Areas</h2>
                    <div className="grid gap-2">
                        {metrics.weakTopics.map((topic) => (
                            <Link key={topic} href="/roadmap" className="rounded-md border border-border bg-background px-3 py-2 text-sm text-text-secondary hover:text-text-primary">
                                {topic}
                            </Link>
                        ))}
                    </div>
                </DashboardCard>
            </div>
        </div>
    )
}
