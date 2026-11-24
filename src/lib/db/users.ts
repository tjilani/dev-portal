import { PASSWORD_RESET_PREFIX } from "@/lib/db/verification-tokens";
import { prisma } from "@/lib/prisma";
import type { Profile } from "@/types/profile";

export async function getProfile(userId: string): Promise<Profile | null> {
  const [user, itemTypes] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        image: true,
        createdAt: true,
        password: true,
        _count: { select: { items: true, collections: true } },
      },
    }),
    prisma.itemType.findMany({
      where: { isSystem: true },
      orderBy: { name: "asc" },
      select: {
        id: true,
        slug: true,
        icon: true,
        color: true,
        _count: { select: { items: { where: { userId } } } },
      },
    }),
  ]);
  if (!user) return null;

  const { password, _count, ...info } = user;
  return {
    ...info,
    hasPassword: Boolean(password),
    itemCount: _count.items,
    collectionCount: _count.collections,
    itemTypes: itemTypes.map(({ _count, ...type }) => ({ ...type, count: _count.items })),
  };
}

export async function deleteUser(userId: string, email: string) {
  await prisma.$transaction([
    prisma.verificationToken.deleteMany({
      where: { identifier: { in: [email, PASSWORD_RESET_PREFIX + email] } },
    }),
    prisma.user.delete({ where: { id: userId } }),
  ]);
}
