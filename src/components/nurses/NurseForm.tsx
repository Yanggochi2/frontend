"use client";

import { useState, type ReactNode } from "react";
import RnButton from "@/components/ui/RnButton";
import RnOptionButton from "@/components/ui/RnOptionButton";
import {
  DUTY_ROLE_LABEL,
  NURSE_ROLE_LABEL,
  NURSE_STATUS_LABEL,
  REGISTRABLE_STATUSES,
  SKILL_LEVELS,
} from "@/constants/nurses.constants";
import type { DutyRole, NurseRole, NurseStatus } from "@/types/nurses.type";

const inputCls =
  "h-14 w-full rounded-[14px] bg-surface px-5 text-[18px] font-medium text-ink placeholder:text-ink-faint";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[18px] font-bold text-ink">{label}</span>
        {hint ? <span className="text-[15px] font-medium text-ink-faint">{hint}</span> : null}
      </div>
      {children}
    </div>
  );
}

const ROLES: NurseRole[] = ["NURSE", "HEAD_NURSE"];
const DUTY_ROLES: DutyRole[] = ["GENERAL", "CHARGE", "PRECEPTOR", "NEWBIE"];

export default function NurseForm() {
  const [role, setRole] = useState<NurseRole>("NURSE");
  const [dutyRole, setDutyRole] = useState<DutyRole>("GENERAL");
  const [status, setStatus] = useState<NurseStatus>("ACTIVE");
  const [skill, setSkill] = useState(3);

  return (
    // TODO: 등록 제출/검증은 백엔드 확정 후 연결 (지금은 화면만)
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-8">
      <div className="flex items-start gap-6">
        <div className="grid w-full max-w-[904px] flex-1 grid-cols-2 gap-x-6 gap-y-7 rounded-[20px] border border-line bg-white p-8">
          <Field label="이름">
            <input type="text" name="name" placeholder="이름을 입력해요" className={inputCls} />
          </Field>
          <Field label="입사일">
            <input type="date" name="hireDate" aria-label="입사일" className={inputCls} />
          </Field>

          <Field label="권한">
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <RnOptionButton key={r} selected={role === r} onClick={() => setRole(r)}>
                  {NURSE_ROLE_LABEL[r]}
                </RnOptionButton>
              ))}
            </div>
          </Field>
          <Field label="듀티 역할" hint="차지·프리셉터·신입은 근무 배정 규칙이 달라요">
            <div className="flex flex-wrap gap-2">
              {DUTY_ROLES.map((r) => (
                <RnOptionButton key={r} selected={dutyRole === r} onClick={() => setDutyRole(r)}>
                  {DUTY_ROLE_LABEL[r]}
                </RnOptionButton>
              ))}
            </div>
          </Field>

          <Field label="총 경력" hint="입사 전 경력까지 합쳐요">
            <div className="flex items-center gap-2.5">
              <input type="number" min={0} name="careerYears" defaultValue={0} aria-label="경력 년" className={`${inputCls} max-w-[150px]`} />
              <span className="text-[18px] font-medium text-ink-sub">년</span>
              <input type="number" min={0} max={11} name="careerMonths" defaultValue={0} aria-label="경력 개월" className={`${inputCls} max-w-[150px]`} />
              <span className="text-[18px] font-medium text-ink-sub">개월</span>
            </div>
          </Field>
          <Field label="숙련도" hint="수간호사만 볼 수 있어요">
            <div className="flex flex-wrap gap-2">
              {SKILL_LEVELS.map((lv) => (
                <RnOptionButton
                  key={lv}
                  selected={skill === lv}
                  onClick={() => setSkill(lv)}
                  className="w-[72px] text-[20px]"
                >
                  {lv}
                </RnOptionButton>
              ))}
            </div>
          </Field>

          <Field label="상태">
            <div className="flex flex-wrap gap-2">
              {REGISTRABLE_STATUSES.map((s) => (
                <RnOptionButton key={s} selected={status === s} onClick={() => setStatus(s)}>
                  {NURSE_STATUS_LABEL[s]}
                </RnOptionButton>
              ))}
            </div>
          </Field>
          <Field label="소속 시작일" hint="이 날짜 전 칸은 편집할 수 없어요">
            <input type="date" name="periodStart" aria-label="소속 시작일" className={inputCls} />
          </Field>
        </div>

        <aside className="flex w-[416px] shrink-0 flex-col gap-3.5 rounded-[20px] bg-brand-soft p-7">
          <h2 className="text-[20px] font-bold text-brand">등록하면</h2>
          {[
            "· 근무표에 이 간호사의 줄이 생겨요",
            "· 소속 시작일 전 날짜는 회색으로 막혀요",
            "· 일반 간호사에게는 이름과 역할만 보여요",
            "· 차지, 신입 같은 역할은 규칙에 따라 자동으로 검사돼요",
          ].map((t) => (
            <p key={t} className="text-[17px] font-medium text-ink">
              {t}
            </p>
          ))}
        </aside>
      </div>

      <div className="flex items-center justify-end gap-3">
        <RnButton variant="secondary" size="lg" href="/nurses">
          취소
        </RnButton>
        <RnButton variant="primary" size="lg" type="submit" className="px-10">
          등록하기
        </RnButton>
      </div>
    </form>
  );
}
