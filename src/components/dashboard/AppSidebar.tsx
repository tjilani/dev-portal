import Link from "next/link";
import { Folder, Layers, Settings, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ITEM_TYPE_ICONS } from "@/lib/item-type-icons";
import { collections, currentUser, itemTypes } from "@/lib/mock-data";

const RECENT_COLLECTIONS_LIMIT = 5;

export default function AppSidebar() {
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = collections
    .filter((c) => !c.isFavorite)
    .toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, RECENT_COLLECTIONS_LIMIT);
  const initials = currentUser.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Layers className="size-4" />
              </div>
              <span className="font-semibold">Dev Master View</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Types</SidebarGroupLabel>
          <SidebarMenu>
            {itemTypes.map((type) => {
              const Icon = ITEM_TYPE_ICONS[type.icon];
              return (
                <SidebarMenuItem key={type.id}>
                  <SidebarMenuButton tooltip={type.name} render={<Link href={`/items/${type.slug}`} />}>
                    <Icon style={{ color: type.color }} />
                    <span>{type.name}</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>{type.count}</SidebarMenuBadge>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarMenu>
            {favoriteCollections.map((collection) => (
              <SidebarMenuItem key={collection.id}>
                <SidebarMenuButton tooltip={collection.name} render={<Link href={`/collections/${collection.id}`} />}>
                  <Folder />
                  <span>{collection.name}</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>
                  <Star className="size-4 fill-yellow-400 text-yellow-400" />
                </SidebarMenuBadge>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recent Collections</SidebarGroupLabel>
          <SidebarMenu>
            {recentCollections.map((collection) => (
              <SidebarMenuItem key={collection.id}>
                <SidebarMenuButton tooltip={collection.name} render={<Link href={`/collections/${collection.id}`} />}>
                  <Folder />
                  <span>{collection.name}</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>{collection.itemCount}</SidebarMenuBadge>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Settings" render={<Link href="/settings" />}>
              <Avatar>
                {currentUser.image && <AvatarImage src={currentUser.image} alt={currentUser.name} />}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-medium">{currentUser.name}</span>
                <span className="truncate text-xs text-muted-foreground">{currentUser.email}</span>
              </div>
              <Settings className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
