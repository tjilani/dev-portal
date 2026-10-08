# Current Feature: Add Pro Badge to Sidebar

Add a PRO badge to the Files and Images item types in the sidebar.

## Status

In Progress

## Goals

- Show a PRO badge next to the Files and Images item types in the sidebar
- Use the shadcn/ui Badge component (`src/components/ui/badge.tsx`)
- Keep the badge clean and subtle
- Display the label as all-uppercase "PRO"

## Notes

- Full spec: @context/features/add.-pro-badge-sidebar.md
- Badge component is already installed (also used in `src/components/dashboard/ItemCard.tsx`)
- Files and Images are the Pro-only system types (slugs `files` and `images`)
- Visual indicator only - no entitlement enforcement in this feature
- Hide the badge when the sidebar is collapsed to icons

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
