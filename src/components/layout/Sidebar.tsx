'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Command, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/shared/ui/Button'
import { FOOTER_NAVIGATION, MAIN_NAVIGATION } from '../../../registry/navigation'
import { SidebarItem } from './SidebarItem'

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname()

    return (
        <>
            {isOpen && (
                <button
                    type="button"
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
                    onClick={onClose}
                    aria-label="Close navigation"
                />
            )}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-background-surface transition-transform duration-300 ease-in-out lg:static lg:translate-x-0',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
                    <Link href="/dashboard" className="flex items-center gap-2 text-text-primary">
                        <Command className="h-5 w-5" aria-hidden="true" />
                        <span className="flex flex-col leading-tight">
                            <span className="font-semibold">GenAI OS</span>
                            <span className="text-[11px] font-medium text-text-secondary">Engineer Workspace</span>
                        </span>
                    </Link>
                    <Button variant="ghost" size="sm" className="lg:hidden" onClick={onClose}>
                        <X className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">Close navigation</span>
                    </Button>
                </div>

                <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3" aria-label="Main navigation">
                    {MAIN_NAVIGATION.map((item) => (
                        <SidebarItem
                            key={item.id}
                            item={item}
                            isActive={pathname === item.href || pathname?.startsWith(`${item.href}/`) || false}
                            onClick={onClose}
                        />
                    ))}
                </nav>

                <div className="border-t border-border p-3">
                    {FOOTER_NAVIGATION.map((item) => (
                        <SidebarItem
                            key={item.id}
                            item={item}
                            isActive={pathname === item.href || pathname?.startsWith(`${item.href}/`) || false}
                            onClick={onClose}
                        />
                    ))}
                </div>
            </aside>
        </>
    )
}
