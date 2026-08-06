// src/shared/ui/EmptyState.tsx

/**
 * @maturity Experimental
 * @purpose Rendered when a list or container has no data to display.
 */
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface EmptyStateProps {
    /** The icon to display above the title */
    icon?: React.ReactNode;
    /** The primary heading */
    title: React.ReactNode;
    /** The secondary descriptive text */
    description?: React.ReactNode;
    /** An optional action button (e.g., 'Create New') */
    action?: React.ReactNode;
    className?: string;
}

export const EmptyState = ({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={cn(
                'flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center',
                'bg-background-surface/30',
                className
            )}
        >
            {icon && (
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background-surface border border-border text-text-secondary">
                    {icon}
                </div>
            )}
            <h3 className="mb-1 text-lg font-semibold text-text-primary">{title}</h3>
            {description && <p className="mb-4 text-sm text-text-secondary max-w-sm">{description}</p>}
            {action && <div>{action}</div>}
        </motion.div>
    );
};
