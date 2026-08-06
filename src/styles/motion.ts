/**
 * src/styles/motion.ts
 * Semantic motion presets built from durations.ts + easing.ts.
 * Components should reach for a named preset here (e.g. `motion.modalEnter`)
 * rather than assembling their own duration/easing pair.
 */

import { duration } from "./durations";
import { easing } from "./easing";

export const transition = {
    fast: { duration: duration.fast, ease: easing.standard },
    medium: { duration: duration.medium, ease: easing.standard },
    slow: { duration: duration.slow, ease: easing.standard },
    emphasized: { duration: duration.medium, ease: easing.emphasized },
} as const;

/** Framer Motion spring configs for physically-driven interactions. */
export const spring = {
    snappy: { type: "spring", stiffness: 500, damping: 35, mass: 0.9 } as const,
    gentle: { type: "spring", stiffness: 260, damping: 30, mass: 1 } as const,
    bouncy: { type: "spring", stiffness: 400, damping: 18, mass: 1 } as const,
} as const;

/** Named interaction presets — the vocabulary components should use directly. */
export const semantic = {
    buttonPress: { scale: 0.97, transition: spring.snappy } as const,
    modalEnter: { opacity: [0, 1] as const, y: [12, 0] as const, transition: transition.emphasized } as const,
    modalExit: { opacity: 0, y: 8, transition: transition.fast } as const,
    toastEnter: { opacity: [0, 1] as const, x: [24, 0] as const, transition: spring.gentle } as const,
    pageTransition: { opacity: [0, 1] as const, transition: transition.medium } as const,
    dropdownEnter: { opacity: [0, 1] as const, scale: [0.96, 1] as const, transition: transition.fast } as const,
    skeletonPulse: {
        opacity: [0.4, 0.8, 0.4] as const,
        transition: { duration: 1.6, repeat: Infinity, ease: easing.standard },
    } as const,
} as const;

export const motion = { transition, spring, semantic } as const;
export type Motion = typeof motion;
export default motion;
