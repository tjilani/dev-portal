# Current Feature: Auth Phase 3 - Sign In, Register & Sign Out UI

## Status

In Progress

## Goals

- Custom `/sign-in` page: email + password fields, "Sign in with GitHub" button, link to register, validation and error display
- Custom `/register` page: name, email, password, confirm password; validates match + email format; submits to `/api/auth/register`; redirects to sign-in on success
- NextAuth uses the custom pages instead of its defaults
- Sidebar bottom shows the signed-in user's avatar and name (replacing mock user data)
- Reusable avatar component: GitHub `image` if present, otherwise initials from name ("Brad Traversy" → "BT")
- Clicking the sidebar user area opens a dropdown with "Profile" (links to `/profile`) and "Sign out"; sign out logs out and redirects

## Notes

- Spec: `context/features/auth-phase-3-spec.md`
- shadcn `avatar` already installed; dropdown menu component is not
- Reuse `registerSchema` / `signInSchema` from `src/lib/auth-schemas.ts`
- Decided: avatar in sidebar bottom only (spec Testing step 4 "top bar" is outdated)
- Decided: single dropdown with Profile + Sign out; `/profile` 404s until a profile feature is built

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
- 2026-10-19: Auth Phase 2 completed - Credentials provider with placeholder in auth.config.ts and bcrypt validation in auth.ts, Zod schemas in src/lib/auth-schemas.ts, POST /api/auth/register with duplicate/mismatch/length validation, GitHub OAuth unchanged
