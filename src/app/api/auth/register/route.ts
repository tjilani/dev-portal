import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/auth-schemas";
import { createVerificationToken } from "@/lib/db/verification-tokens";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { success: false, error: parsed.error.issues[0].message },
      { status: 400 },
    );
  }

  const { name, email, password } = parsed.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      return Response.json(
        { success: false, error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const user = await prisma.user.create({
      data: { name, email, password: await bcrypt.hash(password, 12) },
      select: { id: true, name: true, email: true },
    });

    const token = await createVerificationToken(email);
    const verifyUrl = new URL(`/api/auth/verify-email?token=${token}`, request.url).toString();

    try {
      await sendVerificationEmail(email, verifyUrl);
    } catch {
      await prisma.$transaction([
        prisma.verificationToken.delete({
          where: { identifier_token: { identifier: email, token } },
        }),
        prisma.user.delete({ where: { id: user.id } }),
      ]);

      return Response.json(
        { success: false, error: "Verification email could not be sent. Please try again." },
        { status: 502 },
      );
    }

    return Response.json({ success: true, data: user }, { status: 201 });
  } catch {
    return Response.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}
