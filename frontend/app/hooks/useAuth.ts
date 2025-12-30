"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/me`,
          { credentials: "include" }
        );

        if (!res.ok) {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  return { loading };
}
