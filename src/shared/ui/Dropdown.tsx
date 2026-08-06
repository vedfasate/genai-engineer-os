// src/shared/ui/Dropdown.tsx

/**
 * @maturity Experimental
 * @purpose A contextual menu triggered by a user action.
 *
 * @cdr Architecture:
 * Implemented as a controlled/uncontrolled hybrid using an `items` array for strict
 * type safety and consistency. If highly custom layouts are needed inside the menu,
 * this should be refactored into a compound component (Dropdown, DropdownMenu, DropdownItem).
 */
'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface DropdownItem {
    id: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    danger?: boolean;
}

export interface DropdownProps {
    /** The element that triggers the dropdown */
    children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
    /** Array of items to render in the menu */
    items: DropdownItem[];
    /** Alignment of the dropdown menu relative to the trigger */
    align?: 'left' | 'right';
    /** Additional classes for the menu container */
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

const menuVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: -5 },
    visible: { opacity: 1, scale: 1, y: 0 },
};

export const Dropdown = ({
    children,
    items,
    align = 'left',
    className,
}: DropdownProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const previousFocusRef = React.useRef<HTMLElement | null>(null);
    const menuId = React.useId();

    const open = (focusTarget: 'first' | 'last' = 'first') => {
        previousFocusRef.current = document.activeElement as HTMLElement | null;
        setIsOpen(true);

        requestAnimationFrame(() => {
            const menuItems = Array.from(
                containerRef.current?.querySelectorAll('[role="menuitem"]:not([disabled])') || []
            ) as HTMLElement[];

            if (menuItems.length > 0) {
                const target = focusTarget === 'last' ? menuItems[menuItems.length - 1] : menuItems[0];
                target.focus();
            }
        });
    };

    const close = React.useCallback(() => {
        setIsOpen(false);
        if (previousFocusRef.current?.isConnected) {
            previousFocusRef.current.focus();
        }
    }, []);

    const toggle = () => (isOpen ? close() : open('first'));

    React.useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                close();
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, close]);

    const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!isOpen) return;

        const menuItems = Array.from(
            containerRef.current?.querySelectorAll('[role="menuitem"]:not([disabled])') || []
        ) as HTMLElement[];

        if (!menuItems.length) return;

        const currentIndex = menuItems.indexOf(document.activeElement as HTMLElement);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                menuItems[(currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0)]?.focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                menuItems[(currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1)]?.focus();
                break;
            case 'Home':
                e.preventDefault();
                menuItems[0]?.focus();
                break;
            case 'End':
                e.preventDefault();
                menuItems[menuItems.length - 1]?.focus();
                break;
            case 'Escape':
                e.preventDefault();
                close();
                break;
            case 'Tab':
                close();
                break;
        }
    };

    const alignClasses = align === 'left' ? 'left-0' : 'right-0';

    return (
        <div
            className="relative inline-block text-left"
            ref={containerRef}
            onKeyDown={handleMenuKeyDown}
        >
            {React.cloneElement(children, {
                onClick: composeHandlers<React.MouseEvent<HTMLElement>>(toggle, children.props.onClick),
                onKeyDown: composeHandlers<React.KeyboardEvent<HTMLElement>>(
                    (e) => {
                        if (!isOpen) {
                            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                                e.preventDefault();
                                open('first');
                            } else if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                open('last');
                            }
                        } else if (e.key === 'Escape') {
                            e.preventDefault();
                            close();
                        }
                    },
                    children.props.onKeyDown
                ),
                'aria-expanded': isOpen,
                'aria-haspopup': 'menu',
                'aria-controls': isOpen ? menuId : undefined,
            })}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id={menuId}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={menuVariants}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className={cn(
                            'absolute z-50 mt-2 w-56 origin-top rounded-md shadow-lg',
                            'bg-background-surface border border-border outline-none p-1',
                            alignClasses,
                            className
                        )}
                        role="menu"
                        aria-orientation="vertical"
                    >
                        {items.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                disabled={item.disabled}
                                onClick={() => {
                                    item.onClick?.();
                                    close();
                                }}
                                className={cn(
                                    'flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-left transition-colors',
                                    'focus:outline-none focus:bg-background-surface-hover hover:bg-background-surface-hover',
                                    item.disabled && 'opacity-50 cursor-not-allowed',
                                    item.danger ? 'text-status-danger hover:text-status-danger' : 'text-text-primary'
                                )}
                                role="menuitem"
                                tabIndex={-1}
                            >
                                {item.icon && <span className="h-4 w-4">{item.icon}</span>}
                                {item.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
