"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminButton from "@/components/ui/AdminButton";
import { useSubmit } from "@/hooks/useSubmit";
import { rejectJoinRequest } from "@/services/approvalsApi";
import type { JoinRequest } from "@/types/approvals.type";
import type { Nurse } from "@/types/nurses.type";
import ApprovalLinkDialog from "./ApprovalLinkDialog";

export default function ApprovalRowActions({ request, unlinkedNurses }: { request: JoinRequest; unlinkedNurses: Nurse[] }) {
  const router = useRouter();
  const { submit, loading, error, setError } = useSubmit();
  const [linking, setLinking] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  async function reject() {
    if (reason.trim() === "") {
      setError("반려 사유를 입력해 주세요.");
      return;
    }
    if (await submit(() => rejectJoinRequest(request.id, reason.trim()))) router.refresh();
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
          <AdminButton variant="primary" onClick={() => setLinking(true)} disabled={loading}>승인</AdminButton>
          <AdminButton onClick={() => setRejecting(true)} disabled={loading}>반려</AdminButton>
        </div>
      )}
      {error ? <p role="alert" className="text-[15px] font-medium text-danger">{error}</p> : null}
      {linking ? (
        <ApprovalLinkDialog
          request={request}
          unlinkedNurses={unlinkedNurses}
          onApproved={() => {
            setLinking(false);
            router.refresh();
          }}
          onClose={() => setLinking(false)}
        />
      ) : null}
    </div>
  );
}
