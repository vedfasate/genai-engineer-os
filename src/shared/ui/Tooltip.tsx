// src/shared/ui/Tooltip.tsx

/**
 * @maturity Experimental
 * @purpose Provides a contextual text popup when hovering or focusing an element.
 *
 * @cdr Ref Handling:
 * Tooltip intentionally does not manipulate child refs. If future positioning
 * requires DOM measurement, adopt a ref-merging utility rather than replacing
 * the child's ref.
 */
'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { AnimatePresence, motion } from 'framer-motion';

export interface TooltipProps {
    /** The text or elements to display inside the tooltip */
    content: React.ReactNode;
    /** The trigger element */
    children: React.ReactElement<
        React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>
    >;
    /** Preferred position of the tooltip relative to the trigger */
    position?: 'top' | 'bottom' | 'left' | 'right';
    /** Delay in milliseconds before showing the tooltip */
    delay?: number;
    /** Additional class names for the tooltip container */
    className?: string;
}

function composeHandlers<E>(
    ours?: (event: E) => void,
    theirs?: (event: E) => void
): (event: E) => void {
    return (event: E) => {
        ours?.(event);
        theirs?.(event);
    };
}

export const Tooltip = ({
    content,
    children,
    position = 'top',
    delay = 200,
    className,
}: TooltipProps) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const tooltipId = React.useId();

    const handleMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsVisible(false);
    };

    const handleFocus = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    };

    const handleBlur = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsVisible(false);
    };

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const positionClasses: Record<NonNullable<TooltipProps['position']>, string> = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
    };

    const describedBy = [
        children.props['aria-describedby'],
        isVisible ? tooltipId : undefined,
    ]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
        <div className="relative inline-flex w-fit">
            {React.cloneElement(children, {
                'aria-describedby': describedBy,
                onMouseEnter: composeHandlers<React.MouseEvent<HTMLElement>>(
                    handleMouseEnter,
                    children.props.onMouseEnter
                ),
                onMouseLeave: composeHandlers<React.MouseEvent<HTMLElement>>(
                    handleMouseLeave,
                    children.props.onMouseLeave
                ),
                onFocus: composeHandlers<React.FocusEvent<HTMLElement>>(
                    handleFocus,
                    children.props.onFocus
                ),
                onBlur: composeHandlers<React.FocusEvent<HTMLElement>>(
                    handleBlur,
                    children.props.onBlur
                ),
            })}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        id={tooltipId}
                        role="tooltip"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={variants}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className={cn(
                            'absolute z-50 px-3 py-1.5 text-xs font-medium',
                            'bg-background-surface border border-border shadow-md rounded-md',
                            'text-text-primary whitespace-nowrap pointer-events-none',
                            positionClasses[position],
                            className
                        )}
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
