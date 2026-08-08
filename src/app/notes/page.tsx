'use client'

import * as React from 'react'
import { FileText, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/lib/cn'

interface Note {
    id: string
    title: string
    body: string
    updatedAt: string
}

const STORAGE_KEY = 'careeros.notes.v1'

const INITIAL_NOTES: Note[] = [
    {
        id: 'n1',
        title: 'Python Interview Patterns',
        body: 'Track decorators, generators, OOP examples, and common edge cases here.',
        updatedAt: 'Today',
    },
]

function createNoteId() {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return crypto.randomUUID()
    }

    return `note-${Date.now()}`
}

function loadNotes() {
    if (typeof window === 'undefined') {
        return INITIAL_NOTES
    }

    try {
        const saved = window.localStorage.getItem(STORAGE_KEY)
        return saved ? (JSON.parse(saved) as Note[]) : INITIAL_NOTES
    } catch {
        return INITIAL_NOTES
    }
}

export default function NotesPage() {
    const [notes, setNotes] = React.useState<Note[]>(INITIAL_NOTES)
    const [hasHydrated, setHasHydrated] = React.useState(false)
    const [activeNoteId, setActiveNoteId] = React.useState(INITIAL_NOTES[0]?.id ?? '')

    React.useEffect(() => {
        const loadedNotes = loadNotes()
        setNotes(loadedNotes)
        setActiveNoteId(loadedNotes[0]?.id ?? '')
        setHasHydrated(true)
    }, [])

    React.useEffect(() => {
        if (hasHydrated) {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
        }
    }, [hasHydrated, notes])

    const activeNote = notes.find((note) => note.id === activeNoteId) ?? notes[0]

    const addNote = () => {
        const note: Note = {
            id: createNoteId(),
            title: 'Untitled note',
            body: '',
            updatedAt: 'Today',
        }

        setNotes((currentNotes) => [note, ...currentNotes])
        setActiveNoteId(note.id)
    }

    const updateActiveNote = (updates: Partial<Pick<Note, 'title' | 'body'>>) => {
        if (!activeNote) {
            return
        }

        setNotes((currentNotes) =>
            currentNotes.map((note) =>
                note.id === activeNote.id ? { ...note, ...updates, updatedAt: 'Today' } : note
            )
        )
    }

    const deleteNote = (id: string) => {
        setNotes((currentNotes) => {
            const nextNotes = currentNotes.filter((note) => note.id !== id)
            setActiveNoteId(nextNotes[0]?.id ?? '')
            return nextNotes
        })
    }

    return (
        <div className="flex flex-col gap-8 pb-12">
            <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                            <FileText className="h-3 w-3" aria-hidden="true" />
                            Study Notes
                        </span>
                        <span className="text-xs text-text-secondary">Markdown-ready local notes</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Notes</h1>
                </div>

                <Button onClick={addNote} className="w-full gap-2 sm:w-auto">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    New Note
                </Button>
            </div>

            <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
                <aside className="flex flex-col gap-2">
                    {notes.length === 0 ? (
                        <div className="rounded-md border border-border bg-background-surface p-4 text-sm text-text-secondary">
                            No notes yet.
                        </div>
                    ) : (
                        notes.map((note) => (
                            <button
                                key={note.id}
                                type="button"
                                onClick={() => setActiveNoteId(note.id)}
                                className={cn(
                                    'rounded-md border p-3 text-left transition-colors',
                                    note.id === activeNote?.id
                                        ? 'border-accent/40 bg-background-surface-raised'
                                        : 'border-border bg-background-surface hover:bg-background-surface-raised'
                                )}
                            >
                                <span className="block truncate text-sm font-semibold text-text-primary">
                                    {note.title || 'Untitled note'}
                                </span>
                                <span className="mt-1 block text-xs text-text-secondary">{note.updatedAt}</span>
                            </button>
                        ))
                    )}
                </aside>

                <section className="min-h-[420px] rounded-md border border-border bg-background-surface p-5">
                    {activeNote ? (
                        <div className="flex h-full flex-col gap-4">
                            <div className="flex gap-3">
                                <input
                                    value={activeNote.title}
                                    onChange={(event) => updateActiveNote({ title: event.target.value })}
                                    className="min-h-10 flex-1 rounded-md border border-border bg-background px-4 py-2 text-base font-semibold text-text-primary outline-none focus:ring-2 focus:ring-accent/50"
                                />
                                <button
                                    type="button"
                                    onClick={() => deleteNote(activeNote.id)}
                                    className="rounded-md border border-border p-2 text-text-secondary transition-colors hover:border-status-danger/40 hover:text-status-danger"
                                    aria-label={`Delete ${activeNote.title}`}
                                >
                                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                                </button>
                            </div>
                            <textarea
                                value={activeNote.body}
                                onChange={(event) => updateActiveNote({ body: event.target.value })}
                                placeholder="Write notes, interview patterns, formulas, or revision points..."
                                className="min-h-[320px] flex-1 resize-y rounded-md border border-border bg-background px-4 py-3 text-sm leading-6 text-text-primary outline-none placeholder:text-text-secondary focus:ring-2 focus:ring-accent/50"
                            />
                        </div>
                    ) : (
                        <div className="flex h-full min-h-[320px] items-center justify-center text-sm text-text-secondary">
                            Create a note to start writing.
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
