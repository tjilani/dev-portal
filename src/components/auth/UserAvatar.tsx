import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { SessionUser } from "@/types/auth";

interface UserAvatarProps {
  user: SessionUser;
}

function getInitials(name: string | null | undefined): string {
  const parts = name?.trim().split(/\s+/).filter(Boolean);

  if (!parts?.length) return "U";

  const first = Array.from(parts[0])[0];
  const last = parts.length > 1 ? Array.from(parts[parts.length - 1])[0] : "";

  return `${first}${last}`.toUpperCase();
}

export default function UserAvatar({ user }: UserAvatarProps) {
  return (
    <Avatar>
      {user.image && <AvatarImage src={user.image} alt={user.name ?? "User avatar"} />}
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
  );
}
