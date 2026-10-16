# Current Feature: System Item Type Unique Slug

Prevent duplicate system item types with the same slug.

## Status

In Progress

## Goals

- Add a partial unique index on `ItemType.slug` for system types (`userId IS NULL`)
- Declare it in `prisma/schema.prisma` (preview feature `partialIndexes`) so later migrations don't drop it
- Create and apply the change as a migration (`prisma migrate dev`), never `db push`

## Notes

- Source: @audit/audit-2026-10-15.md (Medium: `@@unique([userId, slug])` does not stop duplicate system item types)
- PostgreSQL treats NULLs as distinct in unique indexes, so `[userId, slug]` allows two system types with the same slug
- Dev DB checked before the migration: each system slug exists exactly once
- Keep the existing `@@unique([userId, slug])` for user-owned custom types

## History

<!-- keep this updated. Earliest to latest -->

- 2026-10-05: Dashboard UI Phase 1 completed - shadcn/ui setup, dark mode default, /dashboard layout with top bar and sidebar/main placeholders
- 2026-10-05: Dashboard UI Phase 2 completed - collapsible shadcn sidebar with item types, favorite and recent collections, user area, mobile drawer
- 2026-10-05: Dashboard UI Phase 3 completed - main area with stats cards, recent collections, pinned and recent items; mock counts aligned with actual items
- 2026-10-05: Prisma + Neon setup completed - Prisma 7.10 with Neon adapter, initial schema with NextAuth models, init migration applied to dev branch
- 2026-10-05: Seed data completed - user password field migration, re-runnable prisma/seed.ts with demo user, 7 system item types, 5 collections, 18 items
- 2026-10-05: Dashboard collections completed - recent collection cards and collection stats loaded from Neon via src/lib/db/collections.ts, border color from most-used type
- 2026-10-05: Dashboard items completed - pinned/recent items and item stats loaded from Neon via src/lib/db/items.ts, pinned section hidden when empty, seed adds pinned and favorite items
- 2026-10-06: Stats & sidebar completed - sidebar item types and favorite/recent collections loaded from Neon, colored circles for recents, "View all collections" link; user area stays on mock data
- 2026-10-08: Pro badge in sidebar completed - subtle outline PRO badge (shadcn Badge) on Files and Images item types, hidden when sidebar is collapsed
- 2026-10-16: Audit quick wins completed - icon fallback helper, removed duplicate limit defaults, minimal favorites select sorted by name, .editorconfig
