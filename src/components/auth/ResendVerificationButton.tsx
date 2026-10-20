"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { resendVerificationEmail } from "@/actions/auth";

interface ResendVerificationButtonProps {
  email: string;
}

export default function ResendVerificationButton({ email }: ResendVerificationButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await resendVerificationEmail(email);
      if (result.success) {
        toast.success("If your account needs verification, a new email is on its way.");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending ? "Sending..." : "Resend verification email"}
    </Button>
  );
}
