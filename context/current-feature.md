# Current Feature: Auth Phase 1 - NextAuth + GitHub Provider

## Status

In Progress

## Goals

- Install NextAuth v5 (`next-auth@beta`) and `@auth/prisma-adapter`
- Split auth config for edge compatibility: `src/auth.config.ts` (providers only) and `src/auth.ts` (Prisma adapter + JWT strategy)
- GitHub OAuth provider
- `src/app/api/auth/[...nextauth]/route.ts` exports handlers from `auth.ts`
- `src/proxy.ts` protects `/dashboard/*` and redirects unauthenticated users to sign-in
- `src/types/next-auth.d.ts` extends Session type with `user.id`
- `/dashboard` redirects to sign-in, GitHub sign-in returns to `/dashboard`

## Notes

- Spec: `context/features/auth-phase-1-spec.md`
- Use Context7 to verify newest NextAuth v5 config and conventions
- Use `next-auth@beta`, not `@latest` (installs v4)
- Proxy file at `src/proxy.ts` (same level as `app/`), named export: `export const proxy = auth(...)`
- `session: { strategy: 'jwt' }` with split config pattern
- No custom `pages.signIn` - use NextAuth's default page
- Env vars: `AUTH_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`
- References: https://authjs.dev/getting-started/installation#edge-compatibility, https://authjs.dev/getting-started/adapters/prisma

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
- 2026-10-16: Type color CSS variable completed - typeColorStyle() sets --type-color, Tailwind classes replace six inline color styles, var() fallbacks for empty collections, coding-standards exception added
