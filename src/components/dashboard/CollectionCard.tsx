import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ITEM_TYPE_ICONS } from "@/lib/item-type-icons";
import type { DashboardCollection } from "@/types/collection";

interface CollectionCardProps {
  collection: DashboardCollection;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const accentColor = collection.itemTypes[0]?.color;

  return (
    <Link href={`/collections/${collection.id}`}>
      <Card
        className="h-full border-l-4 transition-colors hover:bg-accent/50"
        style={{ borderLeftColor: accentColor }}
      >
        <CardContent className="flex flex-col gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{collection.name}</h3>
              {collection.isFavorite && <Star className="size-4 fill-yellow-400 text-yellow-400" />}
            </div>
            <p className="text-sm text-muted-foreground">{collection.itemCount} items</p>
          </div>
          {collection.description && <p className="text-sm text-muted-foreground">{collection.description}</p>}
          <div className="flex gap-2">
            {collection.itemTypes.map((type) => {
              const Icon = ITEM_TYPE_ICONS[type.icon];
              return <Icon key={type.id} className="size-4" style={{ color: type.color }} />;
            })}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
