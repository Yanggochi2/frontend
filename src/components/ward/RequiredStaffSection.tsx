"use client";

import { useState } from "react";
import StaffStepper from "@/components/onboarding/StaffStepper";
import AdminButton from "@/components/ui/AdminButton";
import { REQUIRED_STAFF_PER_DAY } from "@/constants/rules.constants";
import { useSubmit } from "@/hooks/useSubmit";
import { updateRequiredStaff } from "@/services/wardApi";
import type { WardSettingsData } from "@/types/ward.type";

type Staff = WardSettingsData["dailyRequired"];

const SHIFTS: { kind: keyof Staff; label: string }[] = [
  { kind: "D", label: "D 데이" },
  { kind: "E", label: "E 이브닝" },
  { kind: "N", label: "N 나이트" },
];

const same = (a: Staff, b: Staff) => a.D === b.D && a.E === b.E && a.N === b.N;
const DEFAULT: Staff = { ...REQUIRED_STAFF_PER_DAY };

// 병동 설정의 하루 필요 인원. ＋/－로 고치고 저장한다. 고치지 않으면 병동에 저장된 값(새 병동은 기본 7·5·5)을 쓴다.
export default function RequiredStaffSection({ initial }: { initial: Staff }) {
  const [saved, setSaved] = useState(initial);
  const [staff, setStaff] = useState(initial);
  const [done, setDone] = useState(false);
  const { submit, loading, error } = useSubmit();

  const changed = !same(staff, saved);
  const empty = staff.D + staff.E + staff.N === 0;

  function change(next: Staff) {
    setStaff(next);
    setDone(false);
  }

  async function save() {
    const ok = await submit(async () => {
      const result = await updateRequiredStaff(staff);
      setSaved(result);
      setStaff(result);
    });
    setDone(ok);
  }

  return (
    <>
      <div className="grid w-full max-w-[720px] grid-cols-3 gap-3">
        {SHIFTS.map(({ kind, label }) => (
          <StaffStepper key={kind} label={label} value={staff[kind]} onChange={(v) => change({ ...staff, [kind]: v })} />
        ))}
      </div>
      <p className="text-[16px] leading-normal font-medium text-ink-sub">
        근무표의 인원 검사와 자동 생성에 이 값을 써요. 기본값은 D {DEFAULT.D} · E {DEFAULT.E} · N {DEFAULT.N}이에요.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <AdminButton onClick={() => change(DEFAULT)} disabled={loading || same(staff, DEFAULT)}>
          기본값으로
        </AdminButton>
        <AdminButton onClick={() => change(saved)} disabled={loading || !changed}>
          되돌리기
        </AdminButton>
        <AdminButton variant="primary" onClick={save} disabled={loading || !changed || empty}>
          {loading ? "저장 중…" : "저장"}
        </AdminButton>
        {done && !changed ? (
          <p role="status" className="text-[16px] font-medium text-ink-sub">
            저장했어요
          </p>
        ) : null}
      </div>
      {empty ? (
        <p role="alert" className="text-[16px] font-medium text-danger">
          D·E·N 중 하나는 1명 이상이어야 해요.
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="text-[16px] font-medium text-danger">
          {error}
        </p>
      ) : null}
    </>
  );
}
