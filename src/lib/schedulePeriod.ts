import type { ScheduleView } from "@/types/schedule.type";

// 근무표 기간 계산. 월은 항상 오늘(KST) 기준으로 시작하고, ?ym=YYYY-MM 으로 다른 달을 연다.
// TODO: 주 구분 기준(월요일 시작 등)은 명세에 없다. 지금은 1일부터 7일씩 끊는다.

export type Period = { yearMonth: string; week: number };

const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

export function todayKst() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date())
    .split("-");
  return { yearMonth: `${parts[0]}-${parts[1]}`, day: Number(parts[2]) };
}

export function monthDates(yearMonth: string): string[] {
  const [y, m] = yearMonth.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return Array.from(
    { length: last },
    (_, i) => `${yearMonth}-${String(i + 1).padStart(2, "0")}`,
  );
}

export function weekCountOf(yearMonth: string) {
  return Math.ceil(monthDates(yearMonth).length / 7);
}

export function shiftMonth(yearMonth: string, delta: number) {
  const [y, m] = yearMonth.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

// 쿼리(ym, week)를 검증해서 열 기간을 정한다. 없거나 잘못되면 오늘이 속한 달/주.
export function resolvePeriod(ym?: string, week?: string): Period {
  const now = todayKst();
  const yearMonth = ym && YEAR_MONTH.test(ym) ? ym : now.yearMonth;
  const count = weekCountOf(yearMonth);
  const asked = Number(week);
  if (Number.isInteger(asked) && asked >= 1 && asked <= count)
    return { yearMonth, week: asked };
  return {
    yearMonth,
    week:
      yearMonth === now.yearMonth ? Math.min(count, Math.ceil(now.day / 7)) : 1,
  };
}

// 이전/다음 기간. 월간은 한 달씩, 주간은 한 주씩 넘기고 달 경계를 넘으면 옆 달로 간다.
export function movePeriod(
  period: Period,
  view: ScheduleView,
  delta: 1 | -1,
): Period {
  if (view === "month")
    return { yearMonth: shiftMonth(period.yearMonth, delta), week: 1 };
  const next = period.week + delta;
  if (next < 1) {
    const yearMonth = shiftMonth(period.yearMonth, -1);
    return { yearMonth, week: weekCountOf(yearMonth) };
  }
  if (next > weekCountOf(period.yearMonth))
    return { yearMonth: shiftMonth(period.yearMonth, 1), week: 1 };
  return { yearMonth: period.yearMonth, week: next };
}

export function scheduleHref(view: ScheduleView, period: Period) {
  const q = new URLSearchParams();
  if (view === "month") q.set("view", "month");
  q.set("ym", period.yearMonth);
  if (view === "week") q.set("week", String(period.week));
  return `/schedule?${q.toString()}`;
}
