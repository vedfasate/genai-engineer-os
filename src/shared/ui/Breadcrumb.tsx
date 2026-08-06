// src/shared/ui/Breadcrumb.tsx

/**
 * @maturity Experimental
 * @purpose Indicates the current page's location within a navigational hierarchy.
 */

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface BreadcrumbItem {
    id: string;
    label: React.ReactNode;
    href?: string;
    isActive?: boolean;
}

export interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export const Breadcrumb = ({ items, className }: BreadcrumbProps) => {
    return (
        <nav aria-label="Breadcrumb" className={className}>
            <ol className="flex items-center space-x-2 text-sm text-text-secondary">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const isLink = item.href && !item.isActive;

                    return (
                        <li key={item.id} className="flex items-center space-x-2">
                            {isLink ? (
                                <a
                                    href={item.href}
                                    className={cn('transition-colors hover:text-text-primary')}
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <span
                                    aria-current={item.isActive ? 'page' : undefined}
                                    className={cn(
                                        'transition-colors',
                                        item.isActive && 'text-text-primary font-medium pointer-events-none'
                                    )}
                                >
                                    {item.label}
                                </span>
                            )}
                            {!isLast && <ChevronRight className="h-4 w-4 opacity-50" aria-hidden="true" />}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
