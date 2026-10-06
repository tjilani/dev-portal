# Dev Master View: a junior fullstack developer's walkthrough

This tutorial introduces the code that exists in this repository as of October 6, 2026. Read it with your editor open and follow the linked files. You should know basic JavaScript, HTML, and CSS; React and database concepts are explained as they appear.

By the end, you should be able to trace a dashboard request from the browser to PostgreSQL and back, explain the main architectural choices, and identify where to add a small feature.

## 1. Understand the product and its current state

Dev Master View is a personal developer knowledge hub. An **item** holds reusable knowledge, such as a snippet, command, prompt, note, or link. **Collections** group items; **tags** provide another way to organize them. Favorites mark useful resources, while pins make items prominent on the dashboard.

Start with [the project overview](../context/project-overview.md), but treat it as the product roadmap. It describes substantially more functionality than the application currently implements. [The current feature and history](../context/current-feature.md) explain how the project has progressed from mock UI to database-backed dashboard sections.

| Area | What exists today |
| --- | --- |
| `/` | A heading, not a redirect to the dashboard |
| `/dashboard` | Database-backed statistics, collections, pinned items, and recently updated items |
| Sidebar | Database-backed system types and collections; mock user identity |
| Responsive shell | Collapsible desktop sidebar and mobile drawer |
| Search and New Item | Visual controls without application handlers; the displayed Ctrl K hint is not wired up |
| Item cards | Read-only summaries; no item drawer or editing flow |
| Collection, item-type, and settings links | Links exist, but their destination pages are not implemented |
| Authentication | Database models and a demo password hash exist; sign-in and session enforcement do not |
| Tags | Schema, query mapping, and display support exist; the seed does not create tags |
| Uploads, billing, AI, export | Planned; related schema fields are not complete integrations |

Expect unimplemented navigation targets to return a 404. The mobile sidebar drawer is implemented; the planned item drawer is a different feature.

## 2. Get the application running

Use a Node.js version supported by the installed Next.js package and run commands from the repository root. The dependency versions in [package.json](../package.json) include Next.js 16.3.8, React 19.2.8, Prisma 7.10, TypeScript 5, and Tailwind CSS 4. These are this project's versions, not a claim about the latest releases.

```sh
npm install
```

The `postinstall` script runs `prisma generate`. Prisma generates TypeScript code from the schema into `src/generated/prisma`; that directory is ignored by Git. Generated files are build artifacts, so edit the schema rather than modifying the generated client.

Create a local `.env` file with a connection string supplied for a dedicated development Neon database or branch:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"
```

Keep actual credentials local. `.gitignore` excludes `.env*`. [prisma.config.ts](../prisma.config.ts) loads environment variables with `dotenv/config` for Prisma CLI operations; the standalone seed and database check scripts also load dotenv. Next.js loads environment files when running the app.

With the development database configured, inspect and apply the committed migrations:

```sh
npx prisma migrate status
npx prisma migrate deploy
npx prisma generate
```

An initial status check may report pending migrations. `migrate deploy` applies existing migration files; it does not create a new migration. For a schema change you make yourself, use `npx prisma migrate dev --name descriptive_change`, review the generated SQL, and commit the schema and migration together when authorized. The repository explicitly prohibits using `prisma db push` for schema changes.

Populate the demo dataset only in a disposable development database:

```sh
npx prisma db seed
npm run db:test
npm run dev
```

**Seeding resets the demo user's collections and items.** It is repeatable, but it is not a harmless merge with existing demo content. It also updates the demo user and system types. The seed creates seven system types, five collections, and eighteen items. File and image types exist, but there are no seeded uploads.

Open `http://localhost:3000/dashboard`. Visiting `/` only shows the home heading. `npm run db:test` performs a connectivity query and prints database counts and relationships; it is a diagnostic script, not an automated assertion suite.

Useful checks when changing application code:

```sh
npm run lint
npm run build
```

`npm run start` serves an already built production application. A successful build does not prove authentication, future routes, or database permissions work; check the behavior you changed in the browser too.

## 3. Learn the repository map

```text
src/
  app/                    Routes, layouts, and global CSS
    page.tsx              Home route
    layout.tsx            Root HTML document and shared provider
    dashboard/
      layout.tsx          Dashboard shell
      page.tsx            Dashboard data loading and composition
  components/
    dashboard/            Product-specific UI
    ui/                   Reusable shadcn/Base UI primitives
  hooks/                  Browser-side reusable React logic
  lib/
    prisma.ts             Database client construction
    db/                   Dashboard queries and data transformations
    item-type-icons.ts    Stored icon names mapped to React components
    mock-data.ts          Earlier fixtures; user identity still uses these
  types/                  Data contracts consumed by the UI
  generated/prisma/       Generated locally; ignored by Git
prisma/
  schema.prisma           Database model
  migrations/             Versioned SQL changes
  seed.ts                 Demo data creation
  test-db.ts              Database inspection script
context/                  Product plans, conventions, and feature history
```

The `@/` import prefix means `src/`, as configured in [tsconfig.json](../tsconfig.json). For example, `@/lib/prisma` resolves to `src/lib/prisma.ts`. TypeScript strict mode helps catch missing values and incompatible data shapes before runtime.

**Architectural choice:** this is one fullstack Next.js application. UI rendering and database access live in one codebase, with query functions separated from visual components. This is enough structure for the current scope without introducing a separate backend service.

**Alternative:** a React frontend plus an independent REST backend would create an explicit HTTP boundary and could serve other clients. It would also require separate deployment, request contracts, and authentication plumbing. That extra boundary is useful when there is a real second client or independent backend team.

## 4. Follow a dashboard request

```mermaid
flowchart TD
    Browser[Browser requests /dashboard] --> Root[src/app/layout.tsx]
    Root --> Shell[src/app/dashboard/layout.tsx]
    Shell --> Page[DashboardPage]
    Shell --> Sidebar[AppSidebar]
    Page --> Queries[src/lib/db queries]
    Sidebar --> Queries
    Queries --> Client[Prisma client with Neon adapter]
    Client --> DB[(PostgreSQL on Neon)]
    DB --> Queries
    Queries --> Models[Dashboard data contracts]
    Models --> UI[Cards and navigation rendered on server]
    UI --> Browser
    Shell --> Interactive[Client sidebar controls hydrate in browser]
```

Read [the root layout](../src/app/layout.tsx), [dashboard layout](../src/app/dashboard/layout.tsx), and [dashboard page](../src/app/dashboard/page.tsx) in that order.

### Routes and nested layouts

In the App Router, a `page.tsx` exposes a route. A `layout.tsx` wraps pages below its folder. The root layout sets metadata, imports global CSS, loads Geist fonts, adds the `dark` class, and supplies the tooltip provider.

The dashboard layout creates the shared shell:

```tsx
export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <TopBar />
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

`children` is the page content inserted into the shell. `LayoutProps` is a Next.js-generated global type; it is not a missing import. Next generates these helpers during `next dev`, `next build`, or `next typegen`.

Notice a future routing decision: `/collections` and `/items/...` would sit outside the `/dashboard` folder, so they would not automatically inherit this dashboard layout. A route group with a shared layout, or a reusable shell used by several layouts, could provide the same navigation across those future pages. Route groups organize files without adding a URL segment.

### Server Components and Client Components

Pages and layouts are Server Components by default. `DashboardPage` and `AppSidebar` can be asynchronous and call database functions directly. They have no `"use client"` directive.

[The sidebar primitive](../src/components/ui/sidebar.tsx) uses `"use client"` because it needs React state, effects, context, keyboard events, and browser APIs. Its JavaScript runs in the browser to make the server-rendered shell interactive; this process is called hydration.

A Client Component provider can receive server-rendered components through `children`. Wrapping the dashboard in `SidebarProvider` does not turn the database-loading page and sidebar into browser-side database code. However, modules imported by a Client Component enter its client dependency graph. Keep Prisma imports out of that graph.

**Alternative:** fetching everything in a client `useEffect` would require an endpoint plus loading and error state after the browser starts running JavaScript. Direct server fetching fits this read-only dashboard. Client fetching becomes useful for polling or highly interactive data views.

The repository's [AGENTS.md](../AGENTS.md) requires reading the installed Next.js guides before writing code. Relevant guides for this walkthrough are `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md` and `05-server-and-client-components.md`. Use this installed documentation when extending the app, especially for version-sensitive conventions.

### Fetch independent data concurrently

The page's key orchestration code is:

```tsx
export const dynamic = "force-dynamic";

const [recentCollections, collectionStats, pinnedItems, recentItems, itemStats] = await Promise.all([
  getRecentCollections(RECENT_COLLECTIONS_LIMIT),
  getCollectionStats(),
  getPinnedItems(),
  getRecentItems(RECENT_ITEMS_LIMIT),
  getItemStats(),
]);
```

`force-dynamic` requests dynamic rendering rather than a static dashboard snapshot. `Promise.all` starts independent operations together and waits for all results, avoiding a sequence of unnecessary waits. It does not turn the queries into one SQL statement or a consistent database transaction. If one operation fails, the awaited group rejects.

**Tradeoff:** the current page waits for all its data and has no custom `loading.tsx` or `error.tsx`. Streaming sections with Suspense could reveal fast sections sooner. A single database transaction could provide a consistent snapshot when required. Neither is necessary just to display this small demo, but both solve specific problems as the app grows.

## 5. Understand the database model

Read [schema.prisma](../prisma/schema.prisma). Prisma is an ORM: it provides typed JavaScript/TypeScript operations for relational database records.

| Model | Purpose |
| --- | --- |
| `User` | Owns knowledge and stores future account/billing fields |
| `Item` | Content, metadata, owner, type, favorites, pins, timestamps |
| `ItemType` | Type name, route slug, icon, color, and system/custom ownership |
| `Collection` | Named group owned by a user, with an optional default type |
| `ItemCollection` | Membership between an item and a collection |
| `Tag` / `ItemTag` | User-owned tags and item/tag membership |
| `Account`, `Session`, `VerificationToken` | Foundation for planned authentication |

`String?` means a nullable field. `@default(cuid())` generates an identifier, `@default(now())` sets a creation timestamp, and `@updatedAt` maintains the row's update timestamp through Prisma writes. A relation pairs a foreign-key field such as `userId` with an object field such as `user`.

### One Item model, several content forms

`contentKind` distinguishes `TEXT`, `URL`, and `FILE`, while `itemTypeId` describes the product category. A snippet and a prompt both use text storage but have different identities in the UI.

**Choice:** one table provides common ownership, sorting, favorites, and relationships for every item type. Optional fields accommodate different content forms.

**Alternative:** separate snippet/link/file tables would express type-specific requirements more strongly, but a mixed dashboard would need to combine several models. A JSON payload would allow flexible custom content, but would make validation and querying less straightforward.

**Current limit:** nullable fields do not enforce rules such as “a URL item needs a URL.” Future mutations must validate the content kind and required fields; the schema alone does not guarantee them. Zod validation is a repository convention, but Zod and mutation actions are not implemented here yet.

### Explicit many-to-many relationships

An item can belong to several collections, and each collection can contain many items. The join model represents each membership:

```prisma
model ItemCollection {
  itemId       String
  collectionId String
  addedAt      DateTime @default(now())

  item       Item       @relation(fields: [itemId], references: [id], onDelete: Cascade)
  collection Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([itemId, collectionId])
  @@index([collectionId, addedAt])
}
```

The composite primary key prevents duplicate membership pairs. Deleting a collection deletes its membership rows, while its items remain. Deleting an item deletes its membership rows too. Deleting a user cascades to their owned records. A collection's deleted default type instead becomes null through `onDelete: SetNull`.

**Alternative:** an implicit many-to-many relation requires less schema code, but an explicit model allows membership metadata such as `addedAt`. Putting only one `collectionId` on an item would prevent membership in multiple collections.

Indexes such as `[userId, updatedAt]` support common ownership-and-order queries. Indexes improve suitable reads but consume storage and add write overhead; choose them around actual queries.

Two future invariants deserve attention: foreign keys do not prove that an item and its assigned collection have the same owner, and user-scoped tag uniqueness does not normalize letter case. Validate these rules when implementing writes.

### Migrations preserve database history

The migration folder records the initial schema and a later nullable user password field. The schema expresses the desired model; migration SQL records how an existing database reaches it. Keeping both provides a reviewable upgrade path for development and production databases.

## 6. Connect Prisma to Neon

[src/lib/prisma.ts](../src/lib/prisma.ts) creates the runtime client:

```ts
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

The Neon adapter connects the generated Prisma client to the hosted PostgreSQL database. Prisma CLI connection configuration lives separately in `prisma.config.ts`; supplying that configuration does not replace the runtime adapter.

The global variable reuses a client during development hot reloads. `??` creates one only when there is no existing client. The TypeScript assertion describes an extra property on `globalThis`; it does not validate anything at runtime. Production uses normal module-level reuse rather than assigning the development global.

**Alternatives:** raw SQL gives precise query control but requires more manual mapping and typing. Another ORM could offer a different abstraction. A local PostgreSQL instance could replace the hosted database for development, but the runtime adapter would need to match that setup.

## 7. Turn database rows into UI data

The query modules in [items.ts](../src/lib/db/items.ts) and [collections.ts](../src/lib/db/collections.ts) act as a small data access layer. They choose records, request fields, and reshape relationships. Cards receive the results without knowing how they were retrieved.

### Temporary demo ownership

[demo-user.ts](../src/lib/db/demo-user.ts) defines:

```ts
export const DEMO_USER_EMAIL = "demo@devstash.io";
export const DEMO_USER_FILTER = { user: { email: DEMO_USER_EMAIL } };
```

Queries use this relation filter to select records belonging to the seeded user. This makes the prototype predictable, but it is **not authentication**: every visitor sees the same demo data. The sidebar footer shows the mock John Doe identity independently of the database owner.

Once authentication exists, derive ownership from a verified server session and apply it to every read and mutation. Do not trust an owner ID supplied by the browser. Also note that `findCollections` spreads its caller-provided `where` after the demo filter; future generalization should prevent a caller from accidentally overriding required ownership constraints.

### Select only the dashboard fields

The item query defines a shared projection:

```ts
const DASHBOARD_ITEM_SELECT = {
  id: true,
  title: true,
  description: true,
  isPinned: true,
  isFavorite: true,
  updatedAt: true,
  itemType: { select: { name: true, icon: true, color: true } },
  tags: { select: { tag: { select: { name: true } } } },
} satisfies Prisma.ItemSelect;

type ItemRow = Prisma.ItemGetPayload<{ select: typeof DASHBOARD_ITEM_SELECT }>;
```

`select` requests fields needed by the cards rather than loading full snippet content or files. `satisfies` checks that the selection is valid while retaining its precise inferred shape. `ItemGetPayload` derives the returned row type from that selection, avoiding a manually maintained database response type.

The join rows are flattened before reaching the UI:

```ts
function toDashboardItem({ tags, ...item }: ItemRow): DashboardItem {
  return { ...item, tags: tags.map(({ tag }) => tag.name) };
}
```

Object destructuring separates `tags` from the other fields. `map` transforms nested membership objects into a simple `string[]`. [DashboardItem](../src/types/item.ts) is the UI contract: a smaller, presentation-oriented shape than the database model.

**Alternative:** passing Prisma objects directly to every card would save mapping code initially, but would couple the UI to database relations and make data-source changes harder. Explicit view types keep the boundary understandable.

### Define what “recent” means

`getRecentItems` orders by `updatedAt` descending and applies `take: limit`; the page requests ten items. This means **recently updated**, not recently accessed. `lastAccessedAt` exists in the schema but is unused by this flow. Pinned items are loaded separately with no limit, ordered by update time. A pinned item can also appear in Recent Items because that query does not exclude pins.

Collection recency also uses the collection row's `updatedAt`. Updating an item or join row does not automatically update its parent collection timestamp. If the product later defines recency as “activity anywhere inside a collection,” that requires additional logic.

### Derive collection appearance from its contents

The collection query loads membership rows with their item types and groups them:

```ts
const types = new Map<string, CollectionItemType>();
for (const { item } of items) {
  const type = types.get(item.itemType.id) ?? { ...item.itemType, count: 0 };
  type.count++;
  types.set(type.id, type);
}
```

A `Map` stores one entry per type ID. Each membership increments that type's count. The return value includes `itemCount: items.length` and types sorted by count descending. Cards and recent sidebar entries use the first type's color, so a collection's accent communicates its most common content category. There is no explicit tie-breaking rule for equally common types.

Favorite collections are queried separately from recent **non-favorite** collections, avoiding duplicate entries between those sidebar groups. Favorites have no query limit; recent non-favorites are limited to five. The main dashboard independently asks for six recent collections.

**Tradeoff:** grouping memberships in JavaScript is easy to follow for small collections. Large collections could benefit from database aggregation, narrower sidebar-specific queries, and pagination. The current query returns all collection scalar fields before mapping them; item queries use a tighter projection. Keep optimizations tied to measured needs.

The sidebar type query uses Prisma's filtered `_count` to count only demo-user items while returning all system types, including types with zero items. Statistics use database `count` operations rather than downloading every item simply to count it.

## 8. Read the UI as a composition of small pieces

[StatsCard](../src/components/dashboard/StatsCard.tsx) displays a label, value, and Lucide icon. [ItemCard](../src/components/dashboard/ItemCard.tsx) displays a typed summary, optional tags, pin/favorite indicators, and an update date. [CollectionCard](../src/components/dashboard/CollectionCard.tsx) displays membership counts and links to the planned detail route.

The page handles querying and section composition; these cards handle presentation. Stable IDs are used as React list keys so React can track records between renders. The statistics array uses unique labels as keys.

The pinned section is conditional:

```tsx
{pinnedItems.length > 0 && (
  <section className="flex flex-col gap-4">
    {/* The actual page renders its heading and ItemCard list here. */}
  </section>
)}
```

This excerpt abbreviates the section body. With no pinned items, the entire section disappears. Other dashboard lists currently do not provide explicit empty-state messages.

Item dates use `toLocaleDateString("en-US", ...)` with `timeZone: "UTC"`, producing stable month/day display rather than depending on the server's local timezone. A future user-local date preference would be a separate product choice.

### Icons are data mapped to components

[item-type-icons.ts](../src/lib/item-type-icons.ts) maps strings such as `Code` and `Terminal` to imported Lucide components. The database stores an icon name, not a React component. A card looks it up and renders `<Icon />`.

**Choice:** one map ensures cards and sidebar use the same icons. **Alternative:** switch statements in each component would repeat the mapping; storing arbitrary SVG markup would require a different rendering and validation strategy. The current map assumes stored names are recognized, so a new seeded/custom icon needs a corresponding supported mapping. `Record<string, LucideIcon>` does not guarantee that every runtime database string exists in the map.

### Design tokens and responsive layout

[globals.css](../src/app/globals.css) imports Tailwind CSS 4 and defines semantic tokens such as background, foreground, muted text, and sidebar colors. `@theme inline` connects CSS variables to utilities such as `bg-background`. `.dark` supplies dark values, and the root layout activates it. Light values exist, but there is no theme toggle yet.

**Choice:** semantic tokens let components refer to a role such as muted text rather than repeat literal colors. A palette change can happen centrally. **Alternative:** hardcoded colors are quick initially but spread visual decisions across files. This project uses CSS-based Tailwind configuration; do not introduce a Tailwind v3-style JavaScript config.

Read the collection grid as an example:

```tsx
<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
```

It uses one column by default, two at the `sm` breakpoint, and three at `xl`. `max-w-7xl` keeps dashboard content readable on wide screens. `min-w-0` and `truncate` allow long titles to shrink inside flex layouts rather than forcing overflow.

Database-defined type colors are applied through inline styles. Although the coding standards say to avoid inline styles, the current code uses them for runtime color values. Treat this as an existing implementation exception, not as the general styling rule.

### Shared UI primitives and browser state

The `components/ui` folder contains locally owned shadcn component source, configured in [components.json](../components.json) with the `base-nova` style. This implementation uses Base UI primitives. Follow the APIs in the checked-in components rather than copying older Radix-based examples.

For instance, sidebar links use component composition:

```tsx
<SidebarMenuButton tooltip={type.slug} render={<Link href={`/items/${type.slug}`} />}>
  <Icon style={{ color: type.color }} />
  <span className="capitalize">{type.slug}</span>
</SidebarMenuButton>
```

The `render` prop combines the sidebar button behavior and appearance with a Next.js link. It avoids inventing a separate navigation button API.

The sidebar provider shares expanded/collapsed state through React context, maintains separate mobile-open state, and implements Ctrl/Cmd B. It writes a sidebar-state cookie, but the dashboard layout does not read that cookie to initialize `defaultOpen`, so writing it does not currently restore the choice across a full reload.

[use-mobile.ts](../src/hooks/use-mobile.ts) subscribes to a browser media query through `useSyncExternalStore`. Below 768px it reports mobile mode; its server snapshot returns false because `window` does not exist on the server. The sidebar then uses a Sheet for mobile navigation.

**Alternative:** a custom sidebar could be smaller, but would require maintaining drawer behavior, focus handling, keyboard controls, and accessibility details. Using existing primitives provides those building blocks while keeping product-specific fetching in `AppSidebar`.

## 9. Understand the seed as backend code

[seed.ts](../prisma/seed.ts) is useful beyond setup: it demonstrates typed fixtures, lookup maps, hashing, and nested relational writes.

1. `seedItemTypes` finds global types by slug and null owner, then updates or creates them.
2. `seedDemoUser` hashes the demonstration password with bcrypt and upserts by unique email.
3. `seedCollections` deletes that user's existing collections and items, then recreates the fixture graph.
4. The script reports its work and disconnects Prisma in `finally`.

System types have `userId: null`. PostgreSQL's normal nullable unique semantics mean `@@unique([userId, slug])` does not prevent duplicate global slugs with null owners. The seed's lookup avoids routine duplicates in a sequential run, but it is not a database guarantee against concurrent writers.

Here is an abbreviated nested-write shape from the seed:

```ts
items: {
  create: collection.items.map(({ type, ...item }) => ({
    item: {
      create: {
        ...item,
        contentKind: item.url ? "URL" : "TEXT",
        user: { connect: { id: userId } },
        itemType: { connect: { id: typeIds.get(type)! } },
      },
    },
  })),
},
```

Inside a collection create, this creates membership rows and their items while connecting each item to an existing user and type. `connect` references an existing record; `create` inserts a new one. The `!` is a TypeScript non-null assertion: the author assumes every fixture type exists in `typeIds`. It does not check that assumption at runtime, so user-controlled input would require validation.

Each nested collection creation is atomic, but the complete delete-and-recreate seed is not wrapped in one transaction. A failure can therefore leave a partially reset dataset. This is another reason to use a disposable development database. A transaction or stable per-record upserts would be alternatives if preserving existing data became a requirement.

The seeded password is a development fixture, not a working login feature. Password hashing demonstrates storage preparation; authentication still needs server-side verification and session handling.

## 10. Practice making a focused change

Start with a reversible read-only exercise: change the recent-item limit from ten to five.

1. Find `RECENT_ITEMS_LIMIT` in `src/app/dashboard/page.tsx`.
2. Follow its argument into `getRecentItems`, then into Prisma's `take` option.
3. Change the page constant to five.
4. Run the app against the seeded development database and count the Recent Items cards.
5. Confirm statistics still describe all demo-user items and the pinned list is independent.
6. Run lint and build, then revert the exercise if it is not an intended product change.

This traces a feature through page orchestration, the query layer, and rendering without introducing unnecessary abstractions.

Next, consider adding a useful empty message for Recent Items. The query already returns an array, so that change belongs in page presentation rather than in the database schema. Test both an empty result and the ordinary populated case.

For a future item-creation feature, work across the layers deliberately:

| Layer | Responsibility |
| --- | --- |
| Client drawer/form | Inputs, interaction, pending state, and visible validation feedback |
| Server Action | Verified session, input validation, ownership, and mutation result |
| Database operation | Persist the item and valid same-owner relationships atomically where needed |
| Refresh strategy | Update lists and statistics after success |
| Verification | Invalid input, save failure, success, and attempts to access another user's data |

The conventions recommend Server Actions for simple mutations and Route Handlers for webhooks or externally consumed HTTP endpoints. Actions, validation, and refresh behavior are future work, so do not assume there is an existing CRUD API to call. Before implementing them, read the installed Next.js action documentation and agree on the product behavior described in `context/`.

## 11. Keep the project understandable as it grows

Read [coding standards](../context/coding-standards.md) and [workflow guidance](../context/ai-interaction.md) before contributing. Prefer focused components, strict types, server-side data access, CSS-based themes, migration-backed database changes, and small changes consistent with the existing structure.

The most valuable future checks are behavioral: an authenticated user cannot read or mutate another user's content; invalid content kinds cannot be saved; collection membership cannot cross owners; deleting a collection preserves items; and successful mutations refresh the relevant UI. The repository does not yet contain a unit or browser test suite.

When assessing a proposed architecture, ask what concrete problem it solves. A separate API, caching layer, client state library, or search service can be useful later, but the current dashboard works with a small set of server queries and presentation components. Preserve that clarity until requirements justify more structure.

To check your understanding, explain these five points to another developer:

1. How `/dashboard` reaches Neon without a browser database connection.
2. Why `SidebarProvider` needs client code while `AppSidebar` can query on the server.
3. How `ItemCollection` allows an item to appear in multiple collections without duplication.
4. How selected database fields become a `DashboardItem` and then an `ItemCard`.
5. Why a database password field, a mock avatar, and a demo-user filter do not yet provide authentication.

If you can trace those paths in the source, you have the foundation needed to contribute to this project.
