import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

interface SeedItem {
  type: string;
  title: string;
  description: string;
  content?: string;
  url?: string;
  language?: string;
}

interface SeedCollection {
  name: string;
  description: string;
  items: SeedItem[];
}

const DEMO_USER = {
  email: "demo@devstash.io",
  name: "Demo User",
  password: "12345678",
};

const SYSTEM_ITEM_TYPES = [
  { name: "snippet", slug: "snippets", icon: "Code", color: "#3b82f6" },
  { name: "prompt", slug: "prompts", icon: "Sparkles", color: "#8b5cf6" },
  { name: "command", slug: "commands", icon: "Terminal", color: "#f97316" },
  { name: "note", slug: "notes", icon: "StickyNote", color: "#fde047" },
  { name: "file", slug: "files", icon: "File", color: "#6b7280" },
  { name: "image", slug: "images", icon: "Image", color: "#ec4899" },
  { name: "link", slug: "links", icon: "Link", color: "#10b981" },
];

const COLLECTIONS: SeedCollection[] = [
  {
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    items: [
      {
        type: "snippets",
        title: "useDebounce and useLocalStorage Hooks",
        description: "Custom hooks for debouncing values and persisting state in localStorage",
        language: "typescript",
        content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}`,
      },
      {
        type: "snippets",
        title: "Context Provider and Compound Components",
        description: "Typed context provider powering a compound Tabs component",
        language: "typescript",
        content: `import { createContext, useContext, useState, type ReactNode } from "react";

interface TabsContextValue {
  active: string;
  setActive: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs components must be used inside <Tabs>");
  return context;
}

export function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>;
}

Tabs.Trigger = function Trigger({ id, children }: { id: string; children: ReactNode }) {
  const { active, setActive } = useTabs();
  return (
    <button aria-selected={active === id} onClick={() => setActive(id)}>
      {children}
    </button>
  );
};

Tabs.Panel = function Panel({ id, children }: { id: string; children: ReactNode }) {
  const { active } = useTabs();
  return active === id ? <div>{children}</div> : null;
};`,
      },
      {
        type: "snippets",
        title: "Utility Functions",
        description: "Small helpers for class names, clamping and formatting dates",
        language: "typescript",
        content: `export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatDate(date: Date, locale = "en-US") {
  return date.toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric" });
}`,
      },
    ],
  },
  {
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    items: [
      {
        type: "prompts",
        title: "Code Review Prompt",
        description: "Thorough review focused on bugs, security and performance",
        content: `Review the following code as a senior engineer.

For each issue found, report:
1. Severity (critical, major, minor)
2. The exact location
3. Why it is a problem
4. A concrete fix

Focus on correctness, security (input validation, auth checks), performance and readability. Do not comment on formatting.

Code:
{{code}}`,
      },
      {
        type: "prompts",
        title: "Documentation Generator",
        description: "Generate clear documentation for a module or function",
        content: `Write documentation for the code below.

Include:
- A one-sentence summary of what it does
- Parameters and return values with types
- One realistic usage example
- Edge cases and thrown errors

Keep it concise and use Markdown.

Code:
{{code}}`,
      },
      {
        type: "prompts",
        title: "Refactoring Assistant",
        description: "Refactor code for readability without changing behavior",
        content: `Refactor the code below to improve readability and maintainability.

Rules:
- Do not change external behavior or public APIs
- Prefer small, focused functions and descriptive names
- Remove duplication
- Explain each change in one sentence after the code

Code:
{{code}}`,
      },
    ],
  },
  {
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    items: [
      {
        type: "snippets",
        title: "Next.js Dockerfile",
        description: "Multi-stage Dockerfile for a standalone Next.js build",
        language: "dockerfile",
        content: `FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        type: "commands",
        title: "Deploy with Migrations",
        description: "Apply pending Prisma migrations, then build and start the app",
        language: "bash",
        content: `npx prisma migrate deploy && npm run build && npm run start`,
      },
      {
        type: "links",
        title: "Docker Documentation",
        description: "Official Docker docs for building and running containers",
        url: "https://docs.docker.com",
      },
      {
        type: "links",
        title: "GitHub Actions Documentation",
        description: "Official docs for CI/CD workflows with GitHub Actions",
        url: "https://docs.github.com/en/actions",
      },
    ],
  },
  {
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    items: [
      {
        type: "commands",
        title: "Undo Last Commit",
        description: "Undo the last git commit but keep the changes staged",
        language: "bash",
        content: `git reset --soft HEAD~1`,
      },
      {
        type: "commands",
        title: "Docker Cleanup",
        description: "Remove unused containers, images, networks and volumes",
        language: "bash",
        content: `docker system prune -a --volumes`,
      },
      {
        type: "commands",
        title: "Kill Process on Port",
        description: "Find and stop the process listening on port 3000",
        language: "bash",
        content: `lsof -ti :3000 | xargs kill -9`,
      },
      {
        type: "commands",
        title: "Check Outdated Packages",
        description: "List outdated npm dependencies and update within semver ranges",
        language: "bash",
        content: `npm outdated && npm update`,
      },
    ],
  },
  {
    name: "Design Resources",
    description: "UI/UX resources and references",
    items: [
      {
        type: "links",
        title: "Tailwind CSS Documentation",
        description: "Utility-first CSS framework reference",
        url: "https://tailwindcss.com/docs",
      },
      {
        type: "links",
        title: "shadcn/ui",
        description: "Accessible, customizable React components",
        url: "https://ui.shadcn.com",
      },
      {
        type: "links",
        title: "Material Design 3",
        description: "Google's open-source design system",
        url: "https://m3.material.io",
      },
      {
        type: "links",
        title: "Lucide Icons",
        description: "Open-source icon library used in this project",
        url: "https://lucide.dev",
      },
    ],
  },
];

async function seedItemTypes() {
  const typeIds = new Map<string, string>();

  for (const type of SYSTEM_ITEM_TYPES) {
    const existing = await prisma.itemType.findFirst({
      where: { slug: type.slug, userId: null },
    });
    const saved = existing
      ? await prisma.itemType.update({ where: { id: existing.id }, data: { ...type, isSystem: true } })
      : await prisma.itemType.create({ data: { ...type, isSystem: true } });
    typeIds.set(type.slug, saved.id);
  }

  return typeIds;
}

async function seedDemoUser() {
  const password = await bcrypt.hash(DEMO_USER.password, 12);
  const data = { name: DEMO_USER.name, password, isPro: false, emailVerified: new Date() };

  return prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: data,
    create: { email: DEMO_USER.email, ...data },
  });
}

async function seedCollections(userId: string, typeIds: Map<string, string>) {
  await prisma.collection.deleteMany({ where: { userId } });
  await prisma.item.deleteMany({ where: { userId } });

  for (const collection of COLLECTIONS) {
    await prisma.collection.create({
      data: {
        name: collection.name,
        description: collection.description,
        user: { connect: { id: userId } },
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
      },
    });
  }
}

async function main() {
  const typeIds = await seedItemTypes();
  const user = await seedDemoUser();
  await seedCollections(user.id, typeIds);

  console.log(
    `Seeded ${typeIds.size} item types, user ${user.email}, ${COLLECTIONS.length} collections, ` +
      `${COLLECTIONS.reduce((sum, c) => sum + c.items.length, 0)} items`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
