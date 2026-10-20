# Current Feature: Email Verification on Register

## Status

In Progress

## Goals

- Install `resend` and add a small email helper in `src/lib/` that reads `RESEND_API_KEY`
- On successful registration, create a random token in the existing `VerificationToken` table (identifier = email, 24h expiry) and send a verification email with a link
- Add a verification route that validates the token, sets `User.emailVerified`, deletes the token and redirects to /sign-in with a toast
- Block credentials sign-in for users whose `emailVerified` is null, with a clear "verify your email" message
- After registration, show a toast telling the user to check their email (replaces "You can now sign in")
- Show an error for invalid or expired links

## Notes

- No schema migration needed: `User.emailVerified` and `VerificationToken` already exist (NextAuth models)
- GitHub OAuth sign-in is unaffected; only the Credentials provider checks `emailVerified`
- Seed demo user must have `emailVerified` set so it can still sign in
- Build the link from the request origin, so it works locally and on Vercel
- Sender: Resend's `onboarding@resend.dev` only delivers to the Resend account owner's email until a domain is verified
- `RESEND_API_KEY` must also be added to Vercel (as Sensitive) before deploying

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
- 2026-10-19: Auth Phase 3 completed - custom /sign-in (useActionState server action, GitHub button) and /register (client Zod validation, redirect with success notice) pages, NextAuth pages.signIn, sidebar NavUser dropdown with Profile + Sign out, UserAvatar with GitHub image or initials, mock currentUser removed, .playwright-mcp gitignored
- 2026-10-19: Registration toast completed - shadcn Sonner Toaster (dark theme) in root layout, success toast after registration, inline sign-in notice and ?registered=1 param removed
