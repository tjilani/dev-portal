import { createPasswordResetToken, createVerificationToken } from "@/lib/db/verification-tokens";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";

export async function sendVerification(email: string, origin: string) {
  const token = await createVerificationToken(email);
  const verifyUrl = new URL(`/api/auth/verify-email?token=${token}`, origin).toString();
  await sendVerificationEmail(email, verifyUrl);
}

export async function sendPasswordReset(email: string, origin: string) {
  const token = await createPasswordResetToken(email);
  const resetUrl = new URL(`/reset-password?token=${token}`, origin).toString();
  await sendPasswordResetEmail(email, resetUrl);
}
