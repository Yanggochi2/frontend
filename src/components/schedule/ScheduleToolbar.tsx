import ScheduleSegmented from "@/components/ui/ScheduleSegmented";
import ScheduleToggle from "@/components/ui/ScheduleToggle";
import type { EditableDutyCode, ScheduleRowSort } from "@/types/schedule.type";
import { BRUSH_BG, BRUSH_RING, DUTY_ORDER, DUTY_STYLE } from "./dutyStyle";

type Props = {
  brush: EditableDutyCode | null;
  onBrushChange: (code: EditableDutyCode | null) => void;
  canUndo: boolean;
  onUndo: () => void;
  canRedo: boolean;
  onRedo: () => void;
  checkOnly: boolean;
  onCheckOnlyChange: (value: boolean) => void;
  sort: ScheduleRowSort;
  onSortChange: (value: ScheduleRowSort) => void;
};

// 숙련 그룹 묶음은 그대로 두고 묶음 안의 순서만 바꾼다. 기본은 서버가 준 순서
const SORT_OPTIONS: { value: ScheduleRowSort; label: string }[] = [
  { value: "default", label: "기본" },
  { value: "name", label: "이름" },
  { value: "dutyRole", label: "직급" },
  { value: "career", label: "경력" },
];

export default function ScheduleToolbar({
  brush,
  onBrushChange,
  canUndo,
  onUndo,
  canRedo,
  onRedo,
  checkOnly,
  onCheckOnlyChange,
  sort,
  onSortChange,
}: Props) {
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
        <div className="flex items-center gap-2">
          <p className="text-[16px] font-bold text-ink">정렬</p>
          <ScheduleSegmented options={SORT_OPTIONS} value={sort} onChange={onSortChange} ariaLabel="간호사 정렬" />
        </div>
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          title="Ctrl+Z"
          className="py-2 text-[16px] font-medium text-ink-sub disabled:opacity-60"
        >
          ↶ 되돌리기
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          title="Ctrl+Y"
          className="py-2 text-[16px] font-medium text-ink-sub disabled:opacity-60"
        >
          ↷ 다시 실행
        </button>
        <ScheduleToggle checked={checkOnly} onChange={onCheckOnlyChange} label="확인 필요한 칸만 보기" />
      </div>
    </div>
  );
}
