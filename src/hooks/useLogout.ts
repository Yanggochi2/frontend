"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toErrorMessage } from "@/lib/apiErrorMessage";
import { logout } from "@/services/authApi";

export function useLogout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    try {
      await logout();
      // TODO: 로그인 화면이 Figma에 없어 route가 없다. 확정 전까지 홈으로 보낸다.
      router.replace("/");
      router.refresh();
    } catch (e) {
      setError(toErrorMessage(e));
      setLoading(false);
    }
  }

  return { run, loading, error };
}
