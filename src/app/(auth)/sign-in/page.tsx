import Link from "next/link";
import SignInForm from "@/components/auth/SignInForm";
import AuthToast from "@/components/auth/AuthToast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signInWithGitHub } from "@/actions/auth";
import type { AuthNotice } from "@/types/auth";

function getNotice(verified: unknown, reset: unknown): AuthNotice | null {
  if (verified === "success") return { type: "success", message: "Email verified. You can now sign in." };
  if (verified) return { type: "error", message: "This verification link is invalid or has expired." };
  if (reset === "success") return { type: "success", message: "Password updated. You can now sign in." };
  return null;
}

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const { callbackUrl, error, verified, reset } = await searchParams;
  const redirectTo = typeof callbackUrl === "string" ? callbackUrl : "/dashboard";
  const notice = getNotice(verified, reset);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Sign in</CardTitle>
        <CardDescription>Welcome back to Dev Master View</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {notice && <AuthToast {...notice} />}
        {error && <p className="text-sm text-destructive">Sign in failed. Please try again.</p>}

        <SignInForm callbackUrl={redirectTo} />

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Separator className="flex-1" />
          or
          <Separator className="flex-1" />
        </div>

        <form action={signInWithGitHub}>
          <input type="hidden" name="callbackUrl" value={redirectTo} />
          <Button type="submit" variant="outline" className="w-full">
            Sign in with GitHub
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          No account?{" "}
          <Link href="/register" className="text-foreground underline-offset-4 hover:underline">
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
