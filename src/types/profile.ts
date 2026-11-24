import type { SidebarItemType } from "@/types/item";

export interface Profile {
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
  hasPassword: boolean;
  itemCount: number;
  collectionCount: number;
  itemTypes: SidebarItemType[];
}

export interface ChangePasswordState {
  success: boolean;
  error?: string;
}
