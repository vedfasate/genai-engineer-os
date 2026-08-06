// src/shared/ui/Alert.tsx

/**
 * @maturity Experimental
 * @purpose Displays a brief, important message in a way that attracts the user's attention without interrupting their task.
 */

import * as React from 'react';
import { Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface AlertProps {
    variant?: 'info' | 'success' | 'warning' | 'danger';
    title?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

type AlertVariant = NonNullable<AlertProps['variant']>;

const variantConfig: Record<AlertVariant, { icon: React.ElementType; classes: string; iconClass: string }> = {
    info: {
        icon: Info,
        classes: 'bg-status-info/10 border-status-info/20 text-status-info',
        iconClass: 'text-status-info',
    },
    success: {
        icon: CheckCircle,
        classes: 'bg-status-success/10 border-status-success/20 text-status-success',
        iconClass: 'text-status-success',
    },
    warning: {
        icon: AlertTriangle,
        classes: 'bg-status-warning/10 border-status-warning/20 text-status-warning',
        iconClass: 'text-status-warning',
    },
    danger: {
        icon: XCircle,
        classes: 'bg-status-danger/10 border-status-danger/20 text-status-danger',
        iconClass: 'text-status-danger',
    },
};

export const Alert = ({ variant = 'info', title, children, className }: AlertProps) => {
    const config = variantConfig[variant];
    const Icon = config.icon;

    return (
        <div
            role="alert"
            className={cn(
                'relative flex w-full items-start gap-3 rounded-lg border p-4 text-sm',
                config.classes,
                className
            )}
        >
            <Icon className={cn('h-5 w-5 shrink-0', config.iconClass)} aria-hidden="true" />
            <div className="flex flex-col gap-1">
                {title && <h5 className="font-semibold leading-none tracking-tight">{title}</h5>}
                <div className="text-text-primary opacity-90">{children}</div>
            </div>
        </div>
    );
};
