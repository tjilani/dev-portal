import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";

const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const PASSWORD_RESET_PREFIX = "password-reset:";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function replaceToken(identifier: string, token: string, ttlMs: number) {
  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier } }),
    prisma.verificationToken.create({
      data: { identifier, token, expires: new Date(Date.now() + ttlMs) },
    }),
  ]);
}

async function isInCooldown(identifier: string, ttlMs: number) {
  const latest = await prisma.verificationToken.findFirst({
    where: { identifier },
    orderBy: { expires: "desc" },
    select: { expires: true },
  });
  if (!latest) return false;

  const createdAt = latest.expires.getTime() - ttlMs;
  return Date.now() - createdAt < RESEND_COOLDOWN_MS;
}

async function findValidPasswordResetToken(token: string) {
  const record = await prisma.verificationToken.findFirst({
    where: { token: hashToken(token), identifier: { startsWith: PASSWORD_RESET_PREFIX } },
  });
  return record && record.expires > new Date() ? record : null;
}

export async function createVerificationToken(email: string) {
  const token = randomBytes(32).toString("hex");
  await replaceToken(email, token, VERIFICATION_TTL_MS);
  return token;
}

export function isInResendCooldown(email: string) {
  return isInCooldown(email, VERIFICATION_TTL_MS);
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

export async function createPasswordResetToken(email: string) {
  const token = randomBytes(32).toString("hex");
  await replaceToken(PASSWORD_RESET_PREFIX + email, hashToken(token), PASSWORD_RESET_TTL_MS);
  return token;
}

export function isInPasswordResetCooldown(email: string) {
  return isInCooldown(PASSWORD_RESET_PREFIX + email, PASSWORD_RESET_TTL_MS);
}

export async function isValidPasswordResetToken(token: string) {
  return Boolean(await findValidPasswordResetToken(token));
}

export async function resetPasswordWithToken(token: string, passwordHash: string) {
  const record = await findValidPasswordResetToken(token);
  if (!record) return false;

  const email = record.identifier.slice(PASSWORD_RESET_PREFIX.length);
  await prisma.$transaction([
    prisma.user.update({ where: { email }, data: { password: passwordHash } }),
    prisma.user.updateMany({
      where: { email, emailVerified: null },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.deleteMany({ where: { identifier: record.identifier } }),
  ]);
  return true;
}
