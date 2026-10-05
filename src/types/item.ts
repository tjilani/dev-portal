export interface DashboardItem {
  id: string;
  title: string;
  description: string | null;
  isPinned: boolean;
  isFavorite: boolean;
  updatedAt: Date;
  itemType: {
    name: string;
    icon: string;
    color: string;
  };
  tags: string[];
}

export interface ItemStats {
  total: number;
  favorites: number;
}
