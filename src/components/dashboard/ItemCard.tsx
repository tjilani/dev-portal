import { Pin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ITEM_TYPE_ICONS } from "@/lib/item-type-icons";
import { itemTypes, type MockItem } from "@/lib/mock-data";

interface ItemCardProps {
  item: MockItem;
}

export default function ItemCard({ item }: ItemCardProps) {
  const type = itemTypes.find((t) => t.id === item.itemTypeId)!;
  const Icon = ITEM_TYPE_ICONS[type.icon];
  const date = new Date(item.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <Card className="border-l-4 transition-colors hover:bg-accent/50" style={{ borderLeftColor: type.color }}>
      <CardContent className="flex gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-5" style={{ color: type.color }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-medium">{item.title}</h3>
            {item.isPinned && <Pin className="size-3.5 text-muted-foreground" />}
            {item.isFavorite && <Star className="size-4 fill-yellow-400 text-yellow-400" />}
          </div>
          <p className="truncate text-sm text-muted-foreground">{item.description}</p>
          {item.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">{date}</span>
      </CardContent>
    </Card>
  );
}
