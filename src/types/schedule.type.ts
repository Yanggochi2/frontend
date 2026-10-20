import type { ScheduleStatus } from "./scheduleApi.type";

// 근무표 화면 타입. 응답 필드는 백엔드 확정 후 결정 (TODO)
// AL은 표시 전용(직접 입력 불가). TODO(🔶 ED 교육): 미확정, 입력 UI 없음.
export type DutyCode = "D" | "E" | "N" | "O" | "AL" | "ED";
// 브러시·팝오버로 직접 입력할 수 있는 코드
export type EditableDutyCode = "D" | "E" | "N" | "O";
export type ScheduleView = "week" | "month";
export type DayTone = "default" | "sat" | "sun" | "holiday";
export type CoverageDuty = "D" | "E" | "N";
// 날짜 하나의 근무별 인원. 근무별 값이 없으면 그 근무는 표시하지 않는다.
export type CoverageStatus = {
  short: boolean; // 하나라도 미달이면 true
  counts: Partial<Record<CoverageDuty, { actual: number; required: number }>>;
};

export type ScheduleCell = {
  duty: DutyCode | null; // null = 미배정 (O와 다름)
  flag?: "violation";
  violations?: string[]; // 이 칸에 걸린 하드 위반 메시지
  editable?: boolean; // 없으면 편집 가능
  charge?: boolean; // 그날 그 근무의 차지 간호사
};

export type ScheduleDay = {
  date: number;
  weekday: string;
  tone: DayTone;
  isToday?: boolean;
  holidayName?: string; // 공휴일이면 이름 (이름이 없으면 "공휴일")
};

export type ScheduleRow = {
  nurseKey: string; // nurseId
  name: string;
  group?: string; // 숙련 그룹. 없으면 묶지 않는다
  cells: ScheduleCell[];
  needsCheck?: boolean;
};

export type ScheduleSheetData = {
  view: ScheduleView;
  title: string;
  days: ScheduleDay[];
  rows: ScheduleRow[];
  coverage: CoverageStatus[] | null; // 월별 보기에는 커버리지 행이 없다
  selectedCell: { row: number; col: number } | null;
  yearMonth: string;
  activeWeek: number;
  weekCount: number;
  lastSavedLabel: string;
  unassigned: boolean;
  api: ScheduleSheetApiState;
};

export type ScheduleSheetApiState = {
  scheduleId: string;
  version: number;
  dates: string[]; // 열 순서대로의 YYYY-MM-DD
  editable: boolean; // DRAFT일 때만 true
  status: ScheduleStatus;
  hardViolationCount: number; // 병동 단위 위반(인원 미달 등)까지 센다. 0이어야 확정할 수 있다
};

export type ScheduleBrush = { code: EditableDutyCode; label: string };

export type SchedulePageData =
  | { kind: "sheet"; sheet: ScheduleSheetData }
  | { kind: "no-nurses"; periodLabel: string }
  | { kind: "nurse-unpublished"; periodLabel: string };

export type SchedulePageParams = {
  view?: string;
  ym?: string;
  week?: string;
};

export type GenerationStep = {
  order: number;
  title: string;
  status: "done" | "active" | "pending";
};

export type GenerationMetric = {
  label: string;
  value: string;
  tone: "default" | "danger";
};

export type GenerationProgress = {
  jobId: string;
  yearMonth: string;
  periodLabel: string;
  steps: GenerationStep[];
  metrics: GenerationMetric[];
};

export type GenerationFailureOption = {
  id: string;
  badge: { label: string; tone: "brand" | "danger" };
  title: string;
  description: string;
  primary: boolean;
};

export type GenerationFailure = {
  jobId: string;
  yearMonth: string;
  title: string;
  subtitle: string;
  cause: { tag: string; headline: string; detail: string };
  problems: string[]; // 남은 하드 위반 메시지
  options: GenerationFailureOption[];
};
