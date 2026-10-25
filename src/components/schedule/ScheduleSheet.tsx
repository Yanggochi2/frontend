"use client";

import Link from "next/link";
import { movePeriod, scheduleHref } from "@/lib/schedulePeriod";
import { useCallback, useEffect, useMemo, useState } from "react";
import ScheduleButton from "@/components/ui/ScheduleButton";
import ScheduleSegmented from "@/components/ui/ScheduleSegmented";
import { useGenerationStart } from "@/hooks/useGenerationStart";
import { useScheduleEditor } from "@/hooks/useScheduleEditor";
import type { EditableDutyCode, ScheduleSheetData, ScheduleView } from "@/types/schedule.type";
import ScheduleBottomBar from "./ScheduleBottomBar";
import ScheduleCellPopover from "./ScheduleCellPopover";
import ScheduleGrid from "./ScheduleGrid";
import ScheduleToolbar from "./ScheduleToolbar";

type Popover = { row: number; col: number; top: number; left: number; above: boolean };

const POPOVER_WIDTH = 386;
const POPOVER_HEIGHT = 170;
// 위반 메시지 한 줄당 늘어나는 팝오버 높이 (위/아래 배치 계산용)
const POPOVER_PROBLEM_LINE = 26;


// canManage: 수간호사만 true. 간호사는 확정된 근무표를 보기만 하므로 편집 도구와 확정 버튼을 숨긴다.
export default function ScheduleSheet({ sheet, canManage = true }: { sheet: ScheduleSheetData; canManage?: boolean }) {
  const editor = useScheduleEditor(sheet);
  const { rows, setDuty } = editor;
  const [brush, setBrush] = useState<EditableDutyCode | null>(null);
  const [checkOnly, setCheckOnly] = useState(false);
  const [popover, setPopover] = useState<Popover | null>(null);
  const [showEmptyGuide, setShowEmptyGuide] = useState(canManage && sheet.unassigned);
  const generation = useGenerationStart();
  const api = sheet.api;

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

  function handleCellClick(row: number, col: number, el: HTMLElement) {
    if (brush) {
      setDuty(row, col, brush);
      closePopover();
      return;
    }
    // 화면 비율(zoom)이 걸려 있어도 위치가 맞도록, 화면 기준 좌표를 비율로 나눠 쓴다.
    const rect = el.getBoundingClientRect();
    const f = el.offsetWidth ? rect.width / el.offsetWidth : 1;
    const height = POPOVER_HEIGHT + (rows[row].cells[col].violations?.length ?? 0) * POPOVER_PROBLEM_LINE;
    const above = rect.bottom + (8 + height) * f > window.innerHeight;
    const left = Math.max(8, Math.min(rect.left + rect.width / 2 - (POPOVER_WIDTH * f) / 2, window.innerWidth - (POPOVER_WIDTH + 8) * f));
    setPopover({ row, col, left: left / f, above, top: (above ? rect.top - 8 * f : rect.bottom + 8 * f) / f });
  }

  const gridRows = useMemo(() => {
    const all = rows.map((row, index) => ({ row, index }));
    return checkOnly ? all.filter(({ row }) => row.needsCheck || row.cells.some((c) => c.flag)) : all;
  }, [rows, checkOnly]);

  const isMonth = sheet.view === "month";
  const period = { yearMonth: sheet.yearMonth, week: sheet.activeWeek };
  const prevHref = scheduleHref(sheet.view, movePeriod(period, sheet.view, -1));
  const nextHref = scheduleHref(sheet.view, movePeriod(period, sheet.view, 1));
  const viewOptions: { value: ScheduleView; label: string; href: string }[] = [
    { value: "week", label: "주간", href: scheduleHref("week", period) },
    { value: "month", label: "월간", href: scheduleHref("month", period) },
  ];
  const weekOptions = Array.from({ length: sheet.weekCount }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}주`,
    href: scheduleHref("week", { yearMonth: sheet.yearMonth, week: i + 1 }),
  }));

  return (
    <>
      <div className="flex min-h-0 w-full flex-1 flex-col gap-2 rounded-[28px] bg-surface px-5 py-3">
        <p className="shrink-0 text-right text-[15px] font-medium text-ink-sub">셀을 눌러 바로 수정 · 자동 저장</p>
        <section className="flex min-h-0 min-w-0 flex-1 flex-col gap-3 rounded-[20px] bg-white px-5 py-4">
          <div className="flex min-h-[52px] flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-[28px] leading-normal font-bold text-ink">{sheet.title}</h2>
              <Link href={prevHref} aria-label="이전" className="flex size-11 items-center justify-center rounded-[18px] bg-surface text-[22px] font-bold text-ink-sub">
                ‹
              </Link>
              <Link href={nextHref} aria-label="다음" className="flex size-11 items-center justify-center rounded-[18px] bg-surface text-[22px] font-bold text-ink-sub">
                ›
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <ScheduleSegmented
                options={viewOptions}
                value={isMonth ? "month" : "week"}
                ariaLabel="보기 전환"
                itemClassName="w-24"
              />
              {isMonth ? null : (
                <ScheduleSegmented options={weekOptions} value={String(sheet.activeWeek)} ariaLabel="주 선택" />
              )}
            </div>
          </div>
          {canManage ? (
            <ScheduleToolbar
              brush={brush}
              onBrushChange={setBrush}
              canUndo={editor.canUndo}
              onUndo={editor.undo}
              canRedo={editor.canRedo}
              onRedo={editor.redo}
              checkOnly={checkOnly}
              onCheckOnlyChange={setCheckOnly}
            />
          ) : null}
          {editor.saveError ? (
            <p role="alert" className="text-[16px] font-bold text-danger">
              {editor.saveError}
            </p>
          ) : null}
          <div className="relative min-h-0 flex-1">
            <ScheduleGrid
              view={sheet.view}
              days={sheet.days}
              rows={gridRows}
              coverage={editor.coverage}
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
                {generation.error ? (
                  <p role="alert" className="text-[16px] font-bold text-danger">
                    {generation.error}
                  </p>
                ) : null}
                <div className="flex gap-2">
                  <ScheduleButton
                    variant="brand"
                    size="sm"
                    onClick={() => generation.start(sheet.yearMonth)}
                    disabled={generation.loading}
                    className="disabled:opacity-50"
                  >
                    {generation.loading ? "만드는 중…" : "자동 생성"}
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
          problems={rows[popover.row].cells[popover.col].violations}
          onPick={(code) => {
            setDuty(popover.row, popover.col, code);
            closePopover();
          }}
        />
      ) : null}
      {canManage ? (
        <ScheduleBottomBar
          scheduleId={api.scheduleId}
          yearMonth={sheet.yearMonth}
          status={api.status}
          hardViolationCount={editor.hardViolationCount}
        />
      ) : null}
    </>
  );
}
