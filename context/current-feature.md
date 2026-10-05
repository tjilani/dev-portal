# Current Feature

Dashboard Items - replace the mock item data in the dashboard main area (pinned and recent items) with real data from the Neon database via Prisma. Keep the current look.

## Status

completed

## Goals

- Create `src/lib/db/items.ts` with data fetching functions
- Fetch items directly in the server component
- Item card icon/border derived from the item type
- Display item tags and everything else currently on the card (reference @context/screenshots/dashboard-ui-main.png if needed)
- If there are no pinned items, the pinned section does not display at all
- Update stats display (items and favorite items from the database)

## Notes

- Full spec: @context/features/dashboard-items-spec.md
- The spec says "Update collection stats display"; collection stats were already moved in the previous feature, so this covers the item stats (Items, Favorite Items)
- No authentication yet - scope queries to the seeded demo user (demo@devstash.io), same as `src/lib/db/collections.ts`
- The seed has no pinned items, favorites or tags, so the pinned section will be hidden and tags empty until such data exists
- Sidebar still uses mock data - out of scope for this feature

## History

<!-- keep this updated. Earliest to latest -->

- 2026-10-05: Dashboard UI Phase 1 completed - shadcn/ui setup, dark mode default, /dashboard layout with top bar and sidebar/main placeholders
- 2026-10-05: Dashboard UI Phase 2 completed - collapsible shadcn sidebar with item types, favorite and recent collections, user area, mobile drawer
- 2026-10-05: Dashboard UI Phase 3 completed - main area with stats cards, recent collections, pinned and recent items; mock counts aligned with actual items
- 2026-10-05: Prisma + Neon setup completed - Prisma 7.10 with Neon adapter, initial schema with NextAuth models, init migration applied to dev branch
- 2026-10-05: Seed data completed - user password field migration, re-runnable prisma/seed.ts with demo user, 7 system item types, 5 collections, 18 items
- 2026-10-05: Dashboard collections completed - recent collection cards and collection stats loaded from Neon via src/lib/db/collections.ts, border color from most-used type
- 2026-10-05: Dashboard items completed - pinned/recent items and item stats loaded from Neon via src/lib/db/items.ts, pinned section hidden when empty, seed adds pinned and favorite items
