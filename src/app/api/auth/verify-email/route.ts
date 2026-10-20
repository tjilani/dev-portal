import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { verifyEmailToken } from "@/lib/db/verification-tokens";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const verified = token ? await verifyEmailToken(token) : false;

  redirect(`/sign-in?verified=${verified ? "success" : "invalid"}`);
}
