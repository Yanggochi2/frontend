"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSubmit } from "@/hooks/useSubmit";
import { requestWardJoin } from "@/services/onboardingApi";
import OnboardingButton from "@/components/ui/OnboardingButton";
import OnboardingCard from "@/components/ui/OnboardingCard";
import OnboardingInput from "@/components/ui/OnboardingInput";
import { WARD_CODE_MAX_LENGTH } from "./onboarding.constants";

type Props = { placeholder: string; initialCode?: string };

export default function WardCodeCard({ placeholder, initialCode = "" }: Props) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode.toUpperCase().slice(0, WARD_CODE_MAX_LENGTH));
  const { submit, loading, error } = useSubmit();
  const canSubmit = code.trim() !== "" && !loading;

  async function handleSubmit() {
    if (!canSubmit) return;
    if (await submit(() => requestWardJoin(code.trim()))) router.push("/onboarding/pending");
  }

  // TODO(🔶 AUTH-00): 코드 입력 시도 횟수 제한 표시는 확정 후 (서버는 429 RATE_LIMITED로 응답)
  return (
    <OnboardingCard className="flex flex-col items-start gap-3.5 p-9">
      <h2 className="text-2xl font-bold text-ink">병동 코드가 있어요</h2>
      <p className="text-[17px] font-medium text-ink-sub">
        수간호사에게 받은 코드를 입력해요
      </p>
      <OnboardingInput
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder={placeholder}
        maxLength={WARD_CODE_MAX_LENGTH}
        aria-label="병동 코드"
      />
      {error ? <p role="alert" className="text-base font-medium text-danger">{error}</p> : null}
      <OnboardingButton onClick={handleSubmit} disabled={!canSubmit}>
        {loading ? "신청하는 중…" : "가입 신청하기"}
      </OnboardingButton>
    </OnboardingCard>
  );
}
