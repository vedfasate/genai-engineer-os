import Link from 'next/link'
import { CheckCircle, Clock, MessageSquare, Plus, Sparkles, Terminal } from 'lucide-react'
import { QuickLaunchCard, RecentActivityCard, StatCard } from '@/components/dashboard/DashboardWidgets'
import { Button } from '@/shared/ui/Button'

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-8 pb-12">
            <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-1 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                            <Sparkles className="h-3 w-3" aria-hidden="true" />
                            Workspace Active
                        </span>
                        <span className="text-xs text-text-secondary">GenAI OS v1.0</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
                        Engineering Command Center
                    </h1>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Link href="/chat">
                        <Button variant="outline" className="w-full gap-2 sm:w-auto">
                            <MessageSquare className="h-4 w-4" aria-hidden="true" />
                            Open AI Chat
                        </Button>
                    </Link>
                    <Button className="w-full gap-2 bg-accent text-white hover:bg-accent-hover sm:w-auto">
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        New Project
                    </Button>
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Active Projects"
                    value="4"
                    trend="+1 this week"
                    icon={<Terminal className="h-4 w-4" aria-hidden="true" />}
                    delay={0.05}
                />
                <StatCard
                    title="Tasks Completed"
                    value="28"
                    trend="+12%"
                    icon={<CheckCircle className="h-4 w-4" aria-hidden="true" />}
                    delay={0.1}
                />
                <StatCard
                    title="Interview Readiness"
                    value="85%"
                    trend="+5%"
                    icon={<Sparkles className="h-4 w-4" aria-hidden="true" />}
                    delay={0.15}
                />
                <StatCard
                    title="Learning Streak"
                    value="12 Days"
                    trend="Active"
                    icon={<Clock className="h-4 w-4" aria-hidden="true" />}
                    delay={0.2}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="flex flex-col gap-6 lg:col-span-2">
                    <RecentActivityCard />
                </div>

                <QuickLaunchCard />
            </div>
        </div>
    )
}
