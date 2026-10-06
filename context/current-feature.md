# Current Feature

Stats & Sidebar - show the main area stats and the sidebar (system item types and collections) from the Neon database instead of @src/lib/mock-data.ts.

## Status

completed

## Goals

- Display stats pertaining to database data, keeping the current design/layout
- Display system item types in the sidebar with their icons, linking to /items/[typename]
- Add a "View all collections" link under the collections list that goes to /collections
- Keep the star icons for favorite collections; for recent collections, show a colored circle based on the most-used item type in that collection
- Add the database functions to @src/lib/db/items.ts (use @src/lib/db/collections.ts for reference)

## Notes

- Full spec: @context/features/stats-sidebar-spec.md
- The main area stats already come from the database (done in the dashboard collections/items features) - verify only
- `src/lib/db/items.ts` already exists - extend it rather than create it
- Item type links use the plural slug (/items/snippets), matching the seed
- No authentication yet - scope queries to the seeded demo user via `src/lib/db/demo-user.ts`
- Keep `src/lib/mock-data.ts` for now - the sidebar user area stays on mock data (`currentUser`) until auth is implemented

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
