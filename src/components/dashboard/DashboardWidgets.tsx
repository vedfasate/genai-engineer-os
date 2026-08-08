'use client'

import type { ReactNode } from 'react'
import { ArrowRight, ArrowUpRight, CheckCircle, Clock, Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/cn'
import { Button } from '@/shared/ui/Button'

interface DashboardCardProps {
    children: ReactNode
    className?: string
    delay?: number
    interactive?: boolean
}

/**
 * Shared dashboard card shell for KPI, activity, roadmap, and launch widgets.
 */
export function DashboardCard({ children, className, delay = 0, interactive = true }: DashboardCardProps) {
    const shouldReduceMotion = useReducedMotion()

    return (
        <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            whileHover={interactive && !shouldReduceMotion ? { y: -2, scale: 1.01 } : undefined}
            transition={{ duration: 0.3, delay }}
            className={cn(
                'group relative rounded-lg border border-border bg-background-surface p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_28px_rgba(0,0,0,0.18)] transition-all',
                'hover:-translate-y-0.5 hover:border-accent/40 hover:bg-background-surface-hover hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_16px_36px_rgba(0,0,0,0.24)]',
                className
            )}
        >
            {children}
        </motion.div>
    )
}

export interface StatCardProps {
    title: string
    value: string | number
    trend?: string
    icon?: ReactNode
    delay?: number
}

export function StatCard({ title, value, trend, icon, delay = 0 }: StatCardProps) {
    return (
        <DashboardCard delay={delay} className="flex min-h-36 flex-col justify-between">
            <div className="flex items-center justify-between pb-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">{title}</span>
                {icon && (
                    <div className="rounded-lg border border-border bg-background p-2 text-text-secondary transition-colors group-hover:text-accent">
                        {icon}
                    </div>
                )}
            </div>
            <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold tracking-tight text-text-primary">{value}</span>
                {trend && (
                    <span className="flex items-center rounded-full bg-status-success/10 px-2 py-0.5 text-xs font-semibold text-status-success">
                        <ArrowUpRight className="mr-0.5 h-3 w-3" aria-hidden="true" />
                        {trend}
                    </span>
                )}
            </div>
        </DashboardCard>
    )
}

export function RecentActivityCard() {
    const activities = [
        {
            title: 'Completed "System Design Primer"',
            time: '2h ago',
            icon: <CheckCircle className="h-4 w-4 text-status-success" />,
        },
        {
            title: 'Updated Resume Template',
            time: '5h ago',
            icon: <Clock className="h-4 w-4 text-text-secondary" />,
        },
    ]

    return (
        <DashboardCard className="flex flex-col" delay={0.25}>
            <h3 className="mb-4 font-semibold text-text-primary">Recent Activity</h3>
            <div className="flex flex-col gap-4">
                {activities.map((activity) => (
                    <div key={activity.title} className="flex items-center gap-3 text-sm">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                            {activity.icon}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium text-text-primary">{activity.title}</span>
                            <span className="text-xs text-text-secondary">{activity.time}</span>
                        </div>
                    </div>
                ))}
            </div>
        </DashboardCard>
    )
}

export function QuickLaunchCard() {
    const prompts = ['Generate React component', 'Review Python code', 'Plan interview prep']

    return (
        <DashboardCard className="flex min-h-64 flex-col justify-between overflow-hidden" delay={0.3}>
            <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/5 blur-2xl transition-colors group-hover:bg-accent/10" />
            <div className="relative flex flex-col gap-3">
                <div className="flex items-center gap-2 text-accent">
                    <Sparkles className="h-5 w-5" aria-hidden="true" />
                    <h3 className="font-semibold text-text-primary">Quick Copilot Prompt</h3>
                </div>
                <p className="text-sm text-text-secondary">
                    Need to debug code, architect a RAG pipeline, or optimize an algorithm? Launch directly into
                    multi-model reasoning.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                    {prompts.map((prompt) => (
                        <Link
                            key={prompt}
                            href={`/chat?prompt=${encodeURIComponent(prompt)}`}
                            className="rounded-md border border-border bg-background/70 px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors hover:border-accent/40 hover:text-text-primary"
                        >
                            {prompt}
                        </Link>
                    ))}
                </div>
            </div>
            <div className="relative pt-6">
                <Link href="/chat">
                    <Button className="w-full justify-between border border-border bg-background text-text-primary hover:bg-background-surface-hover hover:shadow-lg hover:shadow-accent/15">
                        <span>Start coding session</span>
                        <ArrowRight className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                    </Button>
                </Link>
            </div>
        </DashboardCard>
    )
}
