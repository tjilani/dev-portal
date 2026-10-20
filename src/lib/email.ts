import { Resend } from "resend";

const FROM = "Dev Master View <onboarding@resend.dev>";

export async function sendVerificationEmail(email: string, url: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your email",
    html: `<p>Welcome to Dev Master View!</p>
<p><a href="${url}">Verify your email address</a> to activate your account.</p>
<p>This link expires in 24 hours.</p>`,
  });

  if (error) throw new Error(error.message);
}
