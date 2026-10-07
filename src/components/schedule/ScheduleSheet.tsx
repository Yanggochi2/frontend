"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import ScheduleButton from "@/components/ui/ScheduleButton";
import ScheduleSegmented from "@/components/ui/ScheduleSegmented";
import type { DutyCode, ScheduleRow, ScheduleSheetData, ScheduleView } from "@/types/schedule.type";
import ScheduleBottomBar from "./ScheduleBottomBar";
import ScheduleCellPopover from "./ScheduleCellPopover";
import ScheduleGrid from "./ScheduleGrid";
import ScheduleToolbar from "./ScheduleToolbar";

type Popover = { row: number; col: number; top: number; left: number; above: boolean };
type HistoryItem = { row: number; col: number; prev: DutyCode | null };

const POPOVER_WIDTH = 386;
const POPOVER_HEIGHT = 170;

const WEEK_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n}주` }));
const VIEW_OPTIONS: { value: ScheduleView; label: string; href: string }[] = [
  { value: "week", label: "주간", href: "/schedule" },
  { value: "month", label: "월간", href: "/schedule?view=month" },
];

export default function ScheduleSheet({ sheet }: { sheet: ScheduleSheetData }) {
  const [rows, setRows] = useState<ScheduleRow[]>(sheet.rows);
  const [week, setWeek] = useState(String(sheet.activeWeek));
  const [brush, setBrush] = useState<DutyCode | null>(null);
  const [checkOnly, setCheckOnly] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [popover, setPopover] = useState<Popover | null>(null);
  const [showEmptyGuide, setShowEmptyGuide] = useState(sheet.unassigned);

  const closePopover = useCallback(() => setPopover(null), []);

  useEffect(() => {
    if (!popover) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closePopover();
    const onDown = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('[role="dialog"], table button')) closePopover();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", closePopover);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", closePopover);
    };
  }, [popover, closePopover]);

  // TODO: 저장·검증은 서버가 한다. 지금은 화면 상태만 바꾼다 (AGENTS.md 9). Undo는 클라이언트 메모리 스택 (6.2).
  function setDuty(row: number, col: number, duty: DutyCode) {
    const old = rows[row].cells[col].duty;
    if (old === duty) return;
    setHistory((h) => [...h, { row, col, prev: old }]);
    setRows((prev) =>
      prev.map((r, i) =>
        i !== row ? r : { ...r, cells: r.cells.map((c, j) => (j === col ? { ...c, duty } : c)) },
      ),
    );
  }

  function handleCellClick(row: number, col: number, el: HTMLElement) {
    if (brush) {
      setDuty(row, col, brush);
      closePopover();
      return;
    }
    // 화면 비율(zoom)이 걸려 있어도 위치가 맞도록, 화면 기준 좌표를 비율로 나눠 쓴다.
    const rect = el.getBoundingClientRect();
    const f = el.offsetWidth ? rect.width / el.offsetWidth : 1;
    const above = rect.bottom + (8 + POPOVER_HEIGHT) * f > window.innerHeight;
    const left = Math.max(8, Math.min(rect.left + rect.width / 2 - (POPOVER_WIDTH * f) / 2, window.innerWidth - (POPOVER_WIDTH + 8) * f));
    setPopover({ row, col, left: left / f, above, top: (above ? rect.top - 8 * f : rect.bottom + 8 * f) / f });
  }

  function handleUndo() {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory(history.slice(0, -1));
    setRows((prev) =>
      prev.map((r, i) =>
        i !== last.row ? r : { ...r, cells: r.cells.map((c, j) => (j === last.col ? { ...c, duty: last.prev } : c)) },
      ),
    );
  }

  const gridRows = useMemo(() => {
    const all = rows.map((row, index) => ({ row, index }));
    return checkOnly ? all.filter(({ row }) => row.needsCheck || row.cells.some((c) => c.flag)) : all;
  }, [rows, checkOnly]);

  const isMonth = sheet.view === "month";

  return (
    <>
      <div className="flex min-h-0 w-full flex-1 flex-col gap-2 rounded-[28px] bg-surface px-5 py-3">
        <p className="shrink-0 text-right text-[15px] font-medium text-ink-sub">셀을 눌러 바로 수정 · 자동 저장</p>
        <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 rounded-[20px] bg-white px-5 py-4">
          <div className="flex min-h-[52px] flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-[28px] leading-normal font-bold text-ink">{sheet.title}</h2>
              {/* TODO: 이전/다음 기간 이동은 백엔드 연결 시 */}
              <button type="button" aria-label="이전" className="size-11 rounded-[18px] bg-surface text-[22px] font-bold text-ink-sub">
                ‹
              </button>
              <button type="button" aria-label="다음" className="size-11 rounded-[18px] bg-surface text-[22px] font-bold text-ink-sub">
                ›
              </button>
            </div>
            <div className="flex items-center gap-3">
              <ScheduleSegmented
                options={VIEW_OPTIONS}
                value={isMonth ? "month" : "week"}
                ariaLabel="보기 전환"
                itemClassName="w-24"
              />
              {isMonth ? null : (
                <ScheduleSegmented options={WEEK_OPTIONS} value={week} onChange={setWeek} ariaLabel="주 선택" />
              )}
            </div>
          </div>
          <ScheduleToolbar
            brush={brush}
            onBrushChange={setBrush}
            canUndo={history.length > 0}
            onUndo={handleUndo}
            checkOnly={checkOnly}
            onCheckOnlyChange={setCheckOnly}
          />
          <div className="relative min-h-0 flex-1">
            <ScheduleGrid
              view={sheet.view}
              days={sheet.days}
              rows={gridRows}
              coverage={sheet.coverage}
              selected={sheet.selectedCell}
              onCellClick={handleCellClick}
              onScroll={closePopover}
            />
            {showEmptyGuide ? (
              <div className="absolute top-1/3 left-1/2 flex w-[min(432px,calc(100%-2rem))] -translate-x-1/2 flex-col items-center gap-3 rounded-[20px] border border-line bg-white p-5 text-center shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
                <p className="text-[22px] font-bold text-ink">아직 비어 있어요</p>
                <p className="text-[16px] font-medium text-ink-sub">
                  칸을 눌러 근무를 넣거나, 자동 생성으로 한 번에 채워요. 연차는 이미 들어가 있어요.
                </p>
                <div className="flex gap-2">
                  <ScheduleButton variant="brand" size="sm" href="/schedule/generate">
                    자동 생성
                  </ScheduleButton>
                  <ScheduleButton variant="neutral" size="sm" onClick={() => setShowEmptyGuide(false)}>
                    직접 채우기
                  </ScheduleButton>
                </div>
              </div>
            ) : null}
          </div>
        </section>
        <p className="shrink-0 text-right text-[15px] font-medium text-ink-sub">{sheet.lastSavedLabel}</p>
      </div>
      {popover ? (
        <ScheduleCellPopover
          top={popover.top}
          left={popover.left}
          above={popover.above}
          onPick={(code) => {
            setDuty(popover.row, popover.col, code);
            closePopover();
          }}
        />
      ) : null}
      <ScheduleBottomBar />
    </>
  );
}
