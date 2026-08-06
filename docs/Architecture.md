# Architecture

GenAI Engineer OS is designed with a clean layered architecture:

- `src/app/` - Next.js App Router pages and layouts
- `src/features/` - Business modules and feature-specific code
- `src/shared/` - Cross-cutting reusable utilities, hooks, and UI
- `src/entities/` - Domain models and value objects
- `src/widgets/` - Larger UI compositions built from shared components
- `src/services/` - Business logic and API integration
- `src/infrastructure/` - Database, auth, and storage adapters
- `src/lib/` - General-purpose utilities
- `src/config/` - Runtime configuration and environment helpers
- `src/hooks/` - Application hooks
- `src/store/` - Global state management
- `src/styles/` - Design tokens and style primitives
- `src/assets/` - Static assets
- `src/types/` - Shared TypeScript types
