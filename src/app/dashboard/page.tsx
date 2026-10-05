import Link from "next/link";
import { Folder, FolderHeart, Layers, Pin, Star } from "lucide-react";
import CollectionCard from "@/components/dashboard/CollectionCard";
import ItemCard from "@/components/dashboard/ItemCard";
import StatsCard from "@/components/dashboard/StatsCard";
import { getCollectionStats, getRecentCollections } from "@/lib/db/collections";
import { getItemStats, getPinnedItems, getRecentItems } from "@/lib/db/items";

export const dynamic = "force-dynamic";

const RECENT_COLLECTIONS_LIMIT = 6;
const RECENT_ITEMS_LIMIT = 10;

export default async function DashboardPage() {
  const [recentCollections, collectionStats, pinnedItems, recentItems, itemStats] = await Promise.all([
    getRecentCollections(RECENT_COLLECTIONS_LIMIT),
    getCollectionStats(),
    getPinnedItems(),
    getRecentItems(RECENT_ITEMS_LIMIT),
    getItemStats(),
  ]);

  const stats = [
    { label: "Items", value: itemStats.total, icon: Layers },
    { label: "Collections", value: collectionStats.total, icon: Folder },
    { label: "Favorite Items", value: itemStats.favorites, icon: Star },
    { label: "Favorite Collections", value: collectionStats.favorites, icon: FolderHeart },
  ];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10">
      <div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Your developer knowledge hub</p>
      </div>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Collections</h2>
          <Link href="/collections" className="text-sm text-muted-foreground hover:text-foreground">
            View all
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recentCollections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      {pinnedItems.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Pin className="size-4 text-muted-foreground" />
            Pinned
          </h2>
          <div className="flex flex-col gap-3">
            {pinnedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Recent Items</h2>
        <div className="flex flex-col gap-3">
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
