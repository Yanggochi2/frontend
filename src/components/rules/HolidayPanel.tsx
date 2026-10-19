"use client";

import { useState } from "react";
import AdminButton from "@/components/ui/AdminButton";
import { AdminTableEmptyRow, AdminTableShell, AdminTd, AdminTh, AdminTr } from "@/components/ui/AdminTable";
import { useHolidays } from "@/hooks/useHolidays";
import { useSubmit } from "@/hooks/useSubmit";
import { monthDates, shiftMonth, todayKst } from "@/lib/schedulePeriod";
import { putHoliday } from "@/services/rulesApi";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const inputCls = "h-12 rounded-[12px] bg-surface px-4 text-[17px] font-medium text-ink placeholder:text-ink-faint";

function dateLabel(date: string) {
  const weekday = WEEKDAYS[new Date(`${date}T00:00:00Z`).getUTCDay()];
  return `${Number(date.slice(5, 7))}월 ${Number(date.slice(8))}일 (${weekday})`;
}

// 공휴일 탭: 월별 공휴일 목록, 병원 지정 휴일 추가·해제 (RULE-04, 05)
export default function HolidayPanel() {
  const [yearMonth, setYearMonth] = useState(() => todayKst().yearMonth);
  const { items, loading, error, reload } = useHolidays(yearMonth);
  const save = useSubmit();
  const dates = monthDates(yearMonth);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");

  async function add() {
    if (!date) return;
    const ok = await save.submit(() => putHoliday(date, { isHoliday: true, name: name.trim() || undefined }));
    if (!ok) return;
    setDate("");
    setName("");
    reload();
  }

  async function remove(target: string) {
    if (await save.submit(() => putHoliday(target, { isHoliday: false }))) reload();
  }

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="이전 달"
            onClick={() => setYearMonth((v) => shiftMonth(v, -1))}
            className="flex size-11 items-center justify-center rounded-[14px] bg-surface text-[22px] font-bold text-ink-sub"
          >
            ‹
          </button>
          <p className="min-w-[150px] text-center text-[22px] font-bold text-ink">
            {yearMonth.slice(0, 4)}년 {Number(yearMonth.slice(5))}월
          </p>
          <button
            type="button"
            aria-label="다음 달"
            onClick={() => setYearMonth((v) => shiftMonth(v, 1))}
            className="flex size-11 items-center justify-center rounded-[14px] bg-surface text-[22px] font-bold text-ink-sub"
          >
            ›
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={date}
            min={dates[0]}
            max={dates[dates.length - 1]}
            onChange={(e) => setDate(e.target.value)}
            aria-label="휴일 날짜"
            className={inputCls}
          />
          <input
            type="text"
            value={name}
            maxLength={30}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름 (예: 개원기념일)"
            aria-label="휴일 이름"
            className={`${inputCls} w-56`}
          />
          <AdminButton variant="primary" onClick={add} disabled={!date || save.loading}>
            휴일 추가
          </AdminButton>
        </div>
      </div>
      <p className="text-[16px] font-medium text-ink-sub">
        여기 등록한 날은 근무표에서 빨간 날로 보이고, 월 휴무 수를 셀 때 공휴일로 들어가요.
      </p>
      {error || save.error ? (
        <p role="alert" className="text-[16px] font-bold text-danger">
          {error ?? save.error}
        </p>
      ) : null}
      <AdminTableShell minWidth="min-w-[700px]">
        <thead>
          <tr>
            <AdminTh first className="w-[240px]">날짜</AdminTh>
            <AdminTh>이름</AdminTh>
            <AdminTh className="w-[120px]">
              <span className="sr-only">해제</span>
            </AdminTh>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <AdminTableEmptyRow colSpan={3}>불러오는 중…</AdminTableEmptyRow>
          ) : items.length === 0 ? (
            <AdminTableEmptyRow colSpan={3}>이 달에 등록한 공휴일이 없어요</AdminTableEmptyRow>
          ) : null}
          {loading
            ? null
            : items.map((h) => (
                <AdminTr key={h.date}>
                  <AdminTd first className="text-danger">
                    {dateLabel(h.date)}
                  </AdminTd>
                  <AdminTd>{h.name}</AdminTd>
                  <AdminTd>
                    <button
                      type="button"
                      onClick={() => remove(h.date)}
                      disabled={save.loading}
                      className="text-[17px] font-bold text-primary disabled:opacity-50"
                    >
                      해제
                    </button>
                  </AdminTd>
                </AdminTr>
              ))}
        </tbody>
      </AdminTableShell>
    </div>
  );
}
