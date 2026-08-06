/**
 * src/styles/durations.ts
 * Animation duration scale, in seconds (matches Framer Motion's unit).
 */

export const scale = {
    instant: 0.1,
    fast: 0.15,
    medium: 0.25,
    slow: 0.4,
    slower: 0.6,
} as const;

export const duration = {
    instant: scale.instant,
    fast: scale.fast,
    medium: scale.medium,
    slow: scale.slow,
    slower: scale.slower,
} as const;

export type Duration = typeof duration;
export default duration;
