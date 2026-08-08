'use client'

import * as React from 'react'
import { Bookmark, Download, FileText, Folder, Pin, Plus, Search, Trash2, Upload } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { notifyCareerDataChanged } from '@/hooks/useCareerMetrics'
import { STORAGE_KEYS, type NoteSummary } from '@/lib/careerData'
import { Button } from '@/shared/ui/Button'
import { cn } from '@/lib/cn'

const TEMPLATES = {
    Blank: '',
    Interview: '## Problem\n\n## Approach\n\n## Complexity\n\n```ts\n// code block\n```',
    Revision: '## Topic\n\n## Key points\n\n## Weak spots\n\n## Next revision date\n',
}

function createId() {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `note-${Date.now()}`
}

function today() {
    return new Date().toISOString().slice(0, 10)
}

export default function NotesPage() {
    const [notes, setNotes] = React.useState<NoteSummary[]>([])
    const [activeNoteId, setActiveNoteId] = React.useState('')
    const [query, setQuery] = React.useState('')
    const [folder, setFolder] = React.useState('All')
    const [template, setTemplate] = React.useState<keyof typeof TEMPLATES>('Blank')

    React.useEffect(() => {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEYS.notes)
            const loaded = raw ? (JSON.parse(raw) as NoteSummary[]) : []
            setNotes(loaded)
            setActiveNoteId(loaded[0]?.id ?? '')
        } catch {
            setNotes([])
        }
    }, [])

    React.useEffect(() => {
        window.localStorage.setItem(STORAGE_KEYS.notes, JSON.stringify(notes))
        notifyCareerDataChanged()
    }, [notes])

    const activeNote = notes.find((note) => note.id === activeNoteId)
    const folders = ['All', ...Array.from(new Set(notes.map((note) => note.folder || 'General')))]
    const visibleNotes = notes
        .filter((note) => folder === 'All' || (note.folder || 'General') === folder)
        .filter((note) => `${note.title} ${note.body} ${(note.tags ?? []).join(' ')}`.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)))

    const addNote = () => {
        const note: NoteSummary = {
            id: createId(),
            title: template === 'Blank' ? 'Untitled note' : `${template} note`,
            body: TEMPLATES[template],
            updatedAt: today(),
            tags: [],
            folder: 'General',
            pinned: false,
            bookmarked: false,
        }
        setNotes((current) => [note, ...current])
        setActiveNoteId(note.id)
    }

    const updateActiveNote = (updates: Partial<NoteSummary>) => {
        if (!activeNote) return
        setNotes((current) =>
            current.map((note) => (note.id === activeNote.id ? { ...note, ...updates, updatedAt: today() } : note))
        )
    }

    const exportNotes = () => {
        const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'careeros-notes.json'
        link.click()
        URL.revokeObjectURL(url)
    }

    const importNotes = (file: File | undefined) => {
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            try {
                setNotes(JSON.parse(String(reader.result)) as NoteSummary[])
            } catch {
                // Keep existing notes if the selected file is invalid.
            }
        }
        reader.readAsText(file)
    }

    return (
        <div className="flex flex-col gap-8 pb-12">
            <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-1 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                        <FileText className="h-3 w-3" /> Markdown Notes
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">Notes</h1>
                </div>
                <div className="flex flex-wrap gap-2">
                    <select value={template} onChange={(event) => setTemplate(event.target.value as keyof typeof TEMPLATES)} className="rounded-md border border-border bg-background px-3 py-2 text-sm">{Object.keys(TEMPLATES).map((item) => <option key={item}>{item}</option>)}</select>
                    <Button onClick={addNote} className="gap-2"><Plus className="h-4 w-4" />New</Button>
                    <Button onClick={exportNotes} variant="outline" className="gap-2"><Download className="h-4 w-4" />Export</Button>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-text-primary hover:bg-background-surface-raised">
                        <Upload className="h-4 w-4" />Import
                        <input type="file" accept="application/json" className="hidden" onChange={(event) => importNotes(event.target.files?.[0])} />
                    </label>
                </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
                <aside className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 rounded-md border border-border bg-background-surface px-3 py-2">
                        <Search className="h-4 w-4 text-text-secondary" />
                        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notes" className="w-full bg-transparent text-sm outline-none" />
                    </div>
                    <select value={folder} onChange={(event) => setFolder(event.target.value)} className="rounded-md border border-border bg-background-surface px-3 py-2 text-sm">{folders.map((item) => <option key={item}>{item}</option>)}</select>
                    <div className="grid gap-2">
                        {visibleNotes.map((note) => (
                            <button key={note.id} type="button" onClick={() => setActiveNoteId(note.id)} className={cn('rounded-md border p-3 text-left transition-colors', note.id === activeNote?.id ? 'border-accent/40 bg-background-surface-raised' : 'border-border bg-background-surface hover:bg-background-surface-raised')}>
                                <span className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                                    {note.pinned && <Pin className="h-3 w-3 text-accent" />}
                                    {note.bookmarked && <Bookmark className="h-3 w-3 text-status-warning" />}
                                    <span className="truncate">{note.title || 'Untitled note'}</span>
                                </span>
                                <span className="mt-1 flex items-center gap-1 text-xs text-text-secondary"><Folder className="h-3 w-3" />{note.folder || 'General'}</span>
                            </button>
                        ))}
                    </div>
                </aside>

                <section className="min-h-[560px] rounded-md border border-border bg-background-surface p-5">
                    {activeNote ? (
                        <div className="grid h-full gap-4 xl:grid-cols-2">
                            <div className="flex flex-col gap-3">
                                <input value={activeNote.title} onChange={(event) => updateActiveNote({ title: event.target.value })} className="rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-accent/50" />
                                <div className="grid gap-2 sm:grid-cols-2">
                                    <input value={activeNote.folder || ''} onChange={(event) => updateActiveNote({ folder: event.target.value })} placeholder="Folder" className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none" />
                                    <input value={(activeNote.tags ?? []).join(', ')} onChange={(event) => updateActiveNote({ tags: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) })} placeholder="Tags" className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none" />
                                </div>
                                <textarea value={activeNote.body} onChange={(event) => updateActiveNote({ body: event.target.value })} placeholder="Markdown, rich text notes, code blocks, image/file links..." className="min-h-[360px] flex-1 resize-y rounded-md border border-border bg-background px-4 py-3 font-mono text-sm leading-6 outline-none focus:ring-2 focus:ring-accent/50" />
                                <div className="flex flex-wrap gap-2">
                                    <Button variant="outline" onClick={() => updateActiveNote({ pinned: !activeNote.pinned })}>Pin</Button>
                                    <Button variant="outline" onClick={() => updateActiveNote({ bookmarked: !activeNote.bookmarked })}>Bookmark</Button>
                                    <Button variant="outline" disabled>AI summary later</Button>
                                    <button type="button" onClick={() => { setNotes((current) => current.filter((note) => note.id !== activeNote.id)); setActiveNoteId('') }} className="rounded-md border border-border px-3 py-2 text-sm text-status-danger"><Trash2 className="h-4 w-4" /></button>
                                </div>
                            </div>
                            <div className="overflow-auto rounded-md border border-border bg-background p-4 text-sm leading-6 text-text-primary">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeNote.body}</ReactMarkdown>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full min-h-[320px] items-center justify-center text-sm text-text-secondary">Create or import a note to start.</div>
                    )}
                </section>
            </div>
        </div>
    )
}
