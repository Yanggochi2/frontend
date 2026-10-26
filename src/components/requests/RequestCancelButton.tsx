"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import RnButton from "@/components/ui/RnButton";
import { formatApiError } from "@/lib/formatApiError";
import { cancelRequest } from "@/services/requestsApi";

// 내 신청 한 줄의 취소(REQ-07). 근무표가 확정되기 전까지만 된다.
export default function RequestCancelButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cancel() {
    setBusy(true);
    setError(null);
    try {
      await cancelRequest(id);
      router.refresh();
    } catch (e) {
      setError(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div>
        <RnButton variant="secondary" disabled={busy} onClick={cancel}>
          신청 취소
        </RnButton>
      </div>
      {error ? (
        <p role="alert" className="text-[15px] font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
