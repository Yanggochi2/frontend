"use client";

import { useRouter } from "next/navigation";
import AdminButton from "@/components/ui/AdminButton";
import { useSubmit } from "@/hooks/useSubmit";
import { applyRulePreset } from "@/services/rulesApi";

// RULE-03. 규칙을 기본 프리셋(STANDARD) 값으로 되돌린다. 필요 인원(듀티별 필요 인원)은 유지된다.
// TODO: 프리셋 선택(STANDARD/MINIMAL) UI는 시안 확정 후
export default function RulePresetButton() {
  const router = useRouter();
  const { submit, loading, error } = useSubmit();

  async function apply() {
    if (!window.confirm("규칙을 일반 병동 기본값으로 되돌릴까요? 필요 인원은 그대로 둬요.")) return;
    if (await submit(() => applyRulePreset("STANDARD"))) router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <AdminButton onClick={apply} disabled={loading}>
        프리셋 다시 적용
      </AdminButton>
      {error ? (
        <p role="alert" className="text-[15px] font-bold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
