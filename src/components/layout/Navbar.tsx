'use client'

import { Menu, Monitor, Moon, Search, Sun } from 'lucide-react'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { Dropdown } from '@/shared/ui/Dropdown'
import { useTheme } from '@/core/theme/useTheme'

interface NavbarProps {
    onMenuClick: () => void
    onSearchClick: () => void
}

export function Navbar({ onMenuClick, onSearchClick }: NavbarProps) {
    const { mode, setMode } = useTheme()

    return (
        <header className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-white/10 bg-background/75 px-4 shadow-sm backdrop-blur-xl lg:px-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenuClick}>
                    <Menu className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Open navigation</span>
                </Button>
            </div>

            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={onSearchClick}
                    className="group hidden h-11 w-72 items-center justify-between rounded-lg border border-border bg-background-surface/90 px-4 text-text-secondary shadow-inner transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:bg-background-surface-raised md:w-80 lg:w-[28rem] sm:flex"
                >
                    <span className="flex items-center gap-2.5 text-sm">
                        <Search
                            className="h-4 w-4 text-text-secondary transition-colors group-hover:text-accent"
                            aria-hidden="true"
                        />
                        <span>Search commands, files, or ask AI...</span>
                    </span>
                    <kbd className="rounded border border-border bg-background-surface-hover px-2 py-0.5 font-mono text-xs text-text-secondary">
                        Ctrl K
                    </kbd>
                </button>

                <Button variant="ghost" size="sm" className="sm:hidden" onClick={onSearchClick}>
                    <Search className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">Search workspace</span>
                </Button>

                <Dropdown
                    align="right"
                    items={[
                        { id: 'light', label: 'Light', icon: <Sun className="h-4 w-4" />, onClick: () => setMode('light') },
                        { id: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" />, onClick: () => setMode('dark') },
                        { id: 'system', label: 'System', icon: <Monitor className="h-4 w-4" />, onClick: () => setMode('system') },
                    ]}
                >
                    <Button variant="ghost" size="sm">
                        {mode === 'light' ? (
                            <Sun className="h-4 w-4" aria-hidden="true" />
                        ) : mode === 'dark' ? (
                            <Moon className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <Monitor className="h-4 w-4" aria-hidden="true" />
                        )}
                        <span className="sr-only">Change theme</span>
                    </Button>
                </Dropdown>

                <Dropdown
                    align="right"
                    items={[
                        { id: 'profile', label: 'Profile' },
                        { id: 'settings', label: 'Settings' },
                        { id: 'logout', label: 'Log out', danger: true },
                    ]}
                >
                    <button
                        type="button"
                        className="rounded-full outline-none focus:ring-2 focus:ring-text-primary/20 focus:ring-offset-2 focus:ring-offset-background-base"
                    >
                        <Avatar fallback="VF" size="sm" />
                        <span className="sr-only">Open user menu</span>
                    </button>
                </Dropdown>
            </div>
        </header>
    )
}
