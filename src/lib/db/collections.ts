import { DEMO_USER_FILTER } from "@/lib/db/demo-user";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  CollectionItemType,
  CollectionStats,
  DashboardCollection,
  SidebarCollection,
  SidebarCollections,
} from "@/types/collection";

async function findCollections(
  where: Prisma.CollectionWhereInput,
  take?: number,
): Promise<DashboardCollection[]> {
  const collections = await prisma.collection.findMany({
    where: { ...DEMO_USER_FILTER, ...where },
    orderBy: { updatedAt: "desc" },
    take,
    include: {
      items: {
        select: {
          item: {
            select: {
              itemType: {
                select: { id: true, name: true, icon: true, color: true },
              },
            },
          },
        },
      },
    },
  });

  return collections.map(({ items, ...collection }) => {
    const types = new Map<string, CollectionItemType>();
    for (const { item } of items) {
      const type = types.get(item.itemType.id) ?? {
        ...item.itemType,
        count: 0,
      };
      type.count++;
      types.set(type.id, type);
    }

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount: items.length,
      itemTypes: [...types.values()].sort((a, b) => b.count - a.count),
    };
  });
}

export async function getRecentCollections(
  limit: number,
): Promise<DashboardCollection[]> {
  return findCollections({}, limit);
}

function findFavoriteCollections(): Promise<SidebarCollection[]> {
  return prisma.collection.findMany({
    where: { ...DEMO_USER_FILTER, isFavorite: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
}

export async function getSidebarCollections(
  recentLimit: number,
): Promise<SidebarCollections> {
  const [favorites, recent] = await Promise.all([
    findFavoriteCollections(),
    findCollections({ isFavorite: false }, recentLimit),
  ]);

  return { favorites, recent };
}

export async function getCollectionStats(): Promise<CollectionStats> {
  const [total, favorites] = await Promise.all([
    prisma.collection.count({ where: DEMO_USER_FILTER }),
    prisma.collection.count({
      where: { ...DEMO_USER_FILTER, isFavorite: true },
    }),
  ]);

  return { total, favorites };
}
