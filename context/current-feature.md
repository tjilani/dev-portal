# Current Feature: Email Verification Toggle

## Status

In Progress

## Goals

- Add a server-only env variable `EMAIL_VERIFICATION_ENABLED`, read in one place (e.g. `src/lib/config.ts`) as a boolean constant
- Default is enabled; only the exact value `"false"` disables verification
- When disabled, registration skips token creation and email sending
- When disabled, credentials sign-in skips the `emailVerified` check
- Register response tells the form whether verification is required; the toast says "You can now sign in" when it isn't
- The Resend client is created lazily, so a missing `RESEND_API_KEY` doesn't break the app while verification is disabled
- Document the variable in `.env.example` (or README if no example file exists)

## Notes

- Why an env variable: one flag per environment (local vs Vercel), no migration or admin UI; changing it on Vercel needs a redeploy
- Alternatives considered: DB settings row (runtime toggle, but needs migration + admin UI), Vercel Edge Config / Flags SDK (no redeploy, but an extra service) - both too much for now
- Server-only (no `NEXT_PUBLIC_` prefix): every check runs on the server
- Default enabled = fail-safe: a missing or mistyped variable keeps verification on rather than silently turning it off
- Users registered while disabled keep `emailVerified = null`; if verification is enabled later they can verify via the existing resend button
- Resend verify route and resend button stay as they are; the button only appears when sign-in returns `needsVerification`, which can't happen while disabled

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
- 2026-10-20: Email verification completed - Resend helper in src/lib/email.ts, 24h tokens in VerificationToken via src/lib/db/verification-tokens.ts, GET /api/auth/verify-email sets emailVerified and redirects with toast, unverified credentials sign-in blocked via custom CredentialsSignin code, register rolls back user + token if sending fails (switch to keep-user when "resend" is added)
- 2026-10-20: Resend verification email completed - register keeps the user and returns emailSent (warning toast on failure), shared sendVerification() in src/lib/verification.ts, new tokens replace old ones, resendVerificationEmail server action with 60s cooldown derived from token expiry, ResendVerificationButton on sign-in form when needsVerification
