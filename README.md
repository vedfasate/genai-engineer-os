# GenAI Engineer OS

A professional, feature-first SaaS architecture for an AI engineering productivity platform.

## Architecture

- `src/app/` - Next.js App Router entrypoints
- `src/features/` - Self-contained business modules
- `src/shared/` - Reusable UI, hooks, and utilities
- `src/entities/` - Domain models
- `src/widgets/` - Large composed interfaces
- `src/services/` - Business and API logic
- `src/infrastructure/` - Database, auth, and storage adapters
- `src/lib/` - General utilities
- `src/config/` - Runtime environment helpers
- `src/hooks/` - App-specific hooks
- `src/store/` - Global state and stores
- `src/styles/` - Design tokens and styling primitives
- `src/assets/` - Static assets
- `src/types/` - Shared TypeScript definitions

## Docs

- `docs/Architecture.md`
- `docs/FolderStructure.md`
- `docs/CodingStandards.md`
- `docs/DesignSystem.md`
- `docs/Components.md`
- `docs/Roadmap.md`
- `docs/Database.md`
- `docs/DeploymentGuide.md`
- `docs/FolderConvention.md`
- `docs/NamingConvention.md`
- `docs/PerformanceGuide.md`
- `docs/SecurityGuide.md`
- `docs/AnimationGuide.md`
- `docs/GitWorkflow.md`
- `docs/Changelog.md`

## Scripts

- `npm run dev`
- `npm run dev:clean`
- `npm run clean`
- `npm run build`
- `npm run start`
- `npm run lint`

## Next.js Dev Cache Recovery

Symptoms:

- Unstyled page
- `layout.css` 404
- `vendor-chunks/*.js` ENOENT
- `entryCSSFiles`
- React Client Manifest errors
- `__webpack_modules__[moduleId] is not a function`

Recovery:

1. Stop all Node processes if a dev server is stuck.
2. Run:

   ```bash
   npm run dev:clean
   ```

3. Start exactly one dev server.
4. Hard refresh the browser with `Ctrl + Shift + R`.
5. Confirm the referenced `/_next/static/css/...` and `/_next/static/chunks/...` assets return HTTP 200 before debugging application code.
