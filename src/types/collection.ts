export interface CollectionItemType {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export interface DashboardCollection {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  // Sorted by count, most-used type first.
  itemTypes: CollectionItemType[];
}

export interface SidebarCollections {
  favorites: DashboardCollection[];
  recent: DashboardCollection[];
}

export interface CollectionStats {
  total: number;
  favorites: number;
}
