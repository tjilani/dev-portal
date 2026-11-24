"use server";

import bcrypt from "bcryptjs";
import { auth, signOut } from "@/auth";
import { changePasswordSchema } from "@/lib/auth-schemas";
import { deleteUser } from "@/lib/db/users";
import { prisma } from "@/lib/prisma";
import type { ChangePasswordState } from "@/types/profile";

export async function changePassword(
  _prev: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const parsed = changePasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message };

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (
      !user?.password ||
      !(await bcrypt.compare(parsed.data.currentPassword, user.password))
    ) {
      return { success: false, error: "Current password is incorrect" };
    }

    const hash = await bcrypt.hash(parsed.data.password, 12);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hash },
    });

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Could not change password. Please try again.",
    };
  }
}

export async function deleteAccount(): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return { success: false, error: "Not authenticated" };
  }

  try {
    await deleteUser(session.user.id, session.user.email);
  } catch {
    return {
      success: false,
      error: "Could not delete account. Please try again.",
    };
  }

  await signOut({ redirectTo: "/sign-in" });
  return { success: true };
}
