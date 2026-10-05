import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ITEM_TYPE_ICONS } from "@/lib/item-type-icons";
import { itemTypes, type MockCollection } from "@/lib/mock-data";

interface CollectionCardProps {
  collection: MockCollection;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const types = collection.itemTypeIds.map((id) => itemTypes.find((type) => type.id === id)!);
  const accentColor = types[0]?.color;

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
          <p className="text-sm text-muted-foreground">{collection.description}</p>
          <div className="flex gap-2">
            {types.map((type) => {
              const Icon = ITEM_TYPE_ICONS[type.icon];
              return <Icon key={type.id} className="size-4" style={{ color: type.color }} />;
            })}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
