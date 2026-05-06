"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthProvider";

export default function AuthRedirect() {
  const user = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace(`/${user.uid}/jobs`);
    }
  }, [user, router]);

  return null;
}
