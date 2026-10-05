# Current Feature

Prisma + Neon PostgreSQL Setup - set up Prisma 7 ORM with a serverless Neon PostgreSQL database and the initial schema.

## Status

completed

## Goals

- Use Neon PostgreSQL (serverless)
- Create initial schema based on data models in @context/project-overview.md (this will evolve)
- Include NextAuth models (Account, Session, VerificationToken)
- Add appropriate indexes and cascade deletes

## Notes

- Full spec: @context/features/database-spec.md
- References: @context/project-overview.md (data models), @context/coding-standards.md (database standards), https://prisma.io/docs
- Use Prisma 7, which has breaking changes. Read the upgrade guide first: https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7
- Setup guide: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
- DATABASE_URL points to the Neon development branch; a separate production branch exists
- ALWAYS create migrations (`prisma migrate dev`); never use `db push` unless specified

## History

<!-- keep this updated. Earliest to latest -->

- 2026-10-05: Dashboard UI Phase 1 completed - shadcn/ui setup, dark mode default, /dashboard layout with top bar and sidebar/main placeholders
- 2026-10-05: Dashboard UI Phase 2 completed - collapsible shadcn sidebar with item types, favorite and recent collections, user area, mobile drawer
- 2026-10-05: Dashboard UI Phase 3 completed - main area with stats cards, recent collections, pinned and recent items; mock counts aligned with actual items
- 2026-10-05: Prisma + Neon setup completed - Prisma 7.10 with Neon adapter, initial schema with NextAuth models, init migration applied to dev branch
