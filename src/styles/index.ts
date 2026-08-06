/**
 * src/styles/index.ts
 * Public entry point for the design token system. This is the ONLY
 * import path components and tailwind.config.ts should use:
 *
 *   import { tokens } from "@/styles";
 *
 * Do not import from "@/styles/tokens" or an individual "@/styles/*.ts"
 * module directly outside of this file and tokens.ts itself.
 */

export { tokens } from "./tokens";
export type { Tokens } from "./tokens";
