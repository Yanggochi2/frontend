// 근무표 화면 타입. 응답 필드는 백엔드 확정 후 결정 (TODO)
// AL은 표시 전용(직접 입력 불가). TODO(🔶 ED 교육): 미확정, 입력 UI 없음.
export type DutyCode = "D" | "E" | "N" | "O" | "AL" | "ED";
// 브러시·팝오버로 직접 입력할 수 있는 코드
export type EditableDutyCode = "D" | "E" | "N" | "O";
export type ScheduleView = "week" | "month";
export type DayTone = "default" | "sat" | "sun";
export type CoverageStatus = "ok" | "short";

export type ScheduleCell = {
  duty: DutyCode | null; // null = 미배정 (O와 다름)
  flag?: "violation";
  editable?: boolean; // 없으면 편집 가능 (mock)
};

export type ScheduleDay = {
  date: number;
  weekday: string;
  tone: DayTone;
  isToday?: boolean;
};

export type ScheduleRow = {
  nurseKey: string; // API 연동 시 nurseId, mock에서는 임시 키
  name: string;
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
  activeWeek: number;
  weekCount: number;
  lastSavedLabel: string;
  unassigned: boolean;
  // API 연동 시에만 있다. 없으면 화면 상태만 바꾼다 (mock).
  api?: ScheduleSheetApiState;
};

export type ScheduleSheetApiState = {
  scheduleId: string;
  version: number;
  dates: string[]; // 열 순서대로의 YYYY-MM-DD
  editable: boolean; // DRAFT일 때만 true
};

export type ScheduleBrush = { code: EditableDutyCode; label: string };

export type SchedulePageData =
  | { kind: "sheet"; sheet: ScheduleSheetData }
  | { kind: "no-nurses"; periodLabel: string }
  | { kind: "nurse-unpublished"; periodLabel: string };

export type SchedulePageParams = {
  state?: string;
  role?: string;
  view?: string;
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
  title: string;
  subtitle: string;
  cause: { tag: string; headline: string; detail: string };
  options: GenerationFailureOption[];
};
