import { DEMO_USER_FILTER } from "@/lib/db/demo-user";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { DashboardItem, ItemStats } from "@/types/item";

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

function toDashboardItem({ tags, ...item }: ItemRow): DashboardItem {
  return { ...item, tags: tags.map(({ tag }) => tag.name) };
}

export async function getPinnedItems(): Promise<DashboardItem[]> {
  const items = await prisma.item.findMany({
    where: { ...DEMO_USER_FILTER, isPinned: true },
    orderBy: { updatedAt: "desc" },
    select: DASHBOARD_ITEM_SELECT,
  });

  return items.map(toDashboardItem);
}

export async function getRecentItems(limit = 10): Promise<DashboardItem[]> {
  const items = await prisma.item.findMany({
    where: DEMO_USER_FILTER,
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: DASHBOARD_ITEM_SELECT,
  });

  return items.map(toDashboardItem);
}

export async function getItemStats(): Promise<ItemStats> {
  const [total, favorites] = await Promise.all([
    prisma.item.count({ where: DEMO_USER_FILTER }),
    prisma.item.count({ where: { ...DEMO_USER_FILTER, isFavorite: true } }),
  ]);

  return { total, favorites };
}
