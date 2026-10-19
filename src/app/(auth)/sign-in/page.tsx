import Link from "next/link";
import SignInForm from "@/components/auth/SignInForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { signInWithGitHub } from "@/actions/auth";

export default async function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const { callbackUrl, error } = await searchParams;
  const redirectTo = typeof callbackUrl === "string" ? callbackUrl : "/dashboard";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Sign in</CardTitle>
        <CardDescription>Welcome back to Dev Master View</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
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
