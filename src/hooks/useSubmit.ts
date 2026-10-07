"use client";

import { useState } from "react";
import { toErrorMessage } from "@/lib/apiErrorMessage";

// 폼/버튼 제출용: loading과 오류 문구를 관리한다. 성공하면 true.
export function useSubmit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(action: () => Promise<unknown>): Promise<boolean> {
    if (loading) return false;
    setLoading(true);
    setError(null);
    try {
      await action();
      return true;
    } catch (e) {
      setError(toErrorMessage(e));
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { submit, loading, error, setError };
}
