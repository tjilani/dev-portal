import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export async function createVerificationToken(email: string) {
  const token = randomBytes(32).toString("hex");
  await prisma.verificationToken.create({
    data: { identifier: email, token, expires: new Date(Date.now() + TOKEN_TTL_MS) },
  });
  return token;
}

export async function verifyEmailToken(token: string) {
  const record = await prisma.verificationToken.findFirst({ where: { token } });
  if (!record || record.expires < new Date()) return false;

  await prisma.$transaction([
    prisma.user.update({
      where: { email: record.identifier },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({
      where: { identifier_token: { identifier: record.identifier, token } },
    }),
  ]);
  return true;
}
