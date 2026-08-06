/**
 * src/core/constants/storageKeys.ts
 * Central registry of all client-storage keys used across the app.
 * Add a new key here whenever a feature needs to persist a user
 * preference — never inline a raw string literal at the call site.
 */

export const STORAGE_KEYS = {
    themeMode: 'genai-os-theme-mode',
    density: 'genai-os-density', // reserved — density.ts exists, no persistence wired yet
    sidebarCollapsed: 'genai-os-sidebar-collapsed', // reserved — sidebar not built yet
    locale: 'genai-os-locale', // reserved — i18n not in scope yet
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
