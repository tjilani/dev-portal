"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/auth-schemas";
import {
  isInPasswordResetCooldown,
  resetPasswordWithToken,
} from "@/lib/db/verification-tokens";
import { prisma } from "@/lib/prisma";
import { sendPasswordReset } from "@/lib/verification";
import type { ForgotPasswordState, ResetPasswordState } from "@/types/auth";

export async function requestPasswordReset(
  _prev: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const email = String(formData.get("email") ?? "");
  const parsed = forgotPasswordSchema.safeParse({ email });
  if (!parsed.success) {
    return {
      success: false,
      data: { email },
      error: parsed.error.issues[0].message,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
      select: { password: true },
    });

    if (
      user?.password &&
      !(await isInPasswordResetCooldown(parsed.data.email))
    ) {
      const origin = (await headers()).get("origin") ?? "";
      await sendPasswordReset(parsed.data.email, origin);
    }

    return { success: true, data: { email } };
  } catch {
    return {
      success: false,
      data: { email },
      error: "Could not send reset email. Please try again.",
    };
  }
}

export async function resetPassword(
  _prev: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message };

  try {
    const hash = await bcrypt.hash(parsed.data.password, 12);
    const updated = await resetPasswordWithToken(parsed.data.token, hash);
    if (!updated) {
      return {
        success: false,
        error: "Invalid or expired link. Please request a new reset link.",
      };
    }
  } catch {
    return {
      success: false,
      error: "Could not reset password. Please try again.",
    };
  }

  redirect("/sign-in?reset=success");
}
