"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminButton from "@/components/ui/AdminButton";
import { useSubmit } from "@/hooks/useSubmit";
import { approveJoinRequest, rejectJoinRequest } from "@/services/approvalsApi";

export default function ApprovalRowActions({ id }: { id: string }) {
  const router = useRouter();
  const { submit, loading, error, setError } = useSubmit();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  async function approve() {
    if (await submit(() => approveJoinRequest(id))) router.refresh();
  }

  async function reject() {
    if (reason.trim() === "") {
      setError("반려 사유를 입력해 주세요.");
      return;
    }
    if (await submit(() => rejectJoinRequest(id, reason.trim()))) router.refresh();
  }

  return (
    <div className="flex flex-col items-start gap-2">
      {rejecting ? (
        <div className="flex gap-3">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="반려 사유"
            aria-label="반려 사유"
            className="h-12 w-48 rounded-[12px] bg-surface px-4 text-[16px] font-medium text-ink"
          />
          <AdminButton variant="primary" onClick={reject} disabled={loading}>반려 확인</AdminButton>
          <AdminButton onClick={() => setRejecting(false)} disabled={loading}>취소</AdminButton>
        </div>
      ) : (
        <div className="flex gap-3">
          <AdminButton variant="primary" onClick={approve} disabled={loading}>승인</AdminButton>
          <AdminButton onClick={() => setRejecting(true)} disabled={loading}>반려</AdminButton>
        </div>
      )}
      {error ? <p role="alert" className="text-[15px] font-medium text-danger">{error}</p> : null}
    </div>
  );
}
