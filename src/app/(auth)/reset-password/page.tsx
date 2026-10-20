import Link from "next/link";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { isValidPasswordResetToken } from "@/lib/db/verification-tokens";

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const { token } = await searchParams;
  const isValid = typeof token === "string" && (await isValidPasswordResetToken(token));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Reset password</CardTitle>
        <CardDescription>
          {isValid ? "Choose a new password for your account" : "This reset link is invalid or has expired"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isValid ? (
          <ResetPasswordForm token={token} />
        ) : (
          <Link
            href="/forgot-password"
            className="text-center text-sm text-foreground underline-offset-4 hover:underline"
          >
            Request a new reset link
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
