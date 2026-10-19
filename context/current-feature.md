# Current Feature: Auth Phase 2 - Email/Password Credentials Provider

## Status

In Progress

## Goals

- Credentials provider for email/password sign-in, hashed with bcryptjs (already installed)
- `User.password` field exists (already added by the seed-data migration - no new migration needed)
- `auth.config.ts`: Credentials provider placeholder with `authorize: () => null` (edge-safe)
- `auth.ts`: override Credentials provider with real bcrypt validation
- `POST /api/auth/register`: accepts name, email, password, confirmPassword; validates passwords match, rejects existing users, hashes password, creates user, returns success/error
- Sign-in with email/password at `/api/auth/signin` redirects to `/dashboard`
- GitHub OAuth still works

## Notes

- Spec: `context/features/auth-phase-2-spec.md`
- Split pattern: placeholder in `auth.config.ts` keeps bcrypt/Prisma out of the proxy; `auth.ts` replaces it
- Credentials provider requires JWT sessions - already set in Phase 1
- Coding standards require Zod for input validation - Zod is not installed yet
- Test registration via curl: `POST /api/auth/register` with JSON `{"name","email","password","confirmPassword"}`
- Reference: https://authjs.dev/getting-started/authentication/credentials

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
- 2026-10-18: Auth Phase 1 completed - NextAuth v5 beta with GitHub provider, split edge-safe config with Prisma adapter and JWT sessions, src/proxy.ts protects /dashboard/* via authorized callback, Session type extended with user.id
