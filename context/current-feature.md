# Current Feature

Dashboard Collections - replace the mock collection data in the dashboard main area with real data from the Neon database via Prisma. Keep the current look with the 6 recent collection cards.

## Status

completed

## Goals

- Create `src/lib/db/collections.ts` with data fetching functions
- Fetch collections directly in the server component
- Collection card border color derived from the most-used content type in that collection
- Show small icons of all types in that collection
- Keep the current design (reference @context/screenshots/dashboard-ui-main.png if needed)
- Update collection stats display

## Notes

- Full spec: @context/features/dashboard-collections-spec.md
- Do not add the items underneath yet (pinned/recent items stay on mock data for now)
- No authentication yet - scope queries to the seeded demo user (demo@devstash.io) until auth is implemented
- Sidebar still uses mock data - out of scope for this feature

## History

<!-- keep this updated. Earliest to latest -->

- 2026-10-05: Dashboard UI Phase 1 completed - shadcn/ui setup, dark mode default, /dashboard layout with top bar and sidebar/main placeholders
- 2026-10-05: Dashboard UI Phase 2 completed - collapsible shadcn sidebar with item types, favorite and recent collections, user area, mobile drawer
- 2026-10-05: Dashboard UI Phase 3 completed - main area with stats cards, recent collections, pinned and recent items; mock counts aligned with actual items
- 2026-10-05: Prisma + Neon setup completed - Prisma 7.10 with Neon adapter, initial schema with NextAuth models, init migration applied to dev branch
- 2026-10-05: Seed data completed - user password field migration, re-runnable prisma/seed.ts with demo user, 7 system item types, 5 collections, 18 items
- 2026-10-05: Dashboard collections completed - recent collection cards and collection stats loaded from Neon via src/lib/db/collections.ts, border color from most-used type
