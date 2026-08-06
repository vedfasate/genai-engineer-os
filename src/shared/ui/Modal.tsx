// src/shared/ui/Modal.tsx

/**
 * @maturity Experimental
 * @purpose A dialog window overlaid on the primary content, blocking interaction with the page behind it.
 *
 * @cdr Focus Management & Scroll Locking:
 * - Modal currently relies on native document flow and Escape-key listeners.
 *   If strict focus trapping is required (e.g., preventing tab-out), consider
 *   integrating a library like `react-focus-lock`.
 * - Scroll locking is currently applied to `document.body` directly. In scenarios
 *   with nested modals, closing a child modal will restore scrolling prematurely.
 *   If nested modals are introduced, adopt a reference-counted scroll-lock utility.
 */
'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface ModalProps {
    /** Controls the visibility of the modal */
    isOpen: boolean;
    /** Callback fired when the modal should close (backdrop click, Escape key, or close button) */
    onClose: () => void;
    /** Optional title rendered in the header */
    title?: React.ReactNode;
    /** Optional description rendered below the title */
    description?: React.ReactNode;
    /** The main content of the modal */
    children: React.ReactNode;
    /** Optional footer content, typically used for action buttons */
    footer?: React.ReactNode;
    /** Controls the maximum width of the modal panel */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    /** Optional class names to apply to the modal panel */
    className?: string;
    /** If true, hides the default 'X' close button in the header */
    hideCloseButton?: boolean;
}

const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const panelVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
};

export const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
    className,
    hideCloseButton = false,
}: ModalProps) => {
    const [mounted, setMounted] = React.useState(false);
    const panelRef = React.useRef<HTMLDivElement>(null);
    const previousFocusRef = React.useRef<HTMLElement | null>(null);
    const titleId = React.useId();
    const descriptionId = React.useId();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement | null;

            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';

            requestAnimationFrame(() => {
                panelRef.current?.focus();
            });

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') onClose();
            };

            window.addEventListener('keydown', handleKeyDown);

            return () => {
                document.body.style.overflow = originalStyle;
                window.removeEventListener('keydown', handleKeyDown);
                previousFocusRef.current?.focus();
            };
        }
    }, [isOpen, onClose]);

    if (!mounted) return null;

    const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[calc(100%-2rem)] h-[calc(100%-2rem)]',
    };

    const modalOverlay = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
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

                    {/* Modal Panel */}
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
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className={cn(
                            'relative flex w-full max-h-[90vh] flex-col overflow-hidden rounded-lg outline-none',
                            'bg-background-surface border border-border shadow-xl',
                            sizeClasses[size],
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
                                            className="ml-auto rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                                            aria-label="Close modal"
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

    return createPortal(modalOverlay, document.body);
};
