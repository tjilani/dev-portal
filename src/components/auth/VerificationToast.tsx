"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface VerificationToastProps {
  success: boolean;
}

export default function VerificationToast({ success }: VerificationToastProps) {
  const router = useRouter();

  useEffect(() => {
    if (success) {
      toast.success("Email verified. You can now sign in.", { id: "verify-email" });
    } else {
      toast.error("This verification link is invalid or has expired.", { id: "verify-email" });
    }
    router.replace("/sign-in");
  }, [success, router]);

  return null;
}
