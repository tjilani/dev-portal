"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithCredentials } from "@/actions/auth";
import ResendVerificationButton from "@/components/auth/ResendVerificationButton";
import type { SignInState } from "@/types/auth";

interface SignInFormProps {
  callbackUrl: string;
}

const INITIAL_STATE: SignInState = { success: false };

export default function SignInForm({ callbackUrl }: SignInFormProps) {
  const [state, formAction, isPending] = useActionState(signInWithCredentials, INITIAL_STATE);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          key={state.data?.email}
          id="email"
          name="email"
          type="email"
          defaultValue={state.data?.email}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.data?.needsVerification && <ResendVerificationButton email={state.data.email} />}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
