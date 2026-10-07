"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSubmit } from "@/hooks/useSubmit";
import { createWard } from "@/services/onboardingApi";
import OnboardingButton from "@/components/ui/OnboardingButton";
import OnboardingCard from "@/components/ui/OnboardingCard";
import OnboardingInput from "@/components/ui/OnboardingInput";
import type { CreateWardDefaults, ShiftKind } from "@/types/onboarding.type";
import StaffStepper from "./StaffStepper";

type Props = { defaults: CreateWardDefaults };

const SHIFTS: ShiftKind[] = ["D", "E", "N"];
const labelClass = "text-lg font-bold text-ink";

export default function CreateWardForm({ defaults }: Props) {
  const [hospital, setHospital] = useState("");
  const [ward, setWard] = useState("");
  const [staff, setStaff] = useState(defaults.requiredStaff);
  const [presetId, setPresetId] = useState(defaults.defaultPresetId);

  const router = useRouter();
  const { submit, loading, error } = useSubmit();
  const canSubmit = hospital.trim() !== "" && ward.trim() !== "" && !loading;

  async function handleSubmit() {
    if (!canSubmit) return;
    const ok = await submit(() =>
      createWard({
        hospitalName: hospital.trim(),
        wardName: ward.trim(),
        requiredStaff: staff,
        rulePreset: presetId,
      }),
    );
    // TODO: 개설 후 이동 경로는 백엔드 확정 후 결정 (프로토타입: 근무표 빈 상태)
    if (ok) router.push("/schedule");
  }

  return (
    <OnboardingCard className="flex w-full max-w-180 flex-col gap-[22px] px-10 py-9">
      <label htmlFor="hospital" className={labelClass}>병원 이름</label>
      <OnboardingInput
        id="hospital"
        value={hospital}
        onChange={(e) => setHospital(e.target.value)}
        placeholder="병원 이름을 입력해요"
      />
      <label htmlFor="ward" className={labelClass}>병동 이름</label>
      <OnboardingInput
        id="ward"
        value={ward}
        onChange={(e) => setWard(e.target.value)}
        placeholder="병동 이름을 입력해요"
      />
      <p className={labelClass}>하루에 필요한 인원</p>
      <div className="grid grid-cols-3 gap-3">
        {SHIFTS.map((kind) => (
          <StaffStepper
            key={kind}
            label={kind}
            value={staff[kind]}
            onChange={(next) => setStaff((s) => ({ ...s, [kind]: next }))}
          />
        ))}
      </div>
      <p className={labelClass}>규칙은 어떻게 시작할까요?</p>
      <div role="radiogroup" className="grid grid-cols-2 gap-3">
        {defaults.presets.map((p) => {
          const selected = p.id === presetId;
          return (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setPresetId(p.id)}
              className={`flex h-14 cursor-pointer items-center justify-center rounded-[14px] px-5 text-lg ${
                selected
                  ? "border-2 border-primary bg-primary-soft font-bold text-primary"
                  : "bg-surface font-medium text-ink-sub"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
      {error ? <p role="alert" className="text-base font-medium text-danger">{error}</p> : null}
      <div className="flex justify-end">
        <OnboardingButton onClick={handleSubmit} disabled={!canSubmit}>
          {loading ? "만드는 중…" : "병동 만들기"}
        </OnboardingButton>
      </div>
    </OnboardingCard>
  );
}
