import type { DutyCode } from "@/types/schedule.type";

// Tailwind가 클래스를 찾을 수 있게 전체 문자열로 적는다.
export const DUTY_STYLE: Record<
  DutyCode,
  { cell: string; edge: string; weekLabel: string; monthLabel: string; brushLabel: string }
> = {
  D: { cell: "bg-duty-d text-duty-d-ink font-bold", edge: "border-duty-d-edge", weekLabel: "D", monthLabel: "D", brushLabel: "D 데이" },
  E: { cell: "bg-duty-e text-duty-e-ink font-bold", edge: "border-duty-e-edge", weekLabel: "E", monthLabel: "E", brushLabel: "E 이브닝" },
  N: { cell: "bg-duty-n text-duty-n-ink font-bold", edge: "border-duty-n-edge", weekLabel: "N", monthLabel: "N", brushLabel: "N 나이트" },
  O: { cell: "bg-duty-off text-duty-off-ink font-medium", edge: "border-duty-off-edge", weekLabel: "OFF", monthLabel: "O", brushLabel: "OFF 휴무" },
  AL: { cell: "bg-duty-al text-duty-al-ink font-bold", edge: "border-duty-al-edge", weekLabel: "연차", monthLabel: "AL", brushLabel: "연차" },
};

export const DUTY_ORDER: DutyCode[] = ["D", "E", "N", "O", "AL"];

// 브러시 버튼 배경 (OFF는 Figma에서 회색 칩 색)
export const BRUSH_BG: Record<DutyCode, string> = {
  D: "bg-duty-d text-duty-d-ink",
  E: "bg-duty-e text-duty-e-ink",
  N: "bg-duty-n text-duty-n-ink",
  O: "bg-surface text-ink-sub",
  AL: "bg-duty-al text-duty-al-ink",
};

export const BRUSH_RING: Record<DutyCode, string> = {
  D: "ring-duty-d-edge",
  E: "ring-duty-e-edge",
  N: "ring-duty-n-edge",
  O: "ring-duty-off-edge",
  AL: "ring-duty-al-edge",
};
