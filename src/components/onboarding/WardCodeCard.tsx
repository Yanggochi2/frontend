"use client";

import { useState } from "react";
import OnboardingButton from "@/components/ui/OnboardingButton";
import OnboardingCard from "@/components/ui/OnboardingCard";
import OnboardingInput from "@/components/ui/OnboardingInput";
import { WARD_CODE_MAX_LENGTH } from "./onboarding.constants";

type Props = { placeholder: string };

export default function WardCodeCard({ placeholder }: Props) {
  const [code, setCode] = useState("");

  // TODO: 백엔드 확정 후 연동 (가입 신청 요청, 코드 검증, 시도 횟수 제한)
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
      <OnboardingButton href="/onboarding/pending">가입 신청하기</OnboardingButton>
    </OnboardingCard>
  );
}
