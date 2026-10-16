import { Code, File, Image, Link, type LucideIcon, Sparkles, StickyNote, Terminal } from "lucide-react";

const ITEM_TYPE_ICONS: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link,
};

export function getItemTypeIcon(name: string): LucideIcon {
  return ITEM_TYPE_ICONS[name] ?? File;
}
