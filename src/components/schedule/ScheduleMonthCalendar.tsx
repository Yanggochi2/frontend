"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CoverageStatus, DutyCode, ScheduleDay, ScheduleRow } from "@/types/schedule.type";
import { DUTY_STYLE } from "./dutyStyle";

type Props = {
  yearMonth: string;
  days: ScheduleDay[];
  rows: ScheduleRow[];
  coverage: CoverageStatus[] | null;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const DUTIES: DutyCode[] = ["D", "E", "N", "O", "AL", "ED"];

export default function ScheduleMonthCalendar({ yearMonth, days, rows, coverage }: Props) {
  const todayIndex = days.findIndex((day) => day.isToday);
  const [selected, setSelected] = useState(todayIndex >= 0 ? todayIndex : 0);
  const firstWeekday = new Date(`${yearMonth}-01T00:00:00Z`).getUTCDay();
  const totalSlots = Math.ceil((firstWeekday + days.length) / 7) * 7;
  const selectedDay = days[selected];
  const assignments = useMemo(
    () => rows.map((row) => ({ name: row.name, nurseKey: row.nurseKey, cell: row.cells[selected] })),
    [rows, selected],
  );
  const week = Math.ceil(selectedDay.date / 7);

  return (
    <div className="absolute inset-0 grid min-h-0 grid-cols-[minmax(0,1fr)_350px] gap-4">
      <section className="flex min-h-0 flex-col overflow-hidden rounded-[18px] border border-line bg-white" aria-label={`${yearMonth} 월간 달력`}>
        <div className="grid grid-cols-7 border-b border-line bg-surface">
          {WEEKDAYS.map((weekday, index) => (
            <div key={weekday} className={`py-3 text-center text-[15px] font-bold ${index === 0 ? "text-danger" : index === 6 ? "text-brand" : "text-ink-sub"}`}>
              {weekday}
            </div>
          ))}
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-7" style={{ gridTemplateRows: `repeat(${totalSlots / 7}, minmax(96px, 1fr))` }}>
          {Array.from({ length: totalSlots }, (_, slot) => {
            const dayIndex = slot - firstWeekday;
            if (dayIndex < 0 || dayIndex >= days.length) return <div key={`empty-${slot}`} className="border-r border-b border-line bg-sidebar" />;
            const day = days[dayIndex];
            const counts = Object.fromEntries(DUTIES.map((duty) => [duty, rows.filter((row) => row.cells[dayIndex]?.duty === duty).length])) as Record<DutyCode, number>;
            const needsCheck = coverage?.[dayIndex] === "short" || rows.some((row) => row.cells[dayIndex]?.flag === "violation");
            const active = selected === dayIndex;
            return (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelected(dayIndex)}
                aria-pressed={active}
                aria-label={`${day.date}일 근무 상세`}
                className={`relative flex min-h-0 flex-col gap-2 border-r border-b border-line p-3 text-left transition-colors ${active ? "bg-primary-soft ring-2 ring-inset ring-primary" : "bg-white hover:bg-sidebar"}`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className={`text-[20px] font-bold ${day.tone === "sun" ? "text-danger" : day.tone === "sat" ? "text-brand" : "text-ink"}`}>{day.date}</span>
                  {needsCheck ? <span className="rounded-full bg-danger-soft px-2 py-1 text-[12px] font-bold text-danger">확인</span> : null}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {DUTIES.filter((duty) => counts[duty] > 0).map((duty) => (
                    <span key={duty} className={`rounded-[8px] px-2 py-1 text-[12px] ${DUTY_STYLE[duty].cell}`}>
                      {DUTY_STYLE[duty].monthLabel} {counts[duty]}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="flex min-h-0 flex-col overflow-hidden rounded-[18px] border border-line bg-white" aria-label={`${selectedDay.date}일 근무 상세`}>
        <div className="flex items-start justify-between border-b border-line px-5 py-4">
          <div>
            <p className="text-[14px] font-bold text-primary">{yearMonth.replace("-", ".")}</p>
            <h3 className="mt-1 text-[25px] font-bold text-ink">{selectedDay.date}일 ({selectedDay.weekday})</h3>
          </div>
          <span className={`rounded-[10px] px-2.5 py-1.5 text-[13px] font-bold ${coverage?.[selected] === "short" ? "bg-danger-soft text-danger" : "bg-ok-soft text-ok"}`}>
            {coverage?.[selected] === "short" ? "인원 미달" : "인원 충족"}
          </span>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <ul className="flex flex-col gap-2">
            {assignments.map(({ name, nurseKey, cell }) => {
              const duty = cell?.duty;
              return (
                <li key={nurseKey} className={`flex items-center justify-between rounded-[12px] border px-3 py-2.5 ${cell?.flag ? "border-danger bg-danger-soft" : "border-line"}`}>
                  <span className="truncate pr-3 text-[16px] font-bold text-ink">{name}</span>
                  {duty ? (
                    <span className={`min-w-[54px] rounded-[9px] px-2.5 py-1.5 text-center text-[14px] ${DUTY_STYLE[duty].cell}`}>{DUTY_STYLE[duty].weekLabel}</span>
                  ) : <span className="text-[14px] font-medium text-ink-faint">미배정</span>}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="border-t border-line p-4">
          <Link href={`/schedule?ym=${encodeURIComponent(yearMonth)}&week=${week}`} className="flex min-h-12 w-full items-center justify-center rounded-[12px] bg-primary font-bold text-white">
            {week}주차에서 수정하기
          </Link>
        </div>
      </aside>
    </div>
  );
}
