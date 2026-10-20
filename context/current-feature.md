# Current Feature: Forgot Password

## Status

In Progress

## Goals

- Add a "Forgot password?" link on the sign-in form leading to a new `/forgot-password` page
- `/forgot-password`: email form → `requestPasswordReset` server action that always returns the same generic message ("If an account exists, we've sent a reset link")
- Only users with a password (credentials accounts) get an email; GitHub-only accounts are skipped silently
- Reset tokens live in `VerificationToken` with identifier `password-reset:{email}`, expire after 1 hour, and replace any older reset token for that email
- Store reset tokens as a SHA-256 hash; only the email link contains the raw token
- Reuse the 60s cooldown so the reset form can't be used to spam emails
- `/reset-password?token=…` page: new password + confirm, validated with Zod (same rules as registration)
- `resetPassword` server action: checks token and expiry, updates the bcrypt hash, deletes the token, sets `emailVerified` if it was null, then redirects to `/sign-in` with a success toast
- Invalid or expired links show a clear message with a link back to `/forgot-password`

## Notes

- The `password-reset:` prefix keeps reset tokens separate from verification tokens: verification's `deleteMany` and cooldown only touch the plain email identifier, and `verifyEmailToken` must not accept reset tokens
- Token helpers in `src/lib/db/verification-tokens.ts` need a TTL parameter (24h verification vs 1h reset), and the cooldown must use the matching TTL
- Hashing: a reset token grants account takeover, so a leaked database must not expose usable tokens; SHA-256 (not bcrypt) is fine because the token is 32 random bytes
- Setting `emailVerified` on reset: clicking the link proves email ownership, and it stops users being blocked right after resetting
- Reset emails depend on Resend regardless of `EMAIL_VERIFICATION_ENABLED`; until a domain is linked they only reach the Resend account owner's email
- Limitation: JWT sessions can't be revoked, so sessions already signed in elsewhere stay valid after a reset
- `/forgot-password` and `/reset-password` are public: `src/proxy.ts` only matches `/dashboard/*`

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
- 2026-10-20: Email verification toggle completed - EMAIL_VERIFICATION_ENABLED in src/lib/config.ts (enabled unless exactly "false"), disabled skips token/email on register, emailVerified check on sign-in and resend action, register returns verificationRequired for the toast, Resend client created lazily, variable documented in README
