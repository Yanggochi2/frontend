"use client";

import type { ReactNode } from "react";
import RnOptionButton from "@/components/ui/RnOptionButton";
import {
  NURSE_RESTRICTION_HINT,
  NURSE_RESTRICTION_LABEL,
  NURSE_RESTRICTIONS,
  SKILL_GROUPS,
} from "@/constants/nurses.constants";
import { draftCareerMonths } from "@/lib/nurseDraft";
import { recommendSkillGroup } from "@/lib/skillGroup";
import type { NurseDraft } from "@/types/nurses.type";

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

// 년 + 개월 입력
function YearMonth({
  label,
  years,
  months,
  onChange,
}: {
  label: string;
  years: string;
  months: string;
  onChange: (years: string, months: string) => void;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <input
        type="number"
        min={0}
        aria-label={`${label} 년`}
        value={years}
        onChange={(e) => onChange(e.target.value, months)}
        className={`${inputCls} max-w-[150px]`}
      />
      <span className="text-[18px] font-medium text-ink-sub">년</span>
      <input
        type="number"
        min={0}
        max={11}
        aria-label={`${label} 개월`}
        value={months}
        onChange={(e) => onChange(years, e.target.value)}
        className={`${inputCls} max-w-[150px]`}
      />
      <span className="text-[18px] font-medium text-ink-sub">개월</span>
    </div>
  );
}

type Props = {
  draft: NurseDraft;
  onChange: (patch: Partial<NurseDraft>) => void;
};

// 간호사 등록 입력칸. 2열 grid 안에 놓는다 (간호사 등록 화면, 가입 승인 창에서 같이 쓴다).
// 비즈니스 로직(10-19, 2장): 권한·듀티 역할은 고르지 않는다. 차지는 날짜별 근무에 따로 지정한다.
export default function NurseProfileFields({ draft, onChange }: Props) {
  const { total, ward } = draftCareerMonths(draft);
  const recommendation = recommendSkillGroup(total, ward);
  const restrictionHint = NURSE_RESTRICTION_HINT[draft.restriction];

  return (
    <>
      <Field label="이름">
        <input
          type="text"
          required
          maxLength={50}
          placeholder="이름을 입력해요"
          value={draft.name}
          onChange={(e) => onChange({ name: e.target.value })}
          className={inputCls}
        />
      </Field>
      <Field label="입사일">
        <input
          type="date"
          required
          aria-label="입사일"
          value={draft.hireDate}
          onChange={(e) => onChange({ hireDate: e.target.value })}
          className={inputCls}
        />
      </Field>

      <Field label="총 경력" hint="입사 전 경력까지 합쳐요">
        <YearMonth
          label="경력"
          years={draft.careerYears}
          months={draft.careerMonths}
          onChange={(careerYears, careerMonths) => onChange({ careerYears, careerMonths })}
        />
      </Field>
      <Field label="병동 경력" hint="지금 병동에서 일한 기간">
        <YearMonth
          label="병동 경력"
          years={draft.wardYears}
          months={draft.wardMonths}
          onChange={(wardYears, wardMonths) => onChange({ wardYears, wardMonths })}
        />
      </Field>

      <div className="col-span-2">
        <Field label="근무 제한" hint={restrictionHint || undefined}>
          <div className="flex flex-wrap gap-2">
            {NURSE_RESTRICTIONS.map((r) => (
              <RnOptionButton key={r} selected={draft.restriction === r} onClick={() => onChange({ restriction: r })}>
                {NURSE_RESTRICTION_LABEL[r]}
              </RnOptionButton>
            ))}
          </div>
        </Field>
      </div>

      <Field label="숙련 그룹" hint="수간호사만 볼 수 있어요">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            {SKILL_GROUPS.map((g) => (
              <RnOptionButton key={g} selected={draft.skillGroup === g} onClick={() => onChange({ skillGroup: g })}>
                {g}
              </RnOptionButton>
            ))}
          </div>
          <p className="text-[15px] font-medium text-ink-sub">
            추천: <b className="text-primary">{recommendation.group}</b> (총경력 30% + 병동 경력 70% ={" "}
            {recommendation.years.toFixed(1)}년)
            {draft.skillGroup !== recommendation.group ? (
              <button
                type="button"
                onClick={() => onChange({ skillGroup: recommendation.group })}
                className="ml-2 font-bold text-primary underline"
              >
                추천대로 고르기
              </button>
            ) : null}
          </p>
        </div>
      </Field>
      <Field label="프리셉터" hint="보통 4~5년차예요">
        <div className="flex gap-2">
          <RnOptionButton selected={!draft.isPreceptor} onClick={() => onChange({ isPreceptor: false })}>
            아니요
          </RnOptionButton>
          <RnOptionButton selected={draft.isPreceptor} onClick={() => onChange({ isPreceptor: true })}>
            프리셉터
          </RnOptionButton>
        </div>
      </Field>

      <Field label="소속 시작일" hint="이 날짜 전 칸은 편집할 수 없어요">
        <input
          type="date"
          required
          aria-label="소속 시작일"
          value={draft.periodStart}
          onChange={(e) => onChange({ periodStart: e.target.value })}
          className={inputCls}
        />
      </Field>
      <div className="col-span-2">
        <Field label="히스토리" hint="이전 근무 병동, 전입·복귀 이력 등 (선택)">
          <textarea
            rows={3}
            maxLength={500}
            placeholder="예: 2022년 내과 병동에서 전입, 2025년 출산 휴가 후 복귀"
            value={draft.history}
            onChange={(e) => onChange({ history: e.target.value })}
            className={`${inputCls} h-auto resize-none py-4`}
          />
        </Field>
      </div>
    </>
  );
}
