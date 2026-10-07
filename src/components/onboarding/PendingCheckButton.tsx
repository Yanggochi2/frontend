"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import OnboardingButton from "@/components/ui/OnboardingButton";
import { useSubmit } from "@/hooks/useSubmit";
import { getEntryPath } from "@/services/authApi";

// 승인됐는지 다시 확인한다. 소속이 생겼으면 근무표로 간다.
// TODO: 반려 여부·사유를 알 수 있는 API가 명세에 없다. 확정되면 반려 안내를 보여 준다.
export default function PendingCheckButton() {
  const router = useRouter();
  const [note, setNote] = useState<string | null>(null);
  const { submit, loading, error } = useSubmit();

  async function check() {
    setNote(null);
    let next = "";
    const ok = await submit(async () => {
      next = await getEntryPath();
    });
    if (!ok) return;
    if (next === "/schedule") {
      router.replace(next);
      router.refresh();
    } else {
      setNote("아직 승인 전이에요. 조금 뒤에 다시 확인해 주세요.");
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <OnboardingButton onClick={check} disabled={loading}>
        {loading ? "확인하는 중…" : "승인됐는지 확인"}
      </OnboardingButton>
      {note || error ? (
        <p role="status" className={`text-base font-medium ${error ? "text-danger" : "text-ink-sub"}`}>
          {error ?? note}
        </p>
      ) : null}
    </div>
  );
}
