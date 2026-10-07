// 근무표 화면 타입. 응답 필드는 백엔드 확정 후 결정 (TODO)
export type DutyCode = "D" | "E" | "N" | "O" | "AL";
export type ScheduleView = "week" | "month";
export type DayTone = "default" | "sat" | "sun";
export type CoverageStatus = "ok" | "short";

export type ScheduleCell = {
  duty: DutyCode | null; // null = 미배정 (O와 다름)
  flag?: "violation";
};

export type ScheduleDay = {
  date: number;
  weekday: string;
  tone: DayTone;
  isToday?: boolean;
};

export type ScheduleRow = {
  nurseKey: string; // mock 전용 키. 실제 식별자는 백엔드 확정 후 (TODO)
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
};

export type ScheduleBrush = { code: DutyCode; label: string };

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
