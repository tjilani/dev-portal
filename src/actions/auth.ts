"use server";

import { headers } from "next/headers";
import { AuthError, CredentialsSignin } from "next-auth";
import { EMAIL_NOT_VERIFIED, signIn, signOut } from "@/auth";
import { signInSchema } from "@/lib/auth-schemas";
import { isInResendCooldown } from "@/lib/db/verification-tokens";
import { prisma } from "@/lib/prisma";
import { sendVerification } from "@/lib/verification";
import type { ResendVerificationResult, SignInState } from "@/types/auth";

const DEFAULT_REDIRECT = "/dashboard";

function getRedirectTo(formData: FormData) {
  return String(formData.get("callbackUrl") || DEFAULT_REDIRECT);
}

export async function signInWithCredentials(
  _prev: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "");
  const parsed = signInSchema.safeParse({ email, password: formData.get("password") });
  if (!parsed.success) {
    return { success: false, data: { email }, error: parsed.error.issues[0].message };
  }

  try {
    await signIn("credentials", { ...parsed.data, redirectTo: getRedirectTo(formData) });
    return { success: true };
  } catch (error) {
    if (error instanceof CredentialsSignin && error.code === EMAIL_NOT_VERIFIED) {
      return {
        success: false,
        data: { email, needsVerification: true },
        error: "Please verify your email before signing in",
      };
    }
    if (error instanceof AuthError) {
      return { success: false, data: { email }, error: "Invalid email or password" };
    }
    throw error;
  }
}

export async function resendVerificationEmail(email: string): Promise<ResendVerificationResult> {
  const parsed = signInSchema.shape.email.safeParse(email);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data },
      select: { emailVerified: true },
    });
    const origin = (await headers()).get("origin") ?? "";

    if (!user || user.emailVerified) return { success: true };
    if (await isInResendCooldown(parsed.data)) {
      return { success: false, error: "Please wait before requesting another verification email." };
    }

    await sendVerification(parsed.data, origin);

    return { success: true };
  } catch {
    return { success: false, error: "Could not send verification email. Please try again." };
  }
}

export async function signInWithGitHub(formData: FormData) {
  await signIn("github", { redirectTo: getRedirectTo(formData) });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/sign-in" });
}
