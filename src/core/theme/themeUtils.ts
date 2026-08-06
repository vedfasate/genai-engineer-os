import type { ThemeMode, ResolvedTheme } from '@/types/theme.types'

export function getSystemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') return 'dark'
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function resolveTheme(mode: ThemeMode): ResolvedTheme {
    return mode === 'system' ? getSystemTheme() : mode
}

export function applyThemeAttribute(theme: ResolvedTheme): void {
    if (typeof document === 'undefined') return
    document.documentElement.setAttribute('data-theme', theme)
}

export function getSystemReducedMotion(): boolean {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Inline bootstrap script injected in <head>. Runs before React
 * hydrates, reads the stored mode synchronously, and sets `data-theme`
 * on <html> immediately — this is what prevents a flash of the wrong
 * theme on load.
 */
export function getThemeBootstrapScript(storageKey: string, defaultMode: ThemeMode): string {
    return `(function(){try{var k="${storageKey}";var d="${defaultMode}";var stored=localStorage.getItem(k);var mode=(stored==="dark"||stored==="light"||stored==="system")?stored:d;var resolved=mode;if(mode==="system"){resolved=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}document.documentElement.setAttribute("data-theme",resolved);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`
}
