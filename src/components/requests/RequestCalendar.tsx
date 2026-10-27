"use client";

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];
const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

export type DayRange = { start: number; end: number };

export function formatRange(month: number, year: number, r: DayRange) {
  const label = (d: number) =>
    `${month}월 ${d}일 (${DAY_NAMES[new Date(year, month - 1, d).getDay()]})`;
  const count = r.end - r.start + 1;
  return r.start === r.end
    ? `${label(r.start)} · ${count}일`
    : `${label(r.start)} ~ ${label(r.end)} · ${count}일`;
}

export default function RequestCalendar({
  year,
  month,
  today,
  range,
  onChange,
}: {
  year: number;
  month: number;
  today: number;
  range: DayRange;
  onChange: (r: DayRange) => void;
}) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const offset = (new Date(year, month - 1, 1).getDay() + 6) % 7; // 월요일 시작
  const cells: (number | null)[] = [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const pick = (d: number) => {
    if (range.start === range.end && d > range.start) onChange({ start: range.start, end: d });
    else onChange({ start: d, end: d });
  };

  return (
    <div className="grid w-full max-w-[624px] grid-cols-7 gap-2">
      {WEEKDAYS.map((w, i) => (
        <div
          key={w}
          className={`flex h-9 items-center justify-center text-[16px] font-bold ${
            i === 5 ? "text-brand" : i === 6 ? "text-danger" : "text-ink-sub"
          }`}
        >
          {w}
        </div>
      ))}
      {cells.map((d, idx) => {
        if (d === null) return <div key={`e${idx}`} className="h-14" />;
        const col = idx % 7;
        const past = d < today;
        const selected = d >= range.start && d <= range.end;
        const color = past
          ? "text-ink-mute"
          : col === 5
            ? "text-brand"
            : col === 6
              ? "text-danger"
              : "text-ink";
        return (
          <button
            key={d}
            type="button"
            disabled={past}
            aria-pressed={selected}
            onClick={() => pick(d)}
            className={`flex h-14 items-center justify-center rounded-[12px] text-[20px] ${
              selected
                ? "bg-primary font-bold text-white"
                : d === today
                  ? `border-2 border-primary font-bold ${color}`
                  : `font-medium ${color}`
            }`}
          >
            {d}
          </button>
        );
      })}
    </div>
  );
}
