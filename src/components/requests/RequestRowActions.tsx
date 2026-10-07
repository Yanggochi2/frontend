"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RnButton from "@/components/ui/RnButton";
import { formatApiError } from "@/lib/formatApiError";
import { approveRequest, rejectRequest } from "@/services/requestsApi";

// 신청 한 줄의 승인/반려(REQ-05, REQ-06). 반려는 사유가 필요하다.
export default function RequestRowActions({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function run(action: () => Promise<unknown>) {
    setBusy(true);
    setError(null);
    try {
      const result = await action();
      // 서비스가 null을 주면 API 미설정(화면만 동작)이라 새로고침하지 않는다.
      if (result !== null) router.refresh();
    } catch (e) {
      setError(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        {rejecting ? (
          <>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="반려 사유"
              aria-label="반려 사유"
              className="h-12 w-[180px] rounded-[12px] bg-surface px-4 text-[16px] font-medium text-ink placeholder:text-ink-faint"
            />
            <RnButton
              variant="primary"
              disabled={busy || reason.trim() === ""}
              onClick={() => run(() => rejectRequest(id, reason.trim()))}
            >
              반려 확인
            </RnButton>
            <RnButton variant="secondary" disabled={busy} onClick={() => setRejecting(false)}>
              취소
            </RnButton>
          </>
        ) : (
          <>
            <RnButton variant="primary" disabled={busy} onClick={() => run(() => approveRequest(id))}>
              승인
            </RnButton>
            <RnButton variant="secondary" disabled={busy} onClick={() => setRejecting(true)}>
              반려
            </RnButton>
          </>
        )}
      </div>
      {error ? (
        <p role="alert" className="text-[15px] font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
