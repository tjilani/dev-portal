"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { signInSchema } from "@/lib/auth-schemas";
import type { SignInState } from "@/types/auth";

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
    if (error instanceof AuthError) {
      return { success: false, data: { email }, error: "Invalid email or password" };
    }
    throw error;
  }
}

export async function signInWithGitHub(formData: FormData) {
  await signIn("github", { redirectTo: getRedirectTo(formData) });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/sign-in" });
}
