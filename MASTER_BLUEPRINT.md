# MASTER BLUEPRINT

> This document is the single source of truth for GenAI Engineer OS. It is a living architecture blueprint that reflects the current repository state and guides every future decision.

## Table of Contents

1. [Project Overview](#01-project-overview)
2. [Product Overview](#02-product-overview)
3. [Architecture](#03-architecture)
4. [Folder Structure](#04-folder-structure)
5. [File Responsibilities](#05-file-responsibilities)
6. [Module Documentation](#06-module-documentation)
7. [Workflow](#07-workflow)
8. [Development Phases](#08-development-phases)
9. [Coding Standards](#09-coding-standards)
10. [Design System](#10-design-system)
11. [UI Philosophy](#11-ui-philosophy)
12. [Feature Roadmap](#12-feature-roadmap)
13. [Build Order](#13-build-order)
14. [Data Flow](#14-data-flow)
15. [Event Flow](#15-event-flow)
16. [Folder Responsibilities](#16-folder-responsibilities)
17. [State Management](#17-state-management)
18. [Database Plan](#18-database-plan)
19. [Offline Strategy](#19-offline-strategy)
20. [AI Architecture](#20-ai-architecture)
21. [Security](#21-security)
22. [Performance](#22-performance)
23. [Testing](#23-testing)
24. [Deployment](#24-deployment)
25. [Git Workflow](#25-git-workflow)
26. [Release Plan](#26-release-plan)
27. [Future Roadmap](#27-future-roadmap)
28. [Rules for Every Future File](#28-rules-for-every-future-file)
29. [Repository Health](#29-repository-health)
30. [Current Project Status](#30-current-project-status)
31. [Change History](#31-change-history)
32. [AI Context](#32-ai-context)
33. [Prompt Templates](#33-prompt-templates)

---

## 01. Project Overview

### Project Name
GenAI Engineer OS

### Tagline
A scalable AI-powered operating system for career development, learning, and project mastery.

### Vision
To become the definitive platform for AI-assisted career growth, combining productivity, learning, projects, and interview readiness in one unified experience.

### Mission
To empower ambitious engineers with a modern, modular platform that unifies skill development, project tracking, interview preparation, and AI guidance.

### Why this project exists
GenAI Engineer OS exists because engineers need a workplace that blends smart planning, skill-building, career progress, and AI assistance without forcing them to use disconnected tools.

### Problem Statement
Engineers today use disparate apps for planning, notes, learning, interviews, and career tracking. This fragmented workflow creates friction, wastes time, and makes growth hard to measure.

### Solution
A single application architecture built around feature-first modules, shared domain logic, design tokens, event-driven coordination, and eventual AI assistance.

### Goals
- Establish a production-grade architecture.
- Build a reusable design system.
- Enable extensible modules and plugins.
- Support offline-first data with IndexedDB.
- Deliver a modern developer workflow with documentation and governance.

### Success Metrics
- Architecture adoption by teams without code rewrites.
- High module reusability and low duplication.
- Transparent system behavior through events and observability.
- Stable developer onboarding via this blueprint.

### Long-term Vision
A platform that evolves into a research-grade career assistant with personalized recommendations, automated revision paths, and integrated AI mentorship.

---

## 02. Product Overview

### What is GenAI Engineer OS?
GenAI Engineer OS is a layered SaaS-style platform for modern engineers to manage learning, projects, career progress, interview preparation, and AI-guided momentum.

### Who is it for?
- Early-career engineers building skills
- Mid-career engineers preparing for interviews
- Career switchers learning software engineering
- Technical learners who want structure and accountability

### Why was it created?
To replace scattered tools with a single structured workspace tailored for engineering growth and AI-powered planning.

### What makes it different?
- Feature-first architecture instead of page-first.
- Domain-driven design with separate business logic.
- Modular registry and plugin systems.
- Event-driven engine coordination.
- Built for offline-ready usage and long-term extensibility.

### Why should someone use it?
Because it combines roadmap planning, note-taking, project tracking, interview prep, analytics, and AI guidance in a single coherent application.

### What problems does it solve?
- Fragmented workflows
- Lack of measurable progress
- No unified career dashboard
- Disconnected learning and project tracking
- Hard-to-manage interview preparation

---

## 03. Architecture

### Complete architecture
GenAI Engineer OS uses a layered architecture with clearly separated concerns.

```text
Root
├─ docs/
├─ registry/
├─ core/
├─ plugins/
├─ ai/
├─ database/
├─ src/
│  ├─ app/
│  ├─ domains/
│  ├─ features/
│  ├─ shared/
│  ├─ widgets/
│  ├─ services/
│  ├─ infrastructure/
│  ├─ styles/
│  ├─ config/
│  ├─ hooks/
│  ├─ store/
│  ├─ utils/
│  ├─ types/
│  ├─ assets/
│  └─ lib/
├─ public/
├─ prisma/
└─ package.json
```

### Layer descriptions
- **Root**: repository governance and build configuration.
- **docs/**: architecture, coding standards, release planning, and guidelines.
- **registry/**: central feature/navigation/permission metadata.
- **core/**: app-level systems such as events, flags, errors, commands, notifications, and observability.
- **plugins/**: extensibility surface for themes, courses, widgets, AI modules, and analytics.
- **ai/**: future AI-specific capabilities and prompt management.
- **database/**: data layer planning and migration support.
- **src/**: application code, including routes, domains, modules, styles, and support utilities.
- **public/**: static assets served by the application.
- **prisma/**: Prisma schema and database client configuration.

### How layers communicate
- **app** communicates with **services**, **shared**, **widgets**, **domains**, and **core**.
- **domains** encapsulate business rules and are called by **features**, **services**, and **core**.
- **core/events** dispatches cross-cutting events consumed by engines and app modules.
- **registry** provides shared feature metadata and navigation configuration.
- **plugins** extend behavior without mutating core modules.

### Diagrams

#### High-level flow

```text
UI (src/app) -> Feature Modules -> Services -> Domain Logic -> Infrastructure
       │                 │            │
       └──────────── Event Bus ───────┘
```

#### Communication paths

- `src/app` -> `src/features/*` -> `src/domains/*`
- `src/app` -> `src/services/*` -> `src/infrastructure/*`
- `src/app` -> `core/errors`, `core/loading`, `core/commands`
- `src/features/*` -> `core/events` -> `src/engines/*`
- `registry/*` provides central metadata for routes, icons, and permissions.

### Why each layer exists
- `src/app/`: Entry point for Next.js routing and global layouts.
- `src/features/`: Contains self-contained feature business modules.
- `src/domains/`: Holds pure business logic and domain models.
- `src/shared/`: Houses reusable UI, hooks, utilities, and abstractions.
- `src/services/`: Manages API integration and orchestration.
- `src/infrastructure/`: Adapters for persistence, auth, and environment-specific concerns.
- `core/`: Provides platform services shared across the application.
- `registry/`: Ensures feature metadata is centralized and consumable.
- `plugins/`: Makes the app extensible without core modifications.
- `docs/`: Captures all architectural governance and workflow rules.

---

## 04. Folder Structure

This section explains every folder in the repository and its intended contents.

### Root folders

- `ai/`
  - Future AI capabilities: chat, prompts, embeddings, RAG, agents, evaluations, memory, tools.
  - Contains AI-specific modules and models.
  - Never place generic UI or domain logic inside `ai/`.

- `core/`
  - Application-wide engine systems and runtime services.
  - Includes event bus, error handling, feature flags, settings registry, notifications, commands, observability.
  - Should not contain feature-specific UI or pages.

- `registry/`
  - Central registry for features, routes, navigation, permissions, icons, and animations.
  - Serves as single-source metadata.
  - Should not store business logic.

- `plugins/`
  - Extensibility modules that can be added or removed without changing core code.
  - Used for theme packs, course content, roadmap variants, widgets, AI enhancements, analytics extensions.

- `database/`
  - Data layer planning including schema, migrations, seed data, repositories, queries, and adapters.
  - Should not contain UI components.

- `docs/`
  - Living documentation and governance material.
  - Includes architecture, workflow, coding standards, and release planning.

- `prisma/`
  - Prisma schema and database client files.
  - Database-specific schema definitions.

- `public/`
  - Static assets served by Next.js.
  - Should contain images, fonts, icons, and static metadata files only.

- `src/`
  - Primary application source code.
  - Contains app routes, features, domains, shared logic, infrastructure adapters, services, styles, and support utilities.

- `src/app/`
  - Next.js App Router pages and layouts.
  - Contains route folders and page entrypoints.
  - Should not contain heavy business logic; delegate to features/domains.

- `src/domains/`
  - Contains pure business domain logic.
  - Responsible for career scoring, learning progression, project health, interview readiness, analytics models, and user rules.
  - Should not depend on React or UI.

- `src/features/`
  - Self-contained feature modules with components, hooks, services, store, types, constants, utils, data, validations, animations.
  - Each feature should be portable.
  - Example feature folders: `roadmap`, `ai-assistant`.

- `src/shared/`
  - Shared components, hooks, utils, and styles used across features.
  - Should avoid feature-specific implementation details.

- `src/widgets/`
  - Larger UI compositions built from shared components and feature primitives.
  - Examples: dashboard cards, analytics panels.

- `src/services/`
  - Orchestration of APIs, persistence, and business workflows.
  - Should not contain presentation logic.

- `src/infrastructure/`
  - Adapters for database, auth, third-party services, and storage.
  - Implementation-level concerns.

- `src/lib/`
  - Generic utilities and helper functions.
  - Non-application-specific code.

- `src/config/`
  - Environment helpers, runtime configuration, and global settings.

- `src/hooks/`
  - Custom React hooks and reusable stateful logic.

- `src/store/`
  - Global state management and store configuration.

- `src/styles/`
  - Design tokens and global CSS.
  - Contains typography, spacing, colors, motion, gradients, glass, z-index, and global styles.

- `src/types/`
  - Shared TypeScript definitions and domain types.

- `src/utils/`
  - Utilities used by both features and core layers.

- `src/assets/`
  - Static assets referenced by app code when not in `public/`.

- `src/data/`
  - Structured fixture or static data used by the application.

- `src/entities/`
  - Domain entities and value objects.

- `src/engines/`
  - Business engines such as Progress, XP, Achievements, Mission, Revision, Reminder, Calendar, Analytics, Notes, Search, Export, Backup, Theme.
  - Allows single-responsibility orchestrations.

### Important empty directories

- `src/components/*`
  - Actual component folders are present. Keep each folder focused on a specific UI domain.

- `src/features/*`
  - Feature module shells should be expanded with actual implementation.

---

## 05. File Responsibilities

### Root files

#### `package.json`
- Purpose: project dependency management and NPM script definitions.
- Dependencies: `next`, `react`, `react-dom`, `tailwindcss`, `@prisma/client`, `zustand`, `@tanstack/react-query`, `framer-motion`, `lucide-react`, and others.
- Used by: build system, developers, CI.
- Responsibilities: maintain correct package versions, script commands, and repository metadata.

#### `tsconfig.json`
- Purpose: TypeScript compiler configuration.
- Used by: TypeScript build and editor tooling.
- Responsibilities: enforce strict typing, define path aliases, and include only source files.

#### `tailwind.config.ts`
- Purpose: Tailwind CSS configuration.
- Used by: Tailwind compiler.
- Responsibilities: set content scanning paths, extend theme tokens, and supply plugin configuration.

#### `postcss.config.ts`
- Purpose: PostCSS plugin configuration.
- Used by: CSS build chain.
- Responsibilities: enable Tailwind and autoprefixer processing.

#### `next.config.ts`
- Purpose: Next.js application configuration.
- Used by: Next.js runtime.
- Responsibilities: configure server behavior, experimental options, and build settings.

#### `middleware.ts`
- Purpose: Next.js middleware pipeline.
- Used by: request handling.
- Responsibilities: route-level logic, auth checks, and other cross-cutting middleware.

#### `README.md`
- Purpose: repository introduction and quick start.
- Used by: contributors and reviewers.
- Responsibilities: provide a high-level summary and link to the blueprint.

#### `MASTER_BLUEPRINT.md`
- Purpose: canonical architecture and project truth.
- Used by: every developer and AI assistant.
- Responsibilities: describe architecture, standards, modules, workflows, and current state.

### Registry files

#### `registry/features.ts`
- Purpose: feature registry metadata.
- Used by: navigation, menus, and feature discovery.
- Responsibilities: define feature IDs, names, and paths.

#### `registry/routes.ts`
- Purpose: central route definitions.
- Used by: breadcrumbs, routing menus, and programmatic navigation.
- Responsibilities: maintain canonical path definitions.

#### `registry/navigation.ts`
- Purpose: primary navigation items.
- Used by: header/sidebar components.
- Responsibilities: define labels and paths for global navigation.

#### `registry/permissions.ts`
- Purpose: role-based access control metadata.
- Used by: auth and UI gating.
- Responsibilities: define permissible actions per role.

#### `registry/icons.ts`
- Purpose: icon mapping for features and UI.
- Used by: component icon renderers.
- Responsibilities: keep icon references centralized.

#### `registry/animations.ts`
- Purpose: shared animation metadata.
- Used by: motion-based components.
- Responsibilities: define animation presets.

### Core files

#### `core/events/eventBus.ts`
- Purpose: in-app event pub/sub system.
- Used by: cross-cutting communication between modules and engines.
- Responsibilities: publish and subscribe to event names.

#### `core/events/events.ts`
- Purpose: event constant definitions.
- Used by: emitters and listeners.
- Responsibilities: unify event names across the app.

#### `src/core/featureFlags/index.ts`
- Purpose: feature toggle definitions.
- Used by: runtime feature gating.
- Responsibilities: define and evaluate enabled functionality.

#### `src/core/settings/registry.ts`
- Purpose: centralized setting definitions.
- Used by: settings pages and configuration storage.
- Responsibilities: define available user settings and defaults.

#### `src/core/constants/index.ts`
- Purpose: application constants.
- Used by: features, engines, and services.
- Responsibilities: host global limits, routes, icons, XP levels, and achievement types.

#### `src/core/errors/ErrorBoundary.tsx`
- Purpose: React error boundary.
- Used by: app shell and route-level wrappers.
- Responsibilities: catch UI rendering errors and display fallback UI.

#### `src/core/errors/logger.ts`
- Purpose: centralized error logging.
- Used by: error handlers and boundaries.
- Responsibilities: log errors consistently.

#### `src/core/loading/skeleton.tsx`
- Purpose: skeleton loading component.
- Used by: loading states across UI.
- Responsibilities: provide progressive loading UI.

#### `src/core/motion/tokens.ts`
- Purpose: motion presets.
- Used by: animation implementations.
- Responsibilities: define consistent motion durations and springs.

#### `src/core/responsive/breakpoints.ts`
- Purpose: responsive design breakpoints.
- Used by: layout logic and responsive components.
- Responsibilities: provide canonical viewport thresholds.

#### `src/core/observability/index.ts`
- Purpose: logging and performance helpers.
- Used by: instrumentation code.
- Responsibilities: capture event and performance metrics.

#### `src/core/security/validation.ts`
- Purpose: validation schemas.
- Used by: input validation and form handling.
- Responsibilities: standardize validation logic with Zod.

#### `src/core/commands/palette.ts`
- Purpose: command palette items.
- Used by: command menu UI.
- Responsibilities: define quick actions.

#### `src/core/shortcuts.ts`
- Purpose: keyboard shortcut mapping.
- Used by: global keyboard handling.
- Responsibilities: define shortcut keys and actions.

#### `src/core/notifications/index.ts`
- Purpose: notification model and sample data.
- Used by: notification system.
- Responsibilities: define notification payload shape.

#### `src/core/backup/snapshot.ts`
- Purpose: backup snapshot model.
- Used by: backup system.
- Responsibilities: define backup metadata structure.

### Domain files

#### `src/domains/career/index.ts`
- Purpose: career score business rules.
- Responsibilities: calculate career score and aggregate skill points.

#### `src/domains/learning/index.ts`
- Purpose: learning progress logic.
- Responsibilities: summarize progress and streaks.

#### `src/domains/projects/index.ts`
- Purpose: project health evaluation.
- Responsibilities: determine project health status.

#### `src/domains/interview/index.ts`
- Purpose: interview readiness scoring.
- Responsibilities: aggregate readiness across technical, behavioral, and system design.

#### `src/domains/analytics/index.ts`
- Purpose: analytics snapshot modeling.
- Responsibilities: create standard analytics payloads.

#### `src/domains/user/index.ts`
- Purpose: user profile domain.
- Responsibilities: user role helpers and profile typing.

### Style files

#### `src/styles/colors.ts`
- Purpose: shared color palette.
- Responsibilities: primary and semantic colors.

#### `src/styles/typography.ts`
- Purpose: typography scale.
- Responsibilities: font families and sizes.

#### `src/styles/spacing.ts`
- Purpose: spacing scale.
- Responsibilities: consistent spacing tokens.

#### `src/styles/shadows.ts`
- Purpose: elevation shadows.
- Responsibilities: reusable box shadow tokens.

#### `src/styles/radius.ts`
- Purpose: border radius scale.
- Responsibilities: rounded corner values.

#### `src/styles/motion.ts`
- Purpose: motion tokens for the design system.
- Responsibilities: duration and easing definitions.

#### `src/styles/gradients.ts`
- Purpose: gradient definitions.
- Responsibilities: shared gradient styles.

#### `src/styles/glass.ts`
- Purpose: glassmorphism tokens.
- Responsibilities: translucent backgrounds and blur.

#### `src/styles/zIndex.ts`
- Purpose: stacking context tokens.
- Responsibilities: ensure consistent z-index values.

#### `src/styles/tokens.ts`
- Purpose: aggregate export of style tokens.
- Responsibilities: re-export all style token modules.

#### `src/styles/globals.css`
- Purpose: application base CSS.
- Responsibilities: global body styles, Tailwind imports, theme defaults.

---

## 06. Module Documentation

This repository currently contains scaffolded modules and core systems. Each module is documented here with its purpose, workflow, dependencies, and current status.

### Dashboard
- Purpose: centralized workspace overview.
- Workflow: display summaries of active missions, progress, notifications, and quick actions.
- Dependencies: `registry/navigation`, `core/observability`, `src/components/dashboard`.
- Future Expansion: dashboard widgets, performance charts, activity feed.
- Status: scaffolded by `src/app/(dashboard)` and `src/components/dashboard`.
- Priority: high.
- Roadmap: v0.2.

### Roadmap
- Purpose: plan long-term learning and career paths.
- Workflow: roadmap creation, milestone tracking, progress updates.
- Dependencies: `src/features/roadmap`, `src/components/roadmap`, `domains/career`.
- Future Expansion: timeline drag/drop, roadmap templates.
- Status: feature entrypoint and component shell exist.
- Priority: high.
- Roadmap: v0.3.

### Calendar
- Purpose: time-based planning and scheduling.
- Workflow: events, missions, deadlines, review cycles.
- Dependencies: `src/components/calendar`, `core/responsive`, `core/commands`.
- Future Expansion: FullCalendar integration, schedule intelligence.
- Status: route exists.
- Priority: medium.
- Roadmap: v0.4.

### Projects
- Purpose: manage engineering projects end-to-end.
- Workflow: project creation, status tracking, milestone progress.
- Dependencies: `src/domains/projects`, `src/components/projects`.
- Future Expansion: GitHub sync, project templates, collaboration.
- Status: shell route present.
- Priority: medium.
- Roadmap: v0.5.

### Interview Hub
- Purpose: central interview preparation and readiness.
- Workflow: track interview readiness scores, mock questions, system design practice.
- Dependencies: `src/domains/interview`, `src/components/interview`.
- Future Expansion: interview history, score prediction.
- Status: route exists.
- Priority: medium.
- Roadmap: v0.6.

### Resume
- Purpose: track resume progress and outputs.
- Workflow: resume templates, achievements display, export options.
- Dependencies: `src/components/resume`, `core/backup`.
- Future Expansion: resume builder and LinkedIn integration.
- Status: route exists.
- Priority: low.
- Roadmap: v0.7.

### GitHub
- Purpose: surface GitHub project and contribution data.
- Workflow: connect account, view repos, performance metrics.
- Dependencies: `src/components/github`, `services/github`.
- Future Expansion: PR readiness, issue tracking.
- Status: route exists.
- Priority: low.
- Roadmap: v0.7.

### Analytics
- Purpose: measure learning and career progress.
- Workflow: collect snapshots, chart performance, analyze goals.
- Dependencies: `src/domains/analytics`, `src/components/analytics`, `core/observability`.
- Future Expansion: funnel analytics, retention, heatmaps.
- Status: route exists.
- Priority: medium.
- Roadmap: v0.5.

### Notes
- Purpose: capture knowledge, interview prep, and project docs.
- Workflow: note creation, search, revision.
- Dependencies: `src/components/notes`, `core/backup`, `core/commands`.
- Future Expansion: Tiptap editor, search engine, flashcards.
- Status: route exists.
- Priority: high.
- Roadmap: v0.4.

### Settings
- Purpose: manage app preferences and feature configuration.
- Workflow: configure theme, notifications, shortcuts, AI settings.
- Dependencies: `src/core/settings`, `components/settings`, `registry/permissions`.
- Future Expansion: advanced account settings and audit logs.
- Status: route exists.
- Priority: high.
- Roadmap: v0.2.

### AI Mentor
- Purpose: future AI-driven personalized guidance.
- Workflow: suggest missions, identify weak topics, recommend resources.
- Dependencies: `ai/`, `plugins/ai`, `src/core/featureFlags`, `src/domains/learning`.
- Future Expansion: RAG, memory, agents, evaluations.
- Status: planned.
- Priority: very high.
- Roadmap: v1.0.

### Job Tracker
- Purpose: manage applications and company targets.
- Workflow: track interviews, offers, deadlines, and progress.
- Dependencies: `src/components/jobs`, `src/features/jobs`, `core/notifications`.
- Future Expansion: company scoring, application pipeline.
- Status: route exists.
- Priority: medium.
- Roadmap: v0.6.

### Gamification
- Purpose: motivate progress with levels, achievements, and missions.
- Workflow: XP accrual, achievement unlocking, streak tracking.
- Dependencies: `src/engines/XPEngine`, `src/engines/AchievementEngine`, `src/components/gamification`.
- Future Expansion: badges, leaderboard, career scores.
- Status: scaffolded.
- Priority: high.
- Roadmap: v0.6.

### Daily Missions
- Purpose: daily goal setting and progress tracking.
- Workflow: mission assignment, completion, XP reward.
- Dependencies: `src/engines/MissionEngine`, `core/events`, `src/components/dashboard`.
- Future Expansion: adaptive mission generation.
- Status: scaffolded.
- Priority: high.
- Roadmap: v0.4.

### Revision Engine
- Purpose: spaced repetition and review planning.
- Workflow: schedule revisions, track review performance.
- Dependencies: `src/engines/RevisionEngine`, `src/domains/learning`.
- Future Expansion: personalized revision paths.
- Status: scaffolded.
- Priority: medium.
- Roadmap: v0.5.

### XP Engine
- Purpose: XP mechanics and level progression.
- Workflow: assign XP for actions, recalculate career score.
- Dependencies: `src/engines/XPSystem`, `src/core/constants`.
- Future Expansion: mastery rewards and UI progression.
- Status: scaffolded.
- Priority: high.
- Roadmap: v0.5.

### Achievements
- Purpose: reward milestones and mastery.
- Workflow: unlock achievements for completed work.
- Dependencies: `src/engines/AchievementEngine`, `core/events`.
- Future Expansion: achievement badges and status.
- Status: scaffolded.
- Priority: medium.
- Roadmap: v0.5.

### Search
- Purpose: universal search across notes, projects, roadmap, interview topics, and resources.
- Workflow: query indexing, Fuse.js scoring, results UI.
- Dependencies: `fuse.js`, `src/components/notes`, `src/components/projects`.
- Future Expansion: cross-feature unified search.
- Status: planned.
- Priority: high.
- Roadmap: v0.6.

### Notifications
- Purpose: deliver reminders and milestone alerts.
- Workflow: generate notifications for deadlines, review reminders, achievements.
- Dependencies: `src/core/notifications`, `core/events`, `src/components/ui`.
- Future Expansion: notification center and dismiss actions.
- Status: scaffolded.
- Priority: medium.
- Roadmap: v0.4.

### Command Palette
- Purpose: keyboard-driven quick navigation.
- Workflow: open palette, execute actions, navigate routes.
- Dependencies: `src/core/commands`, `src/core/shortcuts`, `src/components/ui`.
- Future Expansion: search commands, plugin actions.
- Status: scaffolded.
- Priority: high.
- Roadmap: v0.3.

### Plugins
- Purpose: make extensions pluggable.
- Workflow: add/remove plugin folders, register plugin metadata.
- Dependencies: `plugins/`, `registry/`, `core/featureFlags`.
- Future Expansion: theme plugins, course packs, AI capabilities.
- Status: scaffolded.
- Priority: high.
- Roadmap: v0.8.

### Registry
- Purpose: centralized app metadata.
- Workflow: read registry files to render navigation and gate features.
- Dependencies: `registry/*`.
- Future Expansion: plugin registration, dynamic route discovery.
- Status: implemented.
- Priority: high.
- Roadmap: ongoing.

### Core
- Purpose: platform and runtime services.
- Workflow: handle events, errors, loading, observability, settings, and features.
- Dependencies: `core/*`.
- Future Expansion: event listeners, logging, analytics instrumentation.
- Status: implemented.
- Priority: critical.
- Roadmap: ongoing.

### Domains
- Purpose: pure business models.
- Workflow: execute domain logic outside of UI.
- Dependencies: `src/domains/*`.
- Future Expansion: domain-driven validation and aggregate roots.
- Status: implemented.
- Priority: critical.
- Roadmap: ongoing.

### Infrastructure
- Purpose: adapters for persistence, auth, and storage.
- Workflow: connect the app to data sources.
- Dependencies: `src/infrastructure/*`, `database/*`, `prisma/`.
- Future Expansion: Supabase, Dexie, migration support.
- Status: planned.
- Priority: critical.
- Roadmap: v0.8.

---

## 07. Workflow

### Developer Workflow
1. Update `MASTER_BLUEPRINT.md` as the first step of architecture change.
2. Create a feature branch from `develop` or `main`.
3. Implement code within `src/`, `core/`, or `registry/` only.
4. Add documentation in `docs/` if the change affects architecture, standards, or release planning.
5. Run linting and tests before committing.
6. Open a PR and reference the blueprint when architecture decisions are made.

### Feature Workflow
1. Define feature in `registry/features.ts`.
2. Create or extend the `src/features/<feature>` module.
3. Implement domain logic in `src/domains/`.
4. Add UI to `src/app/` routes and shared components.
5. Register routes in `registry/routes.ts` and navigation in `registry/navigation.ts`.
6. Add related events in `core/events/events.ts`.
7. Update `MASTER_BLUEPRINT.md` and relevant docs.

### Build Workflow
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`

### Git Workflow
- Branch from `main` or `develop`.
- Use descriptive branch names: `feature/<feature-name>`, `fix/<issue>`, `chore/<area>`.
- One PR per feature or bug fix.
- Include architecture impact summaries.
- Require review before merge.

### Testing Workflow
- Unit tests for domain logic and utilities.
- Integration tests for service flows.
- Component tests for UI contracts.
- E2E tests for full user journeys.
- Update `MASTER_BLUEPRINT.md` when tests change architecture.

### Deployment Workflow
- Deploy from `main` to preview or production environments.
- Use CI to run build, lint, and tests.
- Document release notes in `docs/Changelog.md`.

### Release Workflow
- Use semantic versions for milestones.
- Track feature progress in `docs/Roadmap.md` and `docs/Changelog.md`.
- Tag releases in Git.

---

## 08. Development Phases

### Versioning and phases
- `v0.1` - Foundation: architecture, registry, core systems, design tokens, first routes.
- `v0.2` - Dashboard and settings.
- `v0.3` - Roadmap and command palette.
- `v0.4` - Notes, calendar, notifications.
- `v0.5` - Projects, analytics, XP/Achievement engines.
- `v0.6` - Interview hub, AI mentor scaffolding, job tracker.
- `v0.7` - Plugins, backup system, resume builder.
- `v1.0` - Production-ready, full documentation, offline sync, release-grade stability.

### Completion criteria
- Architecture is documented in `MASTER_BLUEPRINT.md`.
- Core systems are in place and integrated.
- Feature registries and routes are connected.
- Release notes and docs are up to date.

---

## 09. Coding Standards

### Strict TypeScript
- Always use `strict: true`.
- Prefer explicit types for exports.
- Avoid `any` unless absolutely necessary.

### Naming Convention
- Files: `kebab-case` for folders, `PascalCase` for React components.
- Hooks: `useSomething.ts`.
- Services: `something.service.ts`.
- Types: `something.types.ts`.
- Constants: `something.constants.ts`.

### Folder Convention
- Keep feature code inside `src/features/<feature>/`.
- Domain logic must live in `src/domains/`.
- UI inside `src/components/`, `src/widgets/`, or `src/app/`.

### Reusable Components
- Build UI primitives in `src/shared/ui/`.
- Avoid duplicate component markup.

### Hooks
- Place hooks in `src/hooks/` or `src/features/<feature>/hooks/`.
- Keep hooks composable and platform-agnostic.

### Services
- Build services in `src/services/`.
- Use services for API calls and orchestration.

### Error Handling
- Use `core/errors/ErrorBoundary` for React boundaries.
- Log errors with `core/errors/logger.ts`.
- Avoid unhandled exceptions in feature code.

### State Management
- Global state belongs in `src/store/`.
- Server state belongs in service hooks or query clients.
- Local UI state belongs in components or hooks.

### Accessibility
- Keyboard navigation must work for every interactive component.
- Use ARIA roles and labels where appropriate.
- Ensure color contrast meets WCAG guidelines.

### Performance
- Use skeleton screens and progressive loading.
- Lazy load non-critical components.
- Avoid large bundles by splitting routes.

### Documentation Rules
- Document architectural changes in `MASTER_BLUEPRINT.md`.
- Add new docs when new folders or systems are introduced.
- Keep docs synchronized with code.

### Comment Rules
- Comments must explain why, not what.
- Use comments for architecture rationale and non-obvious logic.

### Import Order
1. external packages
2. app-specific modules
3. shared utilities
4. styles and assets

### File Header Rules
- Every new file should have a short purpose comment if it is not self-explanatory.
- Do not include placeholder comments in production files.

---

## 10. Design System

### Typography
- Use `src/styles/typography.ts` for font scale.
- Base font is `Inter`.

### Spacing
- Use `src/styles/spacing.ts` for spacing tokens.
- Consistent spacing across layout and components.

### Colors
- Define palette in `src/styles/colors.ts`.
- Use semantic names for backgrounds, text, accents, success, warning, danger.

### Radius
- Define border radius values in `src/styles/radius.ts`.
- Use consistent rounding for cards and modals.

### Shadows
- Define elevations in `src/styles/shadows.ts`.
- Use `soft`, `md`, and `lg` shadow tokens.

### Glass
- Define translucency tokens in `src/styles/glass.ts`.
- Use glass styles for elevated panels.

### Gradients
- Define shared gradients in `src/styles/gradients.ts`.

### Animation Tokens
- Define motion tokens in `src/styles/motion.ts` and `src/core/motion/tokens.ts`.
- Use `fast`, `medium`, `slow`, `spring` presets.

### Motion Rules
- Use motion consistently across page transitions and modals.
- Prefer subtle, non-distracting animations.

### Dark Theme
- Base theme is dark.
- Global styling is defined in `src/styles/globals.css`.

### Responsive Rules
- Breakpoints are defined in `src/core/responsive/breakpoints.ts`.
- Use tokenized responsive values, not hardcoded pixels.

---

## 11. UI Philosophy

GenAI Engineer OS targets a professional SaaS aesthetic inspired by Apple, Linear, Notion, GitHub, and Vercel.

### Apple
- Focus on clarity, spacing, and calm interfaces.

### Linear
- Use clean components, fast motion, and minimal chrome.

### Notion
- Emphasize content-first layout and modular blocks.

### GitHub
- Keep navigation obvious and tool-aware.

### Vercel
- Combine polished design with developer experience.

### Professional SaaS
- Build interfaces that are predictable, responsive, and supportive of workflows.

---

## 12. Feature Roadmap

| Feature | Status | Dependencies | Future Version | Priority | Complexity |
|---|---|---|---|---|---|
| Dashboard | scaffolded | `src/components/dashboard` | v0.2 | high | medium |
| Roadmap | scaffolded | `src/features/roadmap` | v0.3 | high | medium |
| Command Palette | scaffolded | `core/commands` | v0.3 | high | medium |
| Settings | scaffolded | `core/settings` | v0.2 | high | low |
| Notes | scaffolded | `src/components/notes` | v0.4 | high | medium |
| Calendar | scaffolded | `src/components/calendar` | v0.4 | medium | medium |
| Projects | scaffolded | `src/components/projects` | v0.5 | medium | medium |
| Interview | scaffolded | `src/domains/interview` | v0.6 | medium | medium |
| Analytics | scaffolded | `src/domains/analytics` | v0.5 | medium | medium |
| AI Mentor | planned | `ai/`, `plugins/ai` | v1.0 | very high | high |
| Notifications | scaffolded | `core/notifications` | v0.4 | medium | low |
| XP Engine | scaffolded | `src/engines/XPSystem` | v0.5 | high | medium |
| Achievement Engine | scaffolded | `src/engines/AchievementEngine` | v0.5 | medium | medium |
| Backup | scaffolded | `core/backup` | v0.8 | medium | high |
| Offline Sync | planned | `database/`, `ai/` | v0.8 | high | high |

---

## 13. Build Order

### Current phase
Architecture and foundation.

### Completed
- `MASTER_BLUEPRINT.md`
- root architecture and registry
- design tokens and style system
- core services scaffolding
- app route skeletons
- domain layer scaffolding

### Remaining
- full features and page implementations
- offline database layer
- AI layer and plugin registration
- production-grade mobile responsiveness
- analytics instrumentation

### Blocked
- missing actual engine implementation
- no database adapter yet
- limited UI composition currently

### Exact build order
1. Finalize architecture in `MASTER_BLUEPRINT.md`.
2. Build shared design system tokens.
3. Scaffold core systems in `core/`.
4. Add feature registry metadata.
5. Implement app shell and routes.
6. Add domain logic and services.
7. Build feature pages and shared components.
8. Add event flows and notification engine.
9. Wire offline storage and backup.
10. Add plugin support and AI layer.

---

## 14. Data Flow

### Data flow diagram

```text
UI (src/app/pages) -> Features -> Services -> Domains -> Infrastructure / database
         │              │           │
         └──────────── Event Bus ───┘
```

### Flow explanation
- UI triggers user actions.
- Features coordinate user intent and call services.
- Services orchestrate business logic and domain models.
- Domains enforce business rules and return normalized results.
- Infrastructure persists data and returns state.
- Events notify engines and analytics.

---

## 15. Event Flow

### Defined events
- `StudyCompleted`
- `XPUpdated`
- `AchievementUnlocked`
- `AnalyticsUpdated`
- `CalendarUpdated`
- `MissionUpdated`

### Event flow
- Emitters: features, engines, services.
- Listeners: engines, analytics, notifications, UI components.
- Purpose: decouple modules and coordinate state changes.

### Example
- `StudyCompleted` emitted when a learning mission is finished.
- `XPUpdated` listener updates XP engine and career score.
- `AchievementUnlocked` listener updates achievement panel.
- `AnalyticsUpdated` records data for dashboards.
- `CalendarUpdated` refreshes scheduled activities.

---

## 16. Folder Responsibilities

This section describes the purpose of every folder and what belongs there.

### Root folders
- `ai/`: future AI-specific modules only.
- `core/`: runtime and application platform services.
- `registry/`: centralized feature metadata.
- `plugins/`: extensions and third-party integrations.
- `database/`: migration and adapter planning.
- `docs/`: living documentation.
- `public/`: static assets.
- `prisma/`: database schema config.
- `src/`: application source.

### `src/` folders
- `src/app/`: App Router pages and layouts.
- `src/domains/`: pure domain logic.
- `src/features/`: self-contained feature modules.
- `src/shared/`: reusable utilities and UI.
- `src/widgets/`: composed UI blocks.
- `src/services/`: API and orchestration services.
- `src/infrastructure/`: persistence and platform adapters.
- `src/lib/`: low-level helper functions.
- `src/config/`: environment helpers.
- `src/hooks/`: shared hooks.
- `src/store/`: global state stores.
- `src/styles/`: design tokens and global styles.
- `src/types/`: shared type definitions.
- `src/utils/`: generic utilities.
- `src/assets/`: non-public static assets.
- `src/data/`: static data and fixtures.
- `src/entities/`: domain entities.
- `src/engines/`: business engines.

### Rules
- Never put UI logic in `src/domains/`.
- Never put business rules in `src/components/`.
- Never put feature metadata in UI components.
- Keep static assets limited to `public/` and `src/assets/`.

---

## 17. State Management

### Global Store
- Use `src/store/` for app-wide state.
- Should host user/session state, theme mode, and feature flags.

### Local State
- Use component state or `src/hooks/` for UI-specific state.

### Server State
- Managed through service hooks and query clients.
- Data fetched from APIs should be cached and normalized.

### Persistence
- Plan for IndexedDB and Dexie in `database/`.
- Use `core/backup` for snapshot and restore metadata.

### Offline Sync
- Future offline sync uses `database/adapters` and `database/queries`.
- Conflict resolution strategy must be implemented before v0.8.

### Caching
- Cache API results in service layer.
- Avoid stale data by invalidating caches on key events.

---

## 18. Database Plan

### Current state
- No concrete tables implemented yet.
- `prisma/` and `database/` are reserved for data layer.

### Planned tables
- Users
- Profiles
- Notes
- Projects
- Roadmaps
- InterviewSessions
- Achievements
- XPEvents
- Notifications
- Backups
- FeatureFlags

### Relationships
- User -> Projects
- User -> Notes
- User -> Achievements
- Project -> Roadmap
- User -> Notifications

### Indexes
- Index by userId for multi-user support.
- Search indexes for notes and projects.

### Migration strategy
- Use Prisma migrations in `database/migrations`.
- Seed initial data in `database/seed`.
- Use repository/adapters pattern in `database/repositories`.

---

## 19. Offline Strategy

### IndexedDB
- Preferred offline storage mechanism.
- Use Dexie for schema versioning and query support.

### Caching
- Cache mission state, notes, and roadmap locally.
- Sync with remote backend when online.

### Synchronization
- Implement a queue of offline operations.
- Apply conflict resolution on sync.

### Conflict Resolution
- Prefer last-writer-wins for non-critical metadata.
- Use merge strategies for notes and project updates.

### Backups
- `core/backup/snapshot.ts` defines backup metadata.
- Manual and automatic backups should be supported.

---

## 20. AI Architecture

### Future AI layer
- `ai/` for chat, prompts, embeddings, RAG, agents, evaluations, memory, tools.
- `plugins/ai` for extendable AI capabilities.

### Prompt Management
- Centralize prompts for reusable interactions.
- Keep prompt templates separate from business logic.

### RAG
- Plan Retrieval-Augmented Generation for knowledge recall.
- Use embeddings and vector search in future.

### Agents
- Build agents for task automation and guidance.

### Memory
- Store user context, past questions, and progress.

### Tools
- Provide AI tools for notes, code generation, and planning.

### LLMs
- Abstract model providers to support multiple backends.

### Evaluations
- Capture AI output quality metrics.

---

## 21. Security

### Authentication
- Plan for auth providers in `src/infrastructure/`.
- Use secure tokens and session management.

### Authorization
- Use `registry/permissions.ts` for role-based access.
- Enforce authorization at UI and service boundaries.

### Validation
- Use `core/security/validation.ts` and Zod for input validation.

### Sanitization
- Sanitize all user-generated content before rendering.

### Secrets
- Keep secrets outside source control.
- Use environment variables in `src/config/env.ts`.

### Rate Limiting
- Plan rate limiting on API endpoints when built.

### Permissions
- Centralize permission data in `registry/permissions.ts`.

---

## 22. Performance

### Bundle Size
- Keep third-party dependencies lean.
- Prefer route splitting.

### Code Splitting
- Lazy load feature pages and widgets.

### Lazy Loading
- Use dynamic imports for heavy UI modules.

### Caching
- Cache API and domain results in services.

### Optimization
- Use Tailwind statically and optimize CSS.
- Avoid unnecessary rerenders.

### Animation Performance
- Use hardware-accelerated motion and transition tokens.
- Avoid large layout thrashing.

---

## 23. Testing

### Unit
- Test domain functions and utilities.
- Use Jest or equivalent.

### Integration
- Test service interactions and feature workflows.

### E2E
- Test critical user journeys.

### Visual
- Test component render states and skeletons.

### Performance
- Monitor build performance and page load metrics.

### Accessibility
- Test keyboard navigation, ARIA roles, and contrast.

---

## 24. Deployment

### Environments
- Development: local dev server.
- Preview: staging or preview deployments.
- Production: release builds.

### CI/CD
- Use automated pipelines for build, lint, and tests.
- Deploy `main` after passing checks.

### Deployment
- Build with `next build`.
- Serve with `next start` or host on Vercel.

---

## 25. Git Workflow

### Branches
- `main`: production-ready.
- `develop`: active development.
- `feature/*`: new features.
- `fix/*`: bug fixes.
- `chore/*`: maintenance.

### Commits
- Use clear, descriptive messages.
- Reference issue or feature identifiers.

### PR Rules
- One PR per logical change.
- Include architectural notes when relevant.
- Require review before merge.

### Versioning
- Use semantic versioning.
- Tag releases in Git.

---

## 26. Release Plan

### Release milestones
- `v0.1`: Foundation.
- `v0.2`: Dashboard and settings.
- `v0.3`: Roadmap and command palette.
- `v0.4`: Notes, calendar, notifications.
- `v0.5`: Projects, analytics, XP, achievements.
- `v0.6`: Interview hub, job tracker.
- `v0.7`: Plugins, backup, offline sync.
- `v1.0`: Production-ready launch.

### Future versions
- `v1.1`: AI mentor and personalized plans.
- `v1.2`: RAG and memory-based coaching.
- `v2.0`: multi-user collaboration and team features.

---

## 27. Future Roadmap

### Ideas
- AI-powered career mentor.
- Salary prediction engine.
- Voice note capture.
- Plugin marketplace.
- GitHub activity sync.
- Revision scheduling.

### Technical Debt
- Implement actual database adapter.
- Add UI component playground.
- Complete offline sync.
- Add tests and CI coverage.

### Improvements
- Expand `src/features/` modules.
- Add enterprise-grade auth and permissions.
- Harden observability and error reporting.

### Wishlist
- Built-in docs site.
- Developer mode.
- Performance dashboard.
- Version history and rollback.

---

## 28. Rules for Every Future File

Every new file must include:
- Purpose.
- Responsibilities.
- Dependencies.
- Professional comments only when needed.
- No duplicated logic.
- Reusable design.
- Responsive behavior.
- Accessible behavior.
- Production-ready implementation.

---

## 29. Repository Health

### Track
- Architecture freeze status.
- Documentation completeness.
- Technical debt backlog.
- Build status.
- Known issues.
- Pending tasks.

### Health goals
- Keep `MASTER_BLUEPRINT.md` up to date.
- Keep docs aligned with code changes.
- Minimize repo drift by updating architecture with every change.

---

## 30. Current Project Status

> This section was found stale during File 047 and corrected against
> the actual repository (git history + filesystem), per the rule that
> the repository — not this document — is the source of truth. See
> §37 Session Handoff for the full account of the discrepancy.

### Current Phase
Phase 2 — UI Foundation.

### Current Module
Shared UI primitives (`src/shared/ui/`).

### Current File
`src/shared/ui/Tabs.tsx`

### Completed %
Design token layer (Phase 1) is complete. UI Foundation (Phase 2) has
18 of an unconfirmed total number of primitives built: `types.ts`,
`Button.tsx`, `Avatar.tsx`, `Divider.tsx`, `Select.tsx`, `Checkbox.tsx`,
`Radio.tsx`, `Switch.tsx`, `Tooltip.tsx`, `Modal.tsx`, `Drawer.tsx`, `Dropdown.tsx`, `EmptyState.tsx`, `Toast.tsx`, `Alert.tsx`, `Pagination.tsx`, `Breadcrumb.tsx`, `Progress.tsx`, `Tabs.tsx`. The total-count
denominator is deliberately not restated here — see §37's note on file
numbering not corresponding to verified repo history.

### Remaining %
Not tracked as a percentage — see §30's Completed % note above.

### Latest Changes
- Added `src/shared/ui/Tabs.tsx`: accessible compound tabs primitive with
  roving tabindex, arrow-key navigation, and controlled state.
- Implements `Tabs`, `TabList`, `Tab`, and `TabPanel` as local compound
  components sharing context internal to this file.
- Supports horizontal and vertical orientation with ARIA tablist semantics.
- Code reviewed by inspection.
- Supports optional percentage text and fully qualified theme token
  variants for semantic intent.
- Code reviewed by inspection.

### Latest Features
- `Progress.tsx` UI Foundation primitive, pending final local verification.

---

## 31. Change History

This section must be appended with every update.

| Date | Version | Files Changed | Reason | Impact |
|---|---|---|---|---|
| 2026-08-06 | 0.1 | `MASTER_BLUEPRINT.md` | Initial blueprint creation | Establish canonical project truth |
| 2026-08-06 | 0.1 | `src/styles/spacing.ts` | Refactor spacing into pure gap tokens | Keep spacing separate from sizing/layout/responsive concerns |
| 2026-08-06 | 0.1 | `src/styles/sizing.ts` | Add dimensional size tokens | Separate component sizing from spacing |
| 2026-08-06 | 0.1 | `src/styles/radius.ts` | Add radius scale and semantic radius aliases | Consistent corner rounding across UI surfaces |
| 2026-08-06 | 0.1 | `src/styles/shadows.ts` | Add elevation shadows + focus ring | Dark-mode elevation system for cards/modals/dropdowns |
| 2026-08-06 | 0.1 | `src/styles/motion.ts` | Add semantic motion presets | Centralized motion vocabulary sourced from durations/easing |
| 2026-08-06 | 0.1 | `src/styles/glass.ts` | Add glassmorphism tokens | Shared glass UI treatments for elevated surfaces |
| 2026-08-06 | 0.1 | `src/styles/gradients.ts` | Add shared gradient definitions | Consistent accent gradients and hero backgrounds |
| 2026-08-06 | 0.1 | `src/styles/borders.ts` | Add border token scale | Separate border thickness from color and radius |
| 2026-08-06 | 0.1 | `src/styles/opacity.ts` | Add opacity scale | Consistent overlay, disabled, and backdrop opacity values |
| 2026-08-06 | 0.1 | `src/styles/durations.ts` | Add animation duration scale | Shared motion timing source for transitions and animation presets |
| 2026-08-06 | 0.1 | `src/styles/easing.ts` | Add easing curve definitions | Shared easing source for motion and transitions |
| 2026-08-06 | 0.1 | `src/styles/layout.ts` | Add app-shell dimensions | Moved container/sidebar/navbar/page dimensions out of spacing |
| 2026-08-06 | 0.1 | `src/styles/density.ts` | Add density mode tokens | Enable future UI density switching |
| 2026-08-06 | 0.1 | `src/styles/tokens.ts` | Add design token barrel export | Single import surface for style tokens and Tailwind integration |
| 2026-08-06 | 0.3 | `MASTER_BLUEPRINT.md` | Add §37 Session Handoff | Enable fresh chat continuation with zero lost context |
| 2026-08-06 | 0.4 | `src/shared/ui/Select.tsx` | Add File 047 — Select UI Foundation primitive | Native `<select>` with chevron icon, `SelectOption[]` API, error/size/fullWidth support |
| 2026-08-06 | 0.4 | `MASTER_BLUEPRINT.md` | Correct §30 and §37 against actual repo state (git-verified); document Button/Avatar color-token bug found during inspection | Repository is source of truth; prior status sections had drifted from reality by ~10 files |
| 2026-08-06 | 0.5 | `src/shared/ui/Checkbox.tsx` | Add File 048 — Checkbox UI Foundation primitive | Native checkbox with indeterminate support, label/description/error props |
| 2026-08-06 | 0.5 | `MASTER_BLUEPRINT.md` | Update §30/§37 for Checkbox.tsx; re-confirmed no drift vs origin/main before building | Keep status sections synchronized with each verified file |
| 2026-08-06 | 0.6 | `src/shared/ui/Tooltip.tsx` | Add File 053 — Tooltip UI Foundation primitive | Accessible animated tooltip with robust event handler composition |
| 2026-08-06 | 0.6 | `MASTER_BLUEPRINT.md` | Update §30/§31/§37 for Tooltip.tsx integration | Keep status sections synchronized with the new tooltip file |
| 2026-08-06 | 0.6 | `src/shared/ui/Modal.tsx` | Add File 054 — Modal UI Foundation primitive | Accessible dialog with strict focus management and scroll locking |
| 2026-08-06 | 0.6 | `MASTER_BLUEPRINT.md` | Update §30/§31/§37 for Modal.tsx | Keep status sections synchronized |
| 2026-08-06 | 0.7 | `src/shared/ui/Drawer.tsx` | Add File 055 — Drawer UI Foundation primitive | Accessible drawer panel using React Portals, motion animation, and scroll locking |
| 2026-08-06 | 0.7 | `MASTER_BLUEPRINT.md` | Update §30/§31 for Drawer.tsx | Keep status sections synchronized |
| 2026-08-06 | 0.8 | `src/shared/ui/Dropdown.tsx` | Add File 056 — Dropdown UI Foundation primitive | Accessible menu button with keyboard trigger support and arrow key navigation |
| 2026-08-06 | 0.8 | `MASTER_BLUEPRINT.md` | Update §30/§31 for Dropdown.tsx | Keep status sections synchronized |
| 2026-08-06 | 0.9 | `src/shared/ui/EmptyState.tsx` | Add File 061 — EmptyState UI Foundation primitive | Portable empty state surface with motion and optional action slot |
| 2026-08-06 | 0.9 | `MASTER_BLUEPRINT.md` | Update §30/§31 for EmptyState.tsx | Keep status sections synchronized |
| 2026-08-06 | 1.0 | `src/shared/ui/Toast.tsx` | Add File 060 — Toast UI Foundation primitive | Transient notification primitive with accessible announcer and close action |
| 2026-08-06 | 1.0 | `MASTER_BLUEPRINT.md` | Update §30/§31 for Toast.tsx | Keep status sections synchronized |
| 2026-08-06 | 1.1 | `src/shared/ui/Alert.tsx` | Add File 059 — Alert UI Foundation primitive | Status alert with semantic variants and accessible role |
| 2026-08-06 | 1.1 | `MASTER_BLUEPRINT.md` | Update §30/§31 for Alert.tsx | Keep status sections synchronized |
| 2026-08-06 | 1.2 | `src/shared/ui/Progress.tsx` | Add File 057 — Progress UI Foundation primitive | Determinate and indeterminate progress bar with ARIA-safe semantics |
| 2026-08-06 | 1.2 | `MASTER_BLUEPRINT.md` | Update §30/§31 for Progress.tsx | Keep status sections synchronized |

---

## 34. Component Maturity Policy

Every component in `src/shared/ui/` and `src/widgets/` must declare a
maturity level in its file header comment. This is tracked here, not
enforced by tooling yet — a future ESLint rule may check for the tag.

| Level | Meaning | Rule |
|---|---|---|
| Experimental | API may change without notice | Fine to use in scaffolding; do not depend on its prop shape in shared code |
| Stable | Safe for reuse across features | Breaking changes require a note in Change History |
| Deprecated | Superseded by a newer component | Do not use in new code; existing usages should migrate |
| Archived | Kept only for backward compatibility | Never use in new code |

Format: `@maturity Experimental` (etc.) as a line in the file's top
JSDoc comment. Every UI Foundation component built from this point
forward starts at `Experimental` and is promoted to `Stable` once it
has at least one real consumer in a feature page.

## 35. Deferred Architecture Notes

These are acknowledged future needs, intentionally not built yet
because they have no consumers today. Revisit when the trigger
condition is met.

### Theme Registry
- **What**: a registry (`highContrast`, `oled`, `sepia`, custom themes) generalizing beyond the current `dark`/`light`/`system` union.
- **Trigger to build**: the first time a third resolved theme (not just a mode) is actually needed — e.g. a real high-contrast theme, not just the current media-query stub.
- **Where it will live**: `src/core/theme/themeRegistry.ts`, alongside a widened `ResolvedTheme` type in `theme.types.ts`.

### CSS Variable Build Step
- **What**: generate `globals.css`'s static variable blocks from `colors.ts` automatically (via `cssVariables.ts`) at build time, removing the current manual duplication between the two.
- **Trigger to build**: the first time `colors.ts` and `globals.css` drift, or when a third theme makes manual duplication unmanageable.
- **Where it will live**: a Node build script invoked from `package.json`'s `prebuild`, writing generated CSS into `src/styles/generated/`.

### ThemeSwitcher Restyle
- **What**: replace inline styles in `ThemeSwitcher.tsx` with `Button`, `Card`, and token-driven classes.
- **Trigger to build**: immediately once `Button` (File 033 or so) exists — should be the first real consumer proving the primitive out.

## 32. AI Context

### AI assistant must know
- Architecture is feature-first and domain-driven.
- `MASTER_BLUEPRINT.md` is the source of truth.
- All new files must conform to coding standards.
- Avoid mixing UI business logic with domain code.
- Use registry metadata for navigation and permissions.
- Maintain consistent design tokens.
- Keep documentation synchronized with code.

### Architecture
- Root `core/`, `registry/`, `plugins/`, `ai/`, `src/`, `docs/`.
- `src/app/` for pages.
- `src/domains/` for business rules.
- `src/features/` for self-contained modules.
- `src/shared/` for reusable components.

### Coding standards
- Strict TypeScript.
- Centralized constants.
- Event-driven communication.
- No hardcoded values.

### Workflow
- Update blueprint first when architecture changes.
- Add docs for every new folder or feature.
- Use semantic git workflow.

### Current phase
Foundation and architecture.

### Future plans
- AI mentor and plugin ecosystem.
- Offline-first database.
- Backup and version history.

---

## 33. Prompt Templates

### Continue Development
`Continue development on GenAI Engineer OS by implementing the next feature in the roadmap using the repository architecture described in MASTER_BLUEPRINT.md.`

### Bug Fix
`Fix the bug in the repository using domain-driven design and the current architecture in MASTER_BLUEPRINT.md. Explain the change and update the blueprint if needed.`

### New Feature
`Add a new feature to GenAI Engineer OS. Use the feature-first architecture, register it in registry/features.ts, and document it in MASTER_BLUEPRINT.md.`

### Refactoring
`Refactor the specified code to align with the architecture and design system in MASTER_BLUEPRINT.md. Preserve behavior and improve maintainability.`

### Documentation
`Update MASTER_BLUEPRINT.md and docs/ to reflect the latest repository structure and architectural changes.`

### Testing
`Write tests for the new feature using the repository's testing strategy and update MASTER_BLUEPRINT.md to include testing requirements.`

### Performance
`Optimize the repository for performance according to the guidelines in MASTER_BLUEPRINT.md. Document tradeoffs and improvements.`

### Deployment
`Prepare the repository for deployment using the deployment standards in MASTER_BLUEPRINT.md. Document the deployment steps.`

---

## Auto Update Rules

This document is the canonical source of truth. When any of the following changes, update this file immediately:
- folder structure
- architecture
- new module
- new feature
- new page
- new component
- new database table
- new API
- new event
- new engine
- new state store
- new plugin
- new route
- new design token
- new coding standard
- roadmap changes
- release changes

### Minimum update requirements
- Folder Structure
- Architecture
- Progress
- Completed Features
- Current Phase
- Current Module
- Latest Changes
- Latest Features
- Change History

---

## 37. Session Handoff

This section is the single thing a fresh Claude session needs to read,
along with this whole file, to continue work with zero lost context.
Update it at the end of every file/batch — it is the last edit made
before a response ends, not an afterthought.

> **Correction notice (2026-08-06):** everything below this line was
> rewritten after this section was found to describe files
> (`Text.tsx`, `Heading.tsx`, a File-036 history, a Button→Icon→
> Spinner→... build order) that do not exist in the actual git
> history. The prior version of this section was internally
> plausible but fictional — it was never re-verified against the
> repository after being written. Treat any future Session Handoff
> content with the same suspicion until it's been checked against
> `git log` / the filesystem, not just read and trusted.

### Current Phase
Phase 2 — UI Foundation.

### Verified Repo State (via `git fetch` + `git log origin/main`, re-checked this session before writing anything)
`origin/main` still has exactly the same 3 commits as last session —
no new commits landed. `src/shared/ui/` now contains:
- `types.ts` — `Size = "sm" | "md" | "lg"`.
- `Button.tsx`, `Avatar.tsx`, `Divider.tsx` — pre-existing, still have
  the unpatched color-token bug (see Known Technical Debt).
- `Select.tsx` — added last session (unpushed to origin at time of
  writing; exists in the working tree this session was continued in).
- `Checkbox.tsx` — added this session.

**No** `Text.tsx`, `Heading.tsx`, `Icon.tsx`, `Spinner.tsx`,
`Badge.tsx`, `Card.tsx`, `Input.tsx`, `Textarea.tsx`, or `Label.tsx`
exist. `npx tsc --noEmit` and `npm run build` both pass clean as of
this session (verified, not assumed).

### On File Numbering
Unchanged from last session's note: the "047"/"048" labels assume a
much longer prior history than actually exists. Both `Select.tsx` and
`Checkbox.tsx` were still sound to build because they only depend on
`cn.ts` and `types.ts`, both real. The *next* numbered file
("049 Radio.tsx") may or may not have the same property — re-verify
against the repo, don't assume from the number.

### Last Completed File
`src/shared/ui/Modal.tsx` — accessible dialog window using React Portals,
framer-motion animation, strict focus management, scroll locking,
Escape-key dismissal, and defensive event propagation. Verified with
`tsc --noEmit` and `next build`.

### Next File To Build
Per the caller's stated build order, File 055 — `Drawer.tsx`. Not yet
started. Before building it: re-fetch and re-check `src/shared/ui/`
contents rather than trusting this document, as the repo may have changed
since the previous session.

### Pending Review Items
`Modal.tsx` is awaiting local build/lint verification and commit
before moving on to File 055.

### Known Technical Debt
- **Color token bug (found this session):** `Button.tsx` and
  `Avatar.tsx` use color class names (`bg-surface-secondary`,
  `text-primary`, `text-inverted`, `bg-danger`, `ring-offset-bg`)
  that don't match any utility `tailwind.config.ts` actually
  generates from its nested `colors` extension. Tailwind silently
  drops unrecognized class names rather than erroring, so
  `npm run build` passes while these render with no color styling in
  several states. `Select.tsx` uses the correct fully-qualified names
  (`bg-background-surface`, `text-text-primary`, `border-status-danger`,
  etc.) and does not copy the bug forward. `Checkbox.tsx` (this
  session) follows the same corrected convention. Button/Avatar are
  still NOT patched — flagged for a dedicated follow-up, not fixed
  inline, since instructions say patch only the file being worked on.
- `globals.css` CSS variables are manually duplicated from `colors.ts`
  rather than generated (see §35, "CSS Variable Build Step" — still
  applicable, not yet re-verified against the real `colors.ts`/
  `globals.css` pair this session).
- No automated tests exist for any token or component file.
- No `/app/dev/components` or playground showcase route exists.
- The prior Session Handoff's claims about `ThemeSwitcher.tsx`
  needing a restyle once `Button` exists (§35) have NOT been
  re-verified this session — `Button.tsx` does exist now, so that
  trigger condition may already be met, but the file itself wasn't
  inspected here.

### Required npm Packages
Already present in `package.json` and installed successfully this
session: `clsx`, `tailwind-merge`, `lucide-react`, plus the full
dependency list in §05. No new runtime dependency was added for
`Select.tsx`.

### Open Decisions Not Yet Implemented
- **Theme Registry** (§35): unchanged, not re-verified this session.
- **CSS Variable Build Step** (§35): unchanged, not re-verified this
  session.
- **Tailwind semantic-typography utility classes**: the previous
  handoff's claim that `Text`/`Heading` use inline styles for this
  reason is fictional — those files don't exist. Whether
  `tailwind.config.ts`'s `fontSize` extension covers semantic keys
  (`body`, `h2`, ...) or only raw scale keys (`xs`, `base`, ...)
  should be re-checked when `Text`/`Heading` are actually built.
- **Component maturity promotion** (§34): only real candidates today
  are `Button`, `Avatar`, `Divider`, `Select` — all still
  `Experimental`, none has a real feature consumer yet.

### How To Resume In A New Chat
1. Paste this `MASTER_BLUEPRINT.md` in full.
2. Give the actual GitHub repo URL (or upload the repo/relevant
   folder) so the assistant can clone and verify state directly —
   this document's Session Handoff has been wrong before and should
   not be trusted on its own for file-existence claims.
3. Say: "Continue GenAI Engineer OS. See §37 Session Handoff, but
   verify against the real repo before generating anything. Generate
   the next file only, then stop for review."

---

## Quality Commitment

This document is intended to be the highest-quality artifact in the repository. It must read like architecture documentation produced by a staff engineer at a top software company.

It must never be reduced to a summary. It must remain exhaustive, explicit, and up to date.