import ScheduleToggle from "@/components/ui/ScheduleToggle";
import type { DutyCode } from "@/types/schedule.type";
import { BRUSH_BG, BRUSH_RING, DUTY_ORDER, DUTY_STYLE } from "./dutyStyle";

type Props = {
  brush: DutyCode | null;
  onBrushChange: (code: DutyCode | null) => void;
  canUndo: boolean;
  onUndo: () => void;
  checkOnly: boolean;
  onCheckOnlyChange: (value: boolean) => void;
};

export default function ScheduleToolbar({ brush, onBrushChange, canUndo, onUndo, checkOnly, onCheckOnlyChange }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[16px] font-bold text-ink">칸 바꾸기</p>
        {DUTY_ORDER.map((code) => {
          const active = brush === code;
          return (
            <button
              key={code}
              type="button"
              aria-pressed={active}
              onClick={() => onBrushChange(active ? null : code)}
              className={`rounded-[12px] px-4 py-[11px] text-[16px] font-bold ${BRUSH_BG[code]} ${active ? `ring-2 ${BRUSH_RING[code]}` : ""}`}
            >
              {DUTY_STYLE[code].brushLabel}
            </button>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="py-2 text-[16px] font-medium text-ink-sub disabled:opacity-60"
        >
          ↶ 되돌리기
        </button>
        <ScheduleToggle checked={checkOnly} onChange={onCheckOnlyChange} label="확인 필요한 칸만 보기" />
      </div>
    </div>
  );
}
