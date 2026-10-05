# Current Feature

Seed Data - a seed script (`prisma/seed.ts`) that populates the database with sample data for development and demos.

## Status

completed

## Goals

- Demo user
  - Email: demo@devstash.io
  - Name: Demo User
  - Password: 12345678 (hash with bcryptjs, 12 rounds)
  - isPro: false
  - emailVerified: current date
- System item types (all `isSystem: true`, icons are Lucide React component names)

  | Name    | Icon       | Color   |
  | ------- | ---------- | ------- |
  | snippet | Code       | #3b82f6 |
  | prompt  | Sparkles   | #8b5cf6 |
  | command | Terminal   | #f97316 |
  | note    | StickyNote | #fde047 |
  | file    | File       | #6b7280 |
  | image   | Image      | #ec4899 |
  | link    | Link       | #10b981 |

- Collections and items for the demo user
  - **React Patterns** (Reusable React patterns and hooks): 3 TypeScript snippets - custom hooks (useDebounce, useLocalStorage, etc.), component patterns (context providers, compound components), utility functions
  - **AI Workflows** (AI prompts and workflow automations): 3 prompts - code review, documentation generation, refactoring assistance
  - **DevOps** (Infrastructure and deployment resources): 1 snippet (Docker, CI/CD config), 1 command (deployment scripts), 2 links (real documentation URLs)
  - **Terminal Commands** (Useful shell commands for everyday development): 4 commands - git operations, Docker commands, process management, package manager utilities
  - **Design Resources** (UI/UX resources and references): 4 links (real URLs) - CSS/Tailwind references, component libraries, design systems, icon libraries

## Notes

- Full spec: @context/features/seed-spec.md
- The User model has no password field yet - adding it requires a new migration (`prisma migrate dev`), never `db push`
- Prisma 7 no longer seeds automatically - configure `migrations.seed` in `prisma.config.ts` and run `prisma db seed` explicitly
- Seed should be re-runnable (upserts) so it can be executed more than once on the dev branch
- The spec uses singular type names (snippet, prompt, ...); slugs are plural (snippets, prompts, ...) to match the /items/{slug} routes

## History

<!-- keep this updated. Earliest to latest -->

- 2026-10-05: Dashboard UI Phase 1 completed - shadcn/ui setup, dark mode default, /dashboard layout with top bar and sidebar/main placeholders
- 2026-10-05: Dashboard UI Phase 2 completed - collapsible shadcn sidebar with item types, favorite and recent collections, user area, mobile drawer
- 2026-10-05: Dashboard UI Phase 3 completed - main area with stats cards, recent collections, pinned and recent items; mock counts aligned with actual items
- 2026-10-05: Prisma + Neon setup completed - Prisma 7.10 with Neon adapter, initial schema with NextAuth models, init migration applied to dev branch
- 2026-10-05: Seed data completed - user password field migration, re-runnable prisma/seed.ts with demo user, 7 system item types, 5 collections, 18 items
