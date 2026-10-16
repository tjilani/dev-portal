# Current Feature: Type Color CSS Variable

Replace inline color styles with a CSS variable and Tailwind classes.

## Status

In Progress

## Goals

- Add one helper in `src/lib/` that turns a DB color into `{ "--type-color": color }` as `CSSProperties`
- Replace the six inline color styles with the helper plus Tailwind classes (`text-(--type-color)`, `bg-(--type-color)`, `border-l-(--type-color)`):
  - `AppSidebar.tsx`: item type icon, recent collection dot
  - `CollectionCard.tsx`: card left border, type icons
  - `ItemCard.tsx`: card left border, type icon
- Add an exception to "No inline styles" in `context/coding-standards.md`: setting a CSS variable from database data is allowed

## Notes

- Source: @audit/audit-2026-10-15.md (Low: Inline styles for type colors)
- Colors come from the DB (`ItemType.color`), so they can't be static Tailwind classes; this also works for future custom types
- Keep fallbacks: recent collection dot stays `bg-muted-foreground` and the collection card border stays default when a collection has no items
- No visual changes

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
- 2026-10-16: System item type unique slug completed - partial unique index on ItemType.slug where userId IS NULL (preview feature partialIndexes), migration applied to dev branch
