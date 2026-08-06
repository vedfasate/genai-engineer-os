// src/shared/ui/Tabs.tsx

/**
 * @component Tabs
 * @maturity Experimental
 *
 * Component Decision Record
 * --------------------------
 * Decision: Compound component (`Tabs`, `TabList`, `Tab`, `TabPanel`)
 * rather than a single declarative `items` array like Select/Radio
 * use. Tab panels commonly hold arbitrary, deeply nested feature
 * content — forcing that through a generic `items[].content: ReactNode`
 * prop loses the ability to colocate a tab's JSX naturally in the caller's
 * own component tree. Compound composition is the better fit here;
 * Select/Radio's declarative shape was the better fit there because their
 * "content" (an option label) is always a primitive.
 *
 * Decision: `Tabs` is controlled (`value`/`onChange` required, no
 * internal uncontrolled fallback) — same reasoning as RadioGroup:
 * calling code almost always already has a natural place to hold
 * this (URL query param, form state, parent component state), and
 * silently maintaining a second source of truth invites drift.
 *
 * Decision: `TabList` implements roving tabindex + arrow-key
 * navigation per the WAI-ARIA Tabs pattern: only the active tab is
 * in the natural Tab order (`tabIndex=0`), all others are
 * `tabIndex=-1` and reachable via ArrowLeft/ArrowRight (or
 * ArrowUp/ArrowDown when `orientation="vertical"`), Home, and End.
 * Activation follows selection automatically (arrow keys both move
 * focus and select) — the simpler and more common of the two ARIA
 * Tabs variants; a manual-activation mode (Enter/Space to confirm)
 * is not built since there's no current consumer requiring it.
 *
 * Decision: Context (`TabsContext`) is local to this file, not
 * extracted to a shared context utility — there is exactly one
 * compound component using it.
 *
 * Decision: Color classes use the fully-qualified tokens that
 * resolve against tailwind.config.ts, per the correction started in
 * Select.tsx.
 */

import { createContext, useContext, useId, useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TabsOrientation = "horizontal" | "vertical";

interface TabsContextValue {
    value: string;
    onChange: (value: string) => void;
    orientation: TabsOrientation;
    idPrefix: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(componentName: string): TabsContextValue {
    const ctx = useContext(TabsContext);
    if (!ctx) {
        throw new Error(`<${componentName} /> must be rendered inside <Tabs>.`);
    }
    return ctx;
}

export interface TabsProps {
    value: string;
    onChange: (value: string) => void;
    orientation?: TabsOrientation;
    children: ReactNode;
    className?: string;
}

export function Tabs({ value, onChange, orientation = "horizontal", children, className }: TabsProps) {
    const idPrefix = useId();

    return (
        <TabsContext.Provider value={{ value, onChange, orientation, idPrefix }}>
            <div className={cn(orientation === "vertical" && "flex gap-4", className)}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

Tabs.displayName = "Tabs";

export interface TabListProps {
    children: ReactNode;
    "aria-label"?: string;
    className?: string;
}

export function TabList({ children, "aria-label": ariaLabel, className }: TabListProps) {
    const { orientation } = useTabsContext("TabList");
    const listRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const list = listRef.current;
        if (!list) return;

        const tabs = Array.from(
            list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])')
        );
        if (tabs.length === 0) return;

        const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);

        const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
        const prevKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";

        let nextIndex: number | null = null;
        if (event.key === nextKey) {
            nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % tabs.length;
        } else if (event.key === prevKey) {
            nextIndex = currentIndex < 0 ? tabs.length - 1 : (currentIndex - 1 + tabs.length) % tabs.length;
        } else if (event.key === "Home") {
            nextIndex = 0;
        } else if (event.key === "End") {
            nextIndex = tabs.length - 1;
        }

        if (nextIndex !== null) {
            event.preventDefault();
            tabs[nextIndex].focus();
            tabs[nextIndex].click();
        }
    };

    return (
        <div
            ref={listRef}
            role="tablist"
            aria-label={ariaLabel}
            aria-orientation={orientation}
            onKeyDown={handleKeyDown}
            className={cn(
                "flex gap-1 border-b border-border",
                orientation === "vertical" && "flex-col border-b-0 border-r pr-2",
                className
            )}
        >
            {children}
        </div>
    );
}

TabList.displayName = "TabList";

export interface TabProps {
    value: string;
    children: ReactNode;
    disabled?: boolean;
    className?: string;
}

export function Tab({ value, children, disabled = false, className }: TabProps) {
    const { value: activeValue, onChange, idPrefix } = useTabsContext("Tab");
    const isActive = activeValue === value;
    const tabId = `${idPrefix}-tab-${value}`;
    const panelId = `${idPrefix}-panel-${value}`;

    return (
        <button
            type="button"
            role="tab"
            id={tabId}
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            disabled={disabled}
            onClick={() => !disabled && onChange(value)}
            className={cn(
                "relative px-3 py-2 text-sm font-medium whitespace-nowrap",
                "transition-colors duration-fast ease-standard",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-base",
                "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
                isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary",
                className
            )}
        >
            {children}
            {isActive && (
                <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-accent"
                />
            )}
        </button>
    );
}

Tab.displayName = "Tab";

export interface TabPanelProps {
    value: string;
    children: ReactNode;
    className?: string;
}

export function TabPanel({ value, children, className }: TabPanelProps) {
    const { value: activeValue, idPrefix } = useTabsContext("TabPanel");
    const isActive = activeValue === value;
    const tabId = `${idPrefix}-tab-${value}`;
    const panelId = `${idPrefix}-panel-${value}`;

    if (!isActive) return null;

    return (
        <div
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId}
            tabIndex={0}
            className={cn(
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-base",
                className
            )}
        >
            {children}
        </div>
    );
}

TabPanel.displayName = "TabPanel";
