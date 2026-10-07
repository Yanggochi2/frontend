import { ApiError, apiRequest, apiRequestBlob, apiRequestList } from "@/lib/apiClient";
import type {
  ApiCellBulkPatch,
  ApiCellBulkPatchResult,
  ApiConfirmCancelRequest,
  ApiConfirmRequest,
  ApiCoverage,
  ApiSchedule,
  ApiViolation,
  ApiViolationQuery,
} from "@/types/scheduleApi.type";
import type {
  CoverageStatus,
  DayTone,
  ScheduleDay,
  ScheduleRow,
  ScheduleSheetData,
  SchedulePageData,
  SchedulePageParams,
} from "@/types/schedule.type";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const SCHEDULES = "/wards/me/schedules";

// ---- 매핑 (API -> UI 타입) ----

function currentYearMonthAndDay() {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date())
    .split("-");
  return { yearMonth: `${parts[0]}-${parts[1]}`, day: Number(parts[2]) };
}

function monthDates(yearMonth: string): string[] {
  const [y, m] = yearMonth.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return Array.from({ length: last }, (_, i) => `${yearMonth}-${String(i + 1).padStart(2, "0")}`);
}

function toDay(date: string, today: string): ScheduleDay {
  const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
  const tone: DayTone = weekday === 0 ? "sun" : weekday === 6 ? "sat" : "default";
  return { date: Number(date.slice(8)), weekday: WEEKDAYS[weekday], tone, isToday: date === today };
}

// 날짜별 필요 인원 상태. 하나라도 UNDER면 미달.
export function toCoverageStatuses(coverage: ApiCoverage[], dates: string[]): CoverageStatus[] {
  const short = new Set(coverage.filter((c) => c.status === "UNDER").map((c) => c.date));
  return dates.map((d) => (short.has(d) ? "short" : "ok"));
}

// HARD 위반이 걸린 칸에 표시를 달고, 위반이 있는 행에 '확인 필요'를 단다.
export function applyViolationFlags(rows: ScheduleRow[], dates: string[], violations: ApiViolation[]): ScheduleRow[] {
  const hard = violations.filter((v) => v.severity === "HARD" && v.nurseId);
  const anyByNurse = new Set(violations.map((v) => v.nurseId));
  const hardKey = new Set(hard.map((v) => `${v.nurseId}|${v.date}`));
  return rows.map((r) => ({
    ...r,
    needsCheck: anyByNurse.has(r.nurseKey),
    cells: r.cells.map((c, i) => {
      const { flag: _flag, ...rest } = c;
      void _flag;
      return hardKey.has(`${r.nurseKey}|${dates[i]}`) ? { ...rest, flag: "violation" as const } : rest;
    }),
  }));
}

function toSheet(schedule: ApiSchedule, violations: ApiViolation[], view: "week" | "month"): ScheduleSheetData {
  const { yearMonth: nowYm, day } = currentYearMonthAndDay();
  const all = monthDates(schedule.yearMonth);
  const weekCount = Math.ceil(all.length / 7);
  // TODO: 주 구분 기준(월요일 시작 등)은 명세에 없다. 지금은 1일부터 7일씩 끊고, 오늘이 속한 주를 연다.
  const activeWeek = schedule.yearMonth === nowYm ? Math.min(weekCount, Math.ceil(day / 7)) : 1;
  const dates = view === "month" ? all : all.slice((activeWeek - 1) * 7, activeWeek * 7);
  const today = `${nowYm}-${String(day).padStart(2, "0")}`;

  const cellMap = new Map(schedule.cells.map((c) => [`${c.nurseId}|${c.date}`, c]));
  const rows: ScheduleRow[] = schedule.nurses.map((n) => ({
    nurseKey: n.id,
    name: n.name,
    cells: dates.map((d) => {
      const c = cellMap.get(`${n.id}|${d}`);
      // 칸이 없으면 소속 기간 밖으로 보고 편집 불가로 둔다 (추측).
      return { duty: c?.dutyCode ?? null, editable: c ? c.editable : false };
    }),
  }));

  const month = Number(schedule.yearMonth.slice(5));
  return {
    view,
    title: view === "month" ? `${month}월 근무` : "이번 주 근무",
    days: dates.map((d) => toDay(d, today)),
    rows: applyViolationFlags(rows, dates, violations),
    coverage: view === "month" ? null : toCoverageStatuses(schedule.coverage, dates),
    selectedCell: null,
    activeWeek,
    weekCount,
    lastSavedLabel: "-", // TODO: 마지막 수정 시각 필드가 명세에 없다
    unassigned: schedule.cells.length > 0 && schedule.cells.every((c) => c.dutyCode === null || c.dutyCode === "AL"),
    api: { scheduleId: schedule.id, version: schedule.version, dates, editable: schedule.status === "DRAFT" },
  };
}

// ---- 조회 ----

// view는 주/월 보기 전환 값이다. 역할은 서버가 세션에서 판정한다 (AGENTS.md 6.1).
export async function getSchedulePage(params: SchedulePageParams = {}): Promise<SchedulePageData> {
  const { yearMonth } = currentYearMonthAndDay();
  const periodLabel = `${yearMonth.slice(0, 4)}년 ${Number(yearMonth.slice(5))}월`;
  let schedule: ApiSchedule;
  try {
    schedule = await getScheduleByYearMonth(yearMonth);
  } catch (e) {
    // TODO: 404가 '일반 간호사에게 확정본 없음'과 '수간호사에게 근무표 미생성' 중 무엇인지 명세에 없다.
    if (e instanceof ApiError && e.status === 404) return { kind: "nurse-unpublished", periodLabel };
    throw e;
  }
  if (schedule.nurses.length === 0) return { kind: "no-nurses", periodLabel };

  let violations: ApiViolation[] = [];
  if (schedule.status === "DRAFT") {
    // 위반 목록은 수간호사만 받는다. 실패해도 시트는 보여 준다.
    try {
      violations = (await getScheduleViolations(schedule.id, { severity: "HARD", size: 100 })).data;
    } catch {}
  }
  return { kind: "sheet", sheet: toSheet(schedule, violations, params.view === "month" ? "month" : "week") };
}

// SCH-02 (구성원)
export function getScheduleByYearMonth(yearMonth: string): Promise<ApiSchedule> {
  return apiRequest<ApiSchedule>(SCHEDULES, { query: { yearMonth } });
}

// SCH-03
export function getScheduleById(scheduleId: string): Promise<ApiSchedule> {
  return apiRequest<ApiSchedule>(`${SCHEDULES}/${scheduleId}`);
}

// SCH-05
export function getScheduleCoverage(scheduleId: string): Promise<ApiCoverage[]> {
  return apiRequest<ApiCoverage[]>(`${SCHEDULES}/${scheduleId}/coverage`);
}

// SCH-06 (수간호사)
export function getScheduleViolations(scheduleId: string, query: ApiViolationQuery = {}) {
  return apiRequestList<ApiViolation>(`${SCHEDULES}/${scheduleId}/violations`, { query });
}

// ---- 변경 ----

// SCH-04. 전체 성공/전체 실패. 409 VERSION_CONFLICT, 423 SCHEDULE_LOCKED, 422 PROTECTED_CELL은 ApiError로 던진다.
// AL 직접 입력은 금지라 여기서도 막는다. 잠금 토큰은 P2(잠금 기능)에서 넘긴다.
export function patchScheduleCells(scheduleId: string, body: ApiCellBulkPatch, scheduleLockToken?: string) {
  if (body.changes.some((c) => c.dutyCode === "AL")) throw new Error("AL은 직접 입력할 수 없어요.");
  return apiRequest<ApiCellBulkPatchResult>(`${SCHEDULES}/${scheduleId}/cells`, {
    method: "PATCH",
    body,
    scheduleLockToken,
  });
}

// SCH-07. 같은 확정 시도는 같은 키를 쓰도록 호출부에서 키를 만들어 넘긴다.
export function confirmSchedule(scheduleId: string, body: ApiConfirmRequest, idempotencyKey: string) {
  return apiRequest<ApiSchedule>(`${SCHEDULES}/${scheduleId}/confirm`, { method: "POST", body, idempotencyKey });
}

// SCH-08
export function cancelScheduleConfirmation(scheduleId: string, body: ApiConfirmCancelRequest) {
  return apiRequest<ApiSchedule>(`${SCHEDULES}/${scheduleId}/confirmation-cancellations`, { method: "POST", body });
}

// SCH-09. 응답 xlsx Blob (저장은 호출부)
export function exportScheduleXlsx(scheduleId: string): Promise<Blob> {
  return apiRequestBlob(`${SCHEDULES}/${scheduleId}/export.xlsx`);
}

// TODO: SCH-10~15 (가져오기, 편집 잠금)는 2순위라 아직 만들지 않는다.

