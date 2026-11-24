import { APP_URL } from "@/lib/config";
import { createPasswordResetToken, createVerificationToken } from "@/lib/db/verification-tokens";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";

export async function sendVerification(email: string) {
  const token = await createVerificationToken(email);
  const verifyUrl = new URL(`/api/auth/verify-email?token=${token}`, APP_URL).toString();
  await sendVerificationEmail(email, verifyUrl);
}

export async function sendPasswordReset(email: string) {
  const token = await createPasswordResetToken(email);
  const resetUrl = new URL(`/reset-password?token=${token}`, APP_URL).toString();
  await sendPasswordResetEmail(email, resetUrl);
}
