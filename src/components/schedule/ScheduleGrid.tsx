import ScheduleChip from "@/components/ui/ScheduleChip";
import type { CoverageStatus, ScheduleDay, ScheduleRow, ScheduleView } from "@/types/schedule.type";
import { DUTY_STYLE } from "./dutyStyle";

export type GridRow = { row: ScheduleRow; index: number };

type Props = {
  view: ScheduleView;
  days: ScheduleDay[];
  rows: GridRow[];
  coverage: CoverageStatus[] | null;
  selected: { row: number; col: number } | null;
  onCellClick: (row: number, col: number, el: HTMLElement) => void;
  onScroll: () => void;
};

const DAY_TEXT = { default: "text-ink", sat: "text-ink", sun: "text-danger" } as const;
const WEEKDAY_TEXT = { default: "text-ink-sub", sat: "text-brand", sun: "text-danger" } as const;

export default function ScheduleGrid({ view, days, rows, coverage, selected, onCellClick, onScroll }: Props) {
  const isMonth = view === "month";
  const nameW = isMonth ? "w-[96px]" : "w-[151px]";
  const rowH = "h-10";
  const headH = "h-12";

  return (
    <div onScroll={onScroll} className="absolute inset-0 overflow-auto">
      {/* 시트 전체가 화면 안에 들어오도록 표를 영역 크기에 맞춘다. 영역이 너무 작을 때만 안에서 스크롤한다. */}
      <table className="h-full w-full table-fixed border-separate border-spacing-0">
        <thead>
          <tr>
            <th
              scope="col"
              className={`sticky top-0 left-0 z-30 border-t border-r border-b border-l border-grid bg-surface pl-4 text-left text-[18px] font-bold text-ink-sub ${nameW} ${headH} ${isMonth ? "text-center pl-0" : ""}`}
            >
              이름
            </th>
            {days.map((d) => (
              <th
                key={d.date}
                scope="col"
                className={`sticky top-0 z-20 border-t border-r border-b border-grid p-0 font-normal ${headH} ${d.isToday ? "bg-brand-soft" : "bg-surface"}`}
              >
                <div className="flex flex-col items-center justify-center gap-0.5 leading-none">
                  <span className={`${isMonth ? "text-[12px]" : "text-[15px]"} font-medium ${d.isToday ? "text-brand" : WEEKDAY_TEXT[d.tone]}`}>{d.weekday}</span>
                  <span className={`${isMonth ? "text-[16px]" : "text-[22px]"} font-bold ${d.isToday ? "text-brand" : DAY_TEXT[d.tone]}`}>{d.date}</span>
                </div>
              </th>
            ))}
            {isMonth ? (
              <th scope="col" className={`sticky top-0 right-0 z-30 w-[64px] border-t border-r border-b border-grid bg-surface text-[14px] font-bold text-ink-sub ${headH}`}>
                OFF 수
              </th>
            ) : (
              <th scope="col" className="w-[112px] border-b border-transparent bg-white" aria-label="확인 필요" />
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ row, index }) => (
            <tr key={row.nurseKey}>
              <th
                scope="row"
                className={`sticky left-0 z-10 border-r border-b border-l border-grid bg-white text-left ${isMonth ? "text-[17px]" : "text-[20px]"} font-bold text-ink ${nameW} ${rowH} pl-4`}
              >
                {row.name}
              </th>
              {row.cells.map((cell, col) => {
                const isSelected = selected?.row === index && selected.col === col;
                const style = cell.duty ? DUTY_STYLE[cell.duty] : null;
                const label = style ? (isMonth ? style.monthLabel : style.weekLabel) : "";
                const labelSize = isMonth ? (cell.duty === "AL" ? "text-[12px]" : "text-[16px]") : cell.duty === "AL" ? "text-[18px]" : "text-[22px]";
                return (
                  <td key={col} className={`relative border-r border-b border-grid p-0 ${rowH} ${style ? style.cell.split(" ")[0] : "bg-white"}`}>
                    <button
                      type="button"
                      onClick={(e) => onCellClick(index, col, e.currentTarget)}
                      aria-label={`${row.name} ${days[col].date}일 ${label || "미배정"}`}
                      className={`flex size-full items-center justify-center ${style ? style.cell : "text-ink"} ${labelSize}`}
                    >
                      {label}
                    </button>
                    {cell.flag === "violation" ? (
                      <span aria-hidden className="pointer-events-none absolute inset-0 border-4 border-danger" />
                    ) : null}
                    {isSelected ? (
                      <span aria-hidden className="pointer-events-none absolute inset-0 border-4 border-primary" />
                    ) : null}
                  </td>
                );
              })}
              {isMonth ? (
                <td className={`sticky right-0 z-10 border-r border-b border-grid bg-white text-center text-[17px] font-medium text-ink ${rowH}`}>
                  {row.cells.filter((c) => c.duty === "O").length}
                </td>
              ) : (
                <td className={`pl-4 ${rowH}`}>
                  {row.needsCheck ? <ScheduleChip tone="danger" shape="square">확인 필요</ScheduleChip> : null}
                </td>
              )}
            </tr>
          ))}
        </tbody>
        {coverage ? (
          <tfoot>
            <tr>
              <th scope="row" className={`sticky bottom-0 left-0 z-20 h-11 border-r border-b border-l border-grid bg-surface text-left font-bold text-ink-sub ${isMonth ? "pl-2 text-[13px]" : "pl-4 text-[16px]"}`}>
                필요 인원
              </th>
              {coverage.map((c, i) => (
                <td key={days[i].date} className="sticky bottom-0 z-10 h-11 border-r border-b border-grid bg-white text-center">
                  <ScheduleChip tone={c === "ok" ? "ok" : "danger"} shape="square">
                    {isMonth ? (c === "ok" ? "✓" : "!") : c === "ok" ? "충족" : "미달"}
                  </ScheduleChip>
                </td>
              ))}
              <td className="sticky bottom-0 bg-white" />
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}
