"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/actions/password-reset";
import type { ForgotPasswordState } from "@/types/auth";

const INITIAL_STATE: ForgotPasswordState = { success: false };

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, INITIAL_STATE);

  if (state.success) {
    return (
      <p className="text-sm text-muted-foreground">
        If an account exists for {state.data?.email}, we&apos;ve sent a link to reset your
        password. It expires in 1 hour.
      </p>
    );
  }

  return (
    <form action={formAction} className="grid gap-4">
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
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}
