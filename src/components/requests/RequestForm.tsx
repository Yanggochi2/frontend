"use client";

import { useState } from "react";
import RnButton from "@/components/ui/RnButton";
import { REQUEST_KIND_OPTIONS } from "@/constants/requests.constants";
import type { RequestFormOptions, RequestKind } from "@/types/requests.type";
import RequestCalendar, { formatRange, type DayRange } from "./RequestCalendar";

export default function RequestForm({ options }: { options: RequestFormOptions }) {
  const { year, month, today, initialSelectedDay, reasons } = options;
  const [kind, setKind] = useState<RequestKind>("ANNUAL");
  const [reason, setReason] = useState(reasons[0] ?? "");
  const [range, setRange] = useState<DayRange>({ start: initialSelectedDay, end: initialSelectedDay });

  return (
    // TODO: 신청 제출은 백엔드 확정 후 연결 (지금은 화면만)
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-8">
      <div className="flex items-start gap-6">
        <section className="flex w-full max-w-[640px] flex-1 flex-col gap-4 rounded-[20px] border border-line bg-white px-7 py-[26px]">
          <h2 className="text-[20px] font-bold text-ink">어떤 신청인가요?</h2>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="신청 종류">
            {REQUEST_KIND_OPTIONS.map((o) => {
              const selected = kind === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setKind(o.value)}
                  className={`flex flex-col items-start gap-1.5 rounded-[16px] px-5 py-[18px] text-left ${
                    selected ? "border-2 border-brand bg-brand-soft" : "border border-line bg-white"
                  }`}
                >
                  <span className={`text-[22px] font-bold ${selected ? "text-brand" : "text-ink"}`}>
                    {o.label}
                  </span>
                  <span className="text-[16px] font-medium text-ink-sub">{o.description}</span>
                </button>
              );
            })}
          </div>
          <label htmlFor="request-reason" className="text-[20px] font-bold text-ink">
            사유
          </label>
          <div className="relative">
            <select
              id="request-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-14 w-full appearance-none rounded-[14px] bg-surface px-5 text-[18px] font-medium text-ink"
            >
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <span aria-hidden className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-[18px] font-bold text-ink-sub">
              ▾
            </span>
          </div>
          <p className="text-[16px] font-medium text-ink-mute">
            관리자에게만 보여요. 다른 간호사에게는 보이지 않아요.
          </p>
        </section>

        <section className="flex w-full max-w-[680px] flex-1 flex-col gap-4 rounded-[20px] border border-line bg-white px-7 py-[26px]">
          <div className="flex h-8 items-center gap-3 text-[24px] font-bold text-ink-sub">
            <h2 className="flex-1 text-[22px] text-ink">{`${year}년 ${month}월`}</h2>
            {/* TODO: 월 이동은 시안에 동작 정의 없음. 표시만 한다. */}
            <span aria-hidden>‹</span>
            <span aria-hidden>›</span>
          </div>
          <RequestCalendar year={year} month={month} today={today} range={range} onChange={setRange} />
          <p className="w-full max-w-[624px] rounded-[14px] bg-brand-soft px-5 py-3.5 text-[17px] font-bold whitespace-pre text-brand">
            {`선택한 날짜  ${formatRange(month, year, range)}`}
          </p>
        </section>
      </div>

      <div className="flex items-center justify-end gap-3">
        <RnButton variant="secondary" size="lg" href="/requests">
          취소
        </RnButton>
        <RnButton variant="primary" size="lg" type="submit" className="px-10">
          신청하기
        </RnButton>
      </div>
    </form>
  );
}
