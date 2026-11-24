import { redirect } from "next/navigation";
import { Folder, Layers } from "lucide-react";
import { auth } from "@/auth";
import UserAvatar from "@/components/auth/UserAvatar";
import StatsCard from "@/components/dashboard/StatsCard";
import ChangePasswordDialog from "@/components/profile/ChangePasswordDialog";
import DeleteAccountDialog from "@/components/profile/DeleteAccountDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getProfile } from "@/lib/db/users";
import { getItemTypeIcon } from "@/lib/item-type-icons";
import { typeColorStyle } from "@/lib/type-color";

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", { dateStyle: "long" });

export default async function ProfilePage() {
  const session = await auth();
  const profile = session?.user?.id ? await getProfile(session.user.id) : null;
  if (!profile) redirect("/sign-in");

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <h1 className="text-3xl font-semibold">Profile</h1>

      <Card>
        <CardContent className="flex items-center gap-4">
          <UserAvatar user={profile} className="size-16" />
          <div className="min-w-0">
            <p className="truncate text-lg font-medium">{profile.name ?? "Unnamed user"}</p>
            <p className="truncate text-sm text-muted-foreground">{profile.email}</p>
            <p className="text-sm text-muted-foreground">
              Member since {DATE_FORMAT.format(profile.createdAt)}
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 sm:grid-cols-2">
        <StatsCard label="Items" value={profile.itemCount} icon={Layers} />
        <StatsCard label="Collections" value={profile.collectionCount} icon={Folder} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Items by type</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {profile.itemTypes.map((type) => {
            const Icon = getItemTypeIcon(type.icon);
            return (
              <div key={type.id} className="flex items-center gap-3 rounded-lg border px-3 py-2">
                <Icon className="size-4 text-(--type-color)" style={typeColorStyle(type.color)} />
                <span className="capitalize">{type.slug}</span>
                <span className="ml-auto font-medium tabular-nums">{type.count}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your password or delete your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {profile.hasPassword && <ChangePasswordDialog />}
          <DeleteAccountDialog />
        </CardContent>
      </Card>
    </div>
  );
}
