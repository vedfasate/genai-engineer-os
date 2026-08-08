'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Modal } from '@/shared/ui/Modal'
import { MAIN_NAVIGATION } from '../../../registry/navigation'

/**
 * @purpose Global command palette.
 *
 * @cdr MVP scope:
 * Search is intentionally limited to navigation items. Phase 4 can replace
 * this with workspace search across projects, chats, notes, prompts, and tasks.
 */
interface CommandPaletteProps {
    isOpen: boolean
    onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
    const [query, setQuery] = useState('')
    const router = useRouter()

    const filteredItems = MAIN_NAVIGATION.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
    )

    const handleSelect = (href: string) => {
        router.push(href)
        onClose()
        setQuery('')
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" hideCloseButton>
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <Search className="h-5 w-5 shrink-0 text-text-secondary" aria-hidden="true" />
                <input
                    autoFocus
                    className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
                    placeholder="Search projects, roadmaps, or type a command..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                />
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
                {filteredItems.length === 0 ? (
                    <p className="p-4 text-center text-sm text-text-secondary">No results found.</p>
                ) : (
                    filteredItems.map((item) => {
                        const Icon = item.icon

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => handleSelect(item.href)}
                                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-text-primary outline-none hover:bg-background-surface-raised focus:bg-background-surface-raised"
                            >
                                <Icon className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                                {item.label}
                            </button>
                        )
                    })
                )}
            </div>
        </Modal>
    )
}
