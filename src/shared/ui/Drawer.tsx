// src/shared/ui/Drawer.tsx

/**
 * @maturity Experimental
 * @purpose A slide-out panel overlaid on the primary content, blocking interaction with the page behind it.
 *
 * @cdr Focus Management & Scroll Locking:
 * Mirrors the architecture of Modal.tsx. Relies on native document flow and Escape-key
 * listeners. Built with createPortal to prevent z-index stacking context issues.
 */
'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface DrawerProps {
    /** Controls the visibility of the drawer */
    isOpen: boolean;
    /** Callback fired when the drawer should close */
    onClose: () => void;
    /** The edge of the screen the drawer slides in from */
    side?: 'left' | 'right' | 'top' | 'bottom';
    /** Optional title rendered in the header */
    title?: React.ReactNode;
    /** Optional description rendered below the title */
    description?: React.ReactNode;
    /** The main content of the drawer */
    children: React.ReactNode;
    /** Optional footer content, typically used for action buttons */
    footer?: React.ReactNode;
    /** Optional class names to apply to the drawer panel */
    className?: string;
    /** If true, hides the default 'X' close button in the header */
    hideCloseButton?: boolean;
}

const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const getPanelVariants = (side: NonNullable<DrawerProps['side']>): Variants => {
    return {
        hidden: {
            opacity: 0,
            x: side === 'right' ? '100%' : side === 'left' ? '-100%' : 0,
            y: side === 'bottom' ? '100%' : side === 'top' ? '-100%' : 0,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
        },
    };
};

export const Drawer = ({
    isOpen,
    onClose,
    side = 'right',
    title,
    description,
    children,
    footer,
    className,
    hideCloseButton = false,
}: DrawerProps) => {
    const [mounted, setMounted] = React.useState(false);
    const panelRef = React.useRef<HTMLDivElement>(null);
    const previousFocusRef = React.useRef<HTMLElement | null>(null);
    const titleId = React.useId();
    const descriptionId = React.useId();

    const panelVariants = React.useMemo(() => getPanelVariants(side), [side]);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement | null;

            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            const frame = requestAnimationFrame(() => {
                panelRef.current?.focus();
            });

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
            };

            window.addEventListener('keydown', handleKeyDown);

            return () => {
                document.body.style.overflow = originalOverflow;
                window.removeEventListener('keydown', handleKeyDown);
                cancelAnimationFrame(frame);

                if (previousFocusRef.current?.isConnected) {
                    previousFocusRef.current.focus();
                }
            };
        }
    }, [isOpen, onClose]);

    if (!mounted) return null;

    const sideClasses: Record<NonNullable<DrawerProps['side']>, string> = {
        right: 'inset-y-0 right-0 h-full w-full max-w-md border-l border-border',
        left: 'inset-y-0 left-0 h-full w-full max-w-md border-r border-border',
        top: 'inset-x-0 top-0 w-full max-h-[90vh] border-b border-border',
        bottom: 'inset-x-0 bottom-0 w-full max-h-[90vh] min-h-[20vh] border-t border-border mt-auto',
    };

    const drawerOverlay = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={backdropVariants}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    <motion.div
                        ref={panelRef}
                        tabIndex={-1}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? titleId : undefined}
                        aria-describedby={description ? descriptionId : undefined}
                        onClick={(e) => e.stopPropagation()}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={panelVariants}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className={cn(
                            'absolute flex flex-col bg-background-surface shadow-2xl outline-none',
                            sideClasses[side],
                            className
                        )}
                    >
                        {(title || description || !hideCloseButton) && (
                            <div className="flex flex-col gap-1.5 p-6 pb-4">
                                <div className="flex items-start justify-between gap-4">
                                    {title && (
                                        <h2 id={titleId} className="text-lg font-semibold leading-none tracking-tight text-text-primary">
                                            {title}
                                        </h2>
                                    )}
                                    {!hideCloseButton && (
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="ml-auto rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-2"
                                            aria-label="Close drawer"
                                        >
                                            <X className="h-4 w-4 text-text-primary" />
                                        </button>
                                    )}
                                </div>
                                {description && (
                                    <p id={descriptionId} className="text-sm text-text-secondary">
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="p-6 pt-0 flex-1 overflow-y-auto">
                            {children}
                        </div>

                        {footer && (
                            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 bg-background-surface/50 p-6 pt-4 border-t border-border">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return createPortal(drawerOverlay, document.body);
};
