import { createVerificationToken } from "@/lib/db/verification-tokens";
import { sendVerificationEmail } from "@/lib/email";

export async function sendVerification(email: string, origin: string) {
  const token = await createVerificationToken(email);
  const verifyUrl = new URL(`/api/auth/verify-email?token=${token}`, origin).toString();
  await sendVerificationEmail(email, verifyUrl);
}
