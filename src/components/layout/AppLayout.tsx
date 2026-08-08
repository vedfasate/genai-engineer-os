'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { CommandPalette } from '../navigation/CommandPalette'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function AppLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false)
    const [isPaletteOpen, setPaletteOpen] = useState(false)

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault()
                setPaletteOpen((current) => !current)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background text-text-primary">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <Navbar
                    onMenuClick={() => setSidebarOpen(true)}
                    onSearchClick={() => setPaletteOpen(true)}
                />

                <main className="flex-1 overflow-y-auto bg-background p-5 sm:p-6 lg:p-8 xl:p-9">
                    <div className="mx-auto flex h-full max-w-layout flex-col gap-8">{children}</div>
                </main>
            </div>

            <CommandPalette isOpen={isPaletteOpen} onClose={() => setPaletteOpen(false)} />
        </div>
    )
}
