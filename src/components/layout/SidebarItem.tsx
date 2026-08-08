'use client'

import Link from 'next/link'
import { cn } from '@/lib/cn'
import type { NavigationItem } from '../../../registry/navigation'

interface SidebarItemProps {
    item: NavigationItem
    isActive: boolean
    onClick?: () => void
}

export function SidebarItem({ item, isActive, onClick }: SidebarItemProps) {
    const Icon = item.icon

    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                    ? 'bg-background-surface-raised text-text-primary'
                    : 'text-text-secondary hover:bg-background-surface-raised hover:text-text-primary'
            )}
        >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{item.label}</span>
        </Link>
    )
}
