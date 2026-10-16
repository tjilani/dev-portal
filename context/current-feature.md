# Current Feature: Audit Quick Wins

Fix three quick wins from the code audit.

## Status

In Progress

## Goals

- Add a `getItemTypeIcon(name)` helper in `src/lib/item-type-icons.ts` that falls back to the `File` icon, and use it in `AppSidebar.tsx`, `CollectionCard.tsx` and `ItemCard.tsx`
- Remove the duplicated default limit parameters from `getRecentCollections`, `getSidebarCollections` and `getRecentItems`; keep the constants at the call sites
- Give the sidebar favorites query in `src/lib/db/collections.ts` a minimal `select: { id, name }` instead of loading all memberships

## Notes

- Source: @audit/audit-2026-10-15.md (Quick wins 1, 3 and 4)
- Keep `src/lib/mock-data.ts` unchanged - mock data stays
- No behavior or UI changes, except sidebar favorites are now sorted alphabetically by name

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
