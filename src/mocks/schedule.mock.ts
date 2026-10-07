// mock: 백엔드 연동 전 임시 데이터. 응답 필드는 백엔드 확정 후 결정 (TODO)
import type {
  CoverageStatus,
  DutyCode,
  GenerationFailure,
  GenerationProgress,
  ScheduleCell,
  ScheduleDay,
  ScheduleRow,
  ScheduleSheetData,
} from "@/types/schedule.type";

const NAMES = ["정은서", "박지우", "김도현", "이수아", "최민준", "강서윤", "윤하린", "신유진"];

// 10/8(월) ~ 10/14(일) — Figma 표기 그대로
export const weekDaysMock: ScheduleDay[] = [
  { date: 8, weekday: "월", tone: "default" },
  { date: 9, weekday: "화", tone: "default" },
  { date: 10, weekday: "수", tone: "default" },
  { date: 11, weekday: "목", tone: "default" },
  { date: 12, weekday: "금", tone: "default" },
  { date: 13, weekday: "토", tone: "sat" },
  { date: 14, weekday: "일", tone: "sun" },
];

// D E N O(OFF) L(연차)
const WEEK_DUTIES: string[] = [
  "DDOODDD",
  "EENNOOD",
  "NOODDEE",
  "DDEENNO",
  "ENNOODD",
  "OODDLEN",
  "DEENNOO",
  "NNOODDE",
];

const CODE: Record<string, DutyCode> = { D: "D", E: "E", N: "N", O: "O", L: "AL" };

function toCells(pattern: string): ScheduleCell[] {
  return [...pattern].map((c) => ({ duty: CODE[c] ?? null }));
}

function weekRows(): ScheduleRow[] {
  return NAMES.map((name, i) => ({
    nurseKey: `mock-${i + 1}`,
    name,
    cells: toCells(WEEK_DUTIES[i]),
  }));
}

export function weekSheetMock(): ScheduleSheetData {
  const rows = weekRows();
  // 신유진 화(9) 하드 위반, 이수아 금(12) 선택 칸 (Figma 상태)
  rows[7] = { ...rows[7], needsCheck: true, cells: rows[7].cells.map((c, i) => (i === 1 ? { ...c, flag: "violation" } : c)) };
  return {
    view: "week",
    title: "이번 주 근무",
    days: weekDaysMock,
    rows,
    coverage: weekDaysMock.map<CoverageStatus>(() => "ok"),
    selectedCell: { row: 3, col: 4 },
    activeWeek: 2,
    weekCount: 5,
    lastSavedLabel: "마지막 수정 방금 전",
    unassigned: false,
  };
}

export function unassignedSheetMock(): ScheduleSheetData {
  const rows: ScheduleRow[] = NAMES.map((name, i) => ({
    nurseKey: `mock-${i + 1}`,
    name,
    cells: weekDaysMock.map(() => ({ duty: null })),
  }));
  // 연차는 이미 들어가 있다 (강서윤 10/12)
  rows[5].cells[4] = { duty: "AL" };
  rows[7] = { ...rows[7], needsCheck: true };
  return {
    view: "week",
    title: "이번 주 근무",
    days: weekDaysMock,
    rows,
    coverage: weekDaysMock.map<CoverageStatus>(() => "short"),
    selectedCell: null,
    activeWeek: 2,
    weekCount: 5,
    lastSavedLabel: "마지막 수정 방금 전",
    unassigned: true,
  };
}

const MONTH_WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

export function monthSheetMock(): ScheduleSheetData {
  // 2026-10-01 = 목요일. 10월은 31일.
  const days: ScheduleDay[] = Array.from({ length: 31 }, (_, i) => {
    const weekday = MONTH_WEEKDAYS[(3 + i) % 7];
    return {
      date: i + 1,
      weekday,
      tone: weekday === "토" ? "sat" : weekday === "일" ? "sun" : "default",
      isToday: i + 1 === 6,
    };
  });
  // 7일 주기 패턴을 반복해 채운 임시 값 (D E N O, L=연차)
  const patterns = ["DDOODDD", "EENNOOD", "NOODDEE", "DDEENNO", "ENNOODD", "OODDLEN", "DEENNOO", "NNOODDE"];
  const rows: ScheduleRow[] = NAMES.map((name, i) => ({
    nurseKey: `mock-${i + 1}`,
    name,
    cells: days.map((_, d) => ({ duty: CODE[patterns[i][d % 7]] ?? null })),
  }));
  return {
    view: "month",
    title: "10월 근무",
    days,
    rows,
    coverage: null,
    selectedCell: null,
    activeWeek: 0,
    weekCount: 0,
    lastSavedLabel: "마지막 수정 방금 전",
    unassigned: false,
  };
}

export const generationProgressMock: GenerationProgress = {
  periodLabel: "2026년 10월",
  steps: [
    { order: 1, title: "제약 해석", status: "done" },
    { order: 2, title: "연차 반영", status: "done" },
    { order: 3, title: "최적해 탐색", status: "active" },
  ],
  metrics: [
    { label: "경과 시간", value: "00:23", tone: "default" },
    { label: "희망 오프 반영률", value: "82%", tone: "default" },
    { label: "남은 하드 위반", value: "3건", tone: "danger" },
  ],
};

export const generationFailureMock: GenerationFailure = {
  title: "조건을 모두 맞추는 근무표를 찾지 못했어요",
  subtitle: "10월 12일 나이트 인원이 부족해요 · 아래에서 방법을 골라 주세요",
  cause: {
    tag: "충돌 원인",
    headline: "10/12 N · 필요 3명, 배정 가능 2명",
    detail: "신입을 빼면 가능한 인원이 1명뿐이에요.",
  },
  options: [
    { id: "opt-1", badge: { label: "권장", tone: "brand" }, title: "10/12 N 필요 인원을 3명 → 2명으로", description: "그날 나이트 인원이 1명 줄어요", primary: true },
    { id: "opt-2", badge: { label: "권장", tone: "brand" }, title: "박지우 10/12 연차 날짜 바꾸기", description: "연차 1건을 다시 정해야 해요", primary: false },
    { id: "opt-3", badge: { label: "주의", tone: "danger" }, title: "신입 N 단독 금지 예외 1건 허용", description: "안전 규칙에 예외가 생겨요", primary: false },
  ],
};
