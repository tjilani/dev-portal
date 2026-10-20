import { Resend } from "resend";

const FROM = "Dev Master View <onboarding@resend.dev>";

async function sendEmail(to: string, subject: string, html: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({ from: FROM, to, subject, html });

  if (error) throw new Error(error.message);
}

export function sendVerificationEmail(email: string, url: string) {
  return sendEmail(
    email,
    "Verify your email",
    `<p>Welcome to Dev Master View!</p>
<p><a href="${url}">Verify your email address</a> to activate your account.</p>
<p>This link expires in 24 hours.</p>`,
  );
}

export function sendPasswordResetEmail(email: string, url: string) {
  return sendEmail(
    email,
    "Reset your password",
    `<p>We received a request to reset your Dev Master View password.</p>
<p><a href="${url}">Choose a new password</a></p>
<p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>`,
  );
}
