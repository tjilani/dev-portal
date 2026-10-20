"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AuthNotice } from "@/types/auth";

export default function AuthToast({ type, message }: AuthNotice) {
  const router = useRouter();

  useEffect(() => {
    toast[type](message, { id: message });
    router.replace("/sign-in");
  }, [type, message, router]);

  return null;
}
