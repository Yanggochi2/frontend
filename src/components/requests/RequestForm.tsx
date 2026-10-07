"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import RnButton from "@/components/ui/RnButton";
import { REQUEST_KIND_OPTIONS, REQUEST_REASON_ETC } from "@/constants/requests.constants";
import { formatApiError } from "@/lib/formatApiError";
import { createRequest } from "@/services/requestsApi";
import type { RequestFormOptions, RequestKind } from "@/types/requests.type";
import RequestCalendar, { formatRange, type DayRange } from "./RequestCalendar";

export default function RequestForm({ options }: { options: RequestFormOptions }) {
  const { year, month, today, initialSelectedDay, reasons } = options;
  const router = useRouter();
  const [kind, setKind] = useState<RequestKind>("ANNUAL_LEAVE");
  const [reason, setReason] = useState(reasons[0]?.value ?? "");
  const [reasonDetail, setReasonDetail] = useState("");
  const [range, setRange] = useState<DayRange>({ start: initialSelectedDay, end: initialSelectedDay });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const detail = reasonDetail.trim();
    if (reason === REQUEST_REASON_ETC && detail === "") {
      setError("사유를 직접 입력해 주세요. (기타 선택 시 필수)");
      return;
    }
    // 선택한 연속 구간을 YYYY-MM-DD 목록으로 만든다 (같은 달, 중복 없음).
    const targetDates = Array.from({ length: range.end - range.start + 1 }, (_, i) => {
      const day = range.start + i;
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    });
    setBusy(true);
    setError(null);
    try {
      // TODO: PREFERRED_SHIFT 선택 UI가 없어 preferredDuty는 보내지 않는다.
      await createRequest({
        type: kind,
        targetDates,
        reasonCode: reason,
        ...(reason === REQUEST_REASON_ETC ? { reasonDetail: detail } : {}),
      });
      router.push("/requests");
    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
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
                    selected ? "border-2 border-primary bg-primary-soft" : "border border-line bg-white"
                  }`}
                >
                  <span className={`text-[22px] font-bold ${selected ? "text-primary" : "text-ink"}`}>
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
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
            <span aria-hidden className="pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-[18px] font-bold text-ink-sub">
              ▾
            </span>
          </div>
          {reason === REQUEST_REASON_ETC ? (
            <input
              type="text"
              value={reasonDetail}
              onChange={(e) => setReasonDetail(e.target.value)}
              placeholder="사유를 직접 입력해요"
              aria-label="사유 상세"
              className="h-14 w-full rounded-[14px] bg-surface px-5 text-[18px] font-medium text-ink placeholder:text-ink-faint"
            />
          ) : null}
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
        {error ? (
          <p role="alert" className="mr-auto text-[16px] font-medium text-danger">
            {error}
          </p>
        ) : null}
        <RnButton variant="secondary" size="lg" href="/requests">
          취소
        </RnButton>
        <RnButton variant="primary" size="lg" type="submit" disabled={busy} className="px-10">
          신청하기
        </RnButton>
      </div>
    </form>
  );
}
