'use client'

import * as React from 'react'
import { Check, Copy } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface MarkdownRendererProps {
    content: string
}

interface CodeBlockProps {
    className?: string
    children?: React.ReactNode
    isBlock?: boolean
}

function CodeBlock({ className, children, isBlock = false }: CodeBlockProps) {
    const [copied, setCopied] = React.useState(false)
    const resetTimerRef = React.useRef<number | null>(null)
    const match = /language-([\w-]+)/.exec(className ?? '')
    const language = match?.[1] ?? 'text'
    const code = String(children).replace(/\n$/, '')

    const handleCopy = React.useCallback(async () => {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        if (resetTimerRef.current) {
            window.clearTimeout(resetTimerRef.current)
        }
        resetTimerRef.current = window.setTimeout(() => setCopied(false), 1800)
    }, [code])

    React.useEffect(() => {
        return () => {
            if (resetTimerRef.current) {
                window.clearTimeout(resetTimerRef.current)
            }
        }
    }, [])

    if (!isBlock && !match) {
        return (
            <code className="rounded-md bg-background-surface-hover px-1.5 py-0.5 font-mono text-sm text-accent">
                {children}
            </code>
        )
    }

    return (
        <div className="my-4 overflow-hidden rounded-lg border border-border bg-background shadow-inner">
            <div className="flex items-center justify-between border-b border-border bg-background-surface-hover px-4 py-2">
                <span className="font-mono text-xs uppercase text-text-secondary">{language}</span>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 text-xs text-text-secondary transition-colors hover:text-accent"
                >
                    {copied ? (
                        <Check className="h-3.5 w-3.5 text-status-success" aria-hidden="true" />
                    ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            <SyntaxHighlighter
                style={dracula}
                language={language}
                PreTag="div"
                customStyle={{ margin: 0, background: 'transparent' }}
                codeTagProps={{
                    style: {
                        fontFamily:
                            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    },
                }}
            >
                {code}
            </SyntaxHighlighter>
        </div>
    )
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                code({ className, children }) {
                    const isBlock = Boolean(className) || String(children).includes('\n')

                    return (
                        <CodeBlock className={className} isBlock={isBlock}>
                            {children}
                        </CodeBlock>
                    )
                },
                p({ children }) {
                    return <p className="mb-4 leading-relaxed last:mb-0">{children}</p>
                },
                ul({ children }) {
                    return <ul className="mb-4 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
                },
                ol({ children }) {
                    return <ol className="mb-4 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
                },
                li({ children }) {
                    return <li className="pl-1">{children}</li>
                },
                blockquote({ children }) {
                    return (
                        <blockquote className="my-4 border-l-4 border-accent pl-4 italic text-text-secondary">
                            {children}
                        </blockquote>
                    )
                },
                a({ href, children }) {
                    return (
                        <a
                            href={href}
                            className="text-accent underline underline-offset-4 transition-colors hover:text-accent-hover"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {children}
                        </a>
                    )
                },
                table({ children }) {
                    return (
                        <div className="my-4 overflow-x-auto rounded-lg border border-border">
                            <table className="w-full border-collapse text-left text-sm">{children}</table>
                        </div>
                    )
                },
                th({ children }) {
                    return (
                        <th className="border-b border-border bg-background-surface-hover px-3 py-2 font-medium text-text-primary">
                            {children}
                        </th>
                    )
                },
                td({ children }) {
                    return <td className="border-t border-border px-3 py-2 text-text-secondary">{children}</td>
                },
            }}
        >
            {content}
        </ReactMarkdown>
    )
}
