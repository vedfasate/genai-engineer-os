// src/shared/ui/Toast.tsx

/**
 * @maturity Experimental
 * @purpose A transient notification primitive.
 *
 * @cdr Orchestration:
 * This is solely the UI primitive for a toast. Rendering multiple toasts
 * requires a higher-level ToastProvider/Orchestrator to manage queues,
 * positioning, and cleanup. (Future enhancements could include accepting
 * `duration?: number` and `onOpenChange?: (...)` at the primitive level).
 */
'use client';

import * as React from 'react';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface ToastProps {
    variant?: 'info' | 'success' | 'warning' | 'danger' | 'default';
    title: React.ReactNode;
    description?: React.ReactNode;
    onClose: () => void;
    className?: string;
}

const iconMap: Record<NonNullable<ToastProps['variant']>, React.ReactNode> = {
    default: null,
    info: <Info className="h-5 w-5 text-status-info" />,
    success: <CheckCircle className="h-5 w-5 text-status-success" />,
    warning: <AlertTriangle className="h-5 w-5 text-status-warning" />,
    danger: <XCircle className="h-5 w-5 text-status-danger" />,
};

const toastVariants: Variants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
};

export const Toast = ({
    variant = 'default',
    title,
    description,
    onClose,
    className,
}: ToastProps) => {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={toastVariants}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
                'pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-lg p-4 shadow-lg',
                'bg-background-surface border border-border',
                className
            )}
            role="status"
            aria-live="polite"
        >
            {iconMap[variant]}
            <div className="flex flex-1 flex-col gap-1">
                <h5 className="text-sm font-semibold text-text-primary leading-none tracking-tight">
                    {title}
                </h5>
                {description && <p className="text-sm text-text-secondary">{description}</p>}
            </div>
            <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2"
                aria-label="Close notification"
            >
                <X className="h-4 w-4 text-text-primary" />
            </button>
        </motion.div>
    );
};
