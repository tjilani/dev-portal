import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/auth-schemas";
import { EMAIL_VERIFICATION_ENABLED } from "@/lib/config";
import { sendVerification } from "@/lib/verification";

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

    const emailSent =
      EMAIL_VERIFICATION_ENABLED &&
      (await sendVerification(email, request.url).then(
        () => true,
        () => false,
      ));

    return Response.json(
      {
        success: true,
        data: { ...user, verificationRequired: EMAIL_VERIFICATION_ENABLED, emailSent },
      },
      { status: 201 },
    );
  } catch {
    return Response.json({ success: false, error: "Registration failed" }, { status: 500 });
  }
}
