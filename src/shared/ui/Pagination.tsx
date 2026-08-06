// src/shared/ui/Pagination.tsx

/**
 * @maturity Experimental
 * @purpose Allows navigation through paginated data.
 */
'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';

export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export const Pagination = ({ currentPage, totalPages, onPageChange, className }: PaginationProps) => {
    const visiblePages = React.useMemo(() => {
        const pages: (number | string)[] = [];

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }

        return pages;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    const handlePrev = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    return (
        <nav aria-label="Pagination" className={cn('flex items-center justify-center gap-1', className)}>
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={handlePrev}
                className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    'text-text-secondary hover:bg-background-surface hover:text-text-primary',
                    'disabled:opacity-50 disabled:pointer-events-none'
                )}
            >
                Previous
            </button>

            {visiblePages.map((page, index) => (
                <button
                    key={typeof page === 'number' ? page : `ellipsis-${index}`}
                    type="button"
                    disabled={page === '...'}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    aria-current={page === currentPage ? 'page' : undefined}
                    className={cn(
                        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                        page === '...' && 'cursor-default pointer-events-none text-text-secondary',
                        page === currentPage
                            ? 'bg-text-primary text-background font-semibold'
                            : 'text-text-secondary hover:bg-background-surface hover:text-text-primary'
                    )}
                >
                    {page}
                </button>
            ))}

            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={handleNext}
                className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    'text-text-secondary hover:bg-background-surface hover:text-text-primary',
                    'disabled:opacity-50 disabled:pointer-events-none'
                )}
            >
                Next
            </button>
        </nav>
    );
};
