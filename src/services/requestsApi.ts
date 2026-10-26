import { ApiError, apiRequest, apiRequestList } from "@/lib/apiClient";
import { REQUEST_MONTHS_AHEAD, REQUEST_REASON_ETC, REQUEST_REASONS } from "@/constants/requests.constants";
import { shiftMonth, todayKst } from "@/lib/schedulePeriod";
import { getNurseNameMap } from "@/services/nursesApi";
import { getHolidays } from "@/services/rulesApi";
import type {
  RequestFormOptions,
  RequestItem,
  RequestListResult,
} from "@/types/requests.type";
import type {
  ApiWorkRequest,
  WorkRequestCreate,
  WorkRequestQuery,
} from "@/types/requestsApi.type";

const REQUESTS_PATH = "/wards/me/requests";
const idempotencyKey = () => crypto.randomUUID();
const pad = (n: number) => String(n).padStart(2, "0");

// "2026-10-14" -> "10/14"
const mmdd = (date: string) => `${date.slice(5, 7)}/${date.slice(8, 10)}`;

// 연속한 날짜면 "10/20 ~ 10/22", 아니면 쉼표로 나열한다.
function formatTargetDates(dates: string[]): string {
  const sorted = [...dates].sort();
  if (sorted.length === 0) return "-";
  if (sorted.length === 1) return mmdd(sorted[0]);
  const dayMs = 24 * 60 * 60 * 1000;
  const contiguous = sorted.every(
    (d, i) => i === 0 || Date.parse(d) - Date.parse(sorted[i - 1]) === dayMs,
  );
  return contiguous
    ? `${mmdd(sorted[0])} ~ ${mmdd(sorted[sorted.length - 1])}`
    : sorted.map(mmdd).join(", ");
}

// processedAt은 UTC ISO. 화면에는 로컬 날짜(MM/DD)로 보여준다.
function formatProcessedAt(iso?: string | null): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? undefined : `${pad(d.getMonth() + 1)}/${pad(d.getDate())}`;
}

export function mapWorkRequest(r: ApiWorkRequest, nurseNames: Map<string, string> = new Map()): RequestItem {
  const reasonLabel = REQUEST_REASONS.find((o) => o.value === r.reasonCode)?.label ?? r.reasonCode;
  return {
    id: r.id,
    nurseName: r.applicantName ?? nurseNames.get(r.applicantId) ?? r.applicantId,
    requestedAtLabel: formatProcessedAt(r.createdAt),
    kind: r.type,
    targetDateLabel: formatTargetDates(r.targetDates),
    reason: r.reasonCode === REQUEST_REASON_ETC && r.reasonDetail ? r.reasonDetail : reasonLabel,
    status: r.status,
    processedAtLabel: formatProcessedAt(r.processedAt),
  };
}

// REQ-03 수간호사 신청 목록. REQ-02(getMyRequests)와 같은 화면 타입으로 돌려준다.
// yearMonth가 없으면 전체 기간 (신청은 대개 다음 달 이후라 이번 달만 보면 대기 건이 빠진다. 사이드바 배지와 같은 기준)
// 병동 전체 목록은 수간호사만 된다. 일반 간호사(403)는 내 신청 목록을 승인/반려 버튼 없이 보여 준다.
export async function getRequests(query: WorkRequestQuery = {}): Promise<RequestListResult> {
  const yearMonth = query.yearMonth;
  let items: RequestItem[];
  try {
    const list = await apiRequestList<ApiWorkRequest>(REQUESTS_PATH, { query: { size: 100, ...query } });
    // TODO: 100건을 넘으면 페이지 이동 UI가 필요하다 (meta.totalPages)
    items = list.data.map((r) => mapWorkRequest(r));
  } catch (e) {
    if (!(e instanceof ApiError && e.status === 403)) throw e;
    items = (await getMyRequests({ size: 100, ...query })).map((r) => ({ ...r, decidable: false }));
  }
  return {
    items,
    pendingCount: items.filter((i) => i.status === "PENDING").length,
    monthLabel: yearMonth ? `${yearMonth.slice(0, 4)}년 ${Number(yearMonth.slice(5, 7))}월` : "전체 기간",
  };
}

// 근무표 칸 표시용 (REQ-03, 수간호사만). 그 달에 승인된 희망 오프를 "간호사id|YYYY-MM-DD"로 모은다.
export async function getApprovedOffKeys(yearMonth: string): Promise<Set<string>> {
  const list = await apiRequestList<ApiWorkRequest>(REQUESTS_PATH, {
    query: { yearMonth, type: "PREFERRED_OFF", status: "APPROVED", size: 100 },
  });
  // TODO: 100건을 넘으면 다음 페이지도 받아야 한다 (meta.totalPages)
  return new Set(list.data.flatMap((r) => r.targetDates.map((d) => `${r.applicantId}|${d}`)));
}

// REQ-02 내 신청 목록
export async function getMyRequests(query: WorkRequestQuery = {}): Promise<RequestItem[]> {
  const list = await apiRequestList<ApiWorkRequest>(`${REQUESTS_PATH}/me`, { query });
  return list.data.map((r) => mapWorkRequest(r));
}

// REQ-02 간호사 본인 신청 목록을 신청 화면 타입으로 돌려준다. getRequests와 같이 전체 기간 기준이다
// (신청은 대개 다음 달 이후라 이번 달만 보면 대기 건이 빠진다).
export async function getMyRequestList(yearMonth?: string): Promise<RequestListResult> {
  const items = await getMyRequests({ size: 100, ...(yearMonth ? { yearMonth } : {}) });
  return {
    items,
    pendingCount: items.filter((i) => i.status === "PENDING").length,
    monthLabel: yearMonth ? `${yearMonth.slice(0, 4)}년 ${Number(yearMonth.slice(5, 7))}월` : "전체 기간",
  };
}

// REQ-04
export async function getRequest(id: string): Promise<RequestItem> {
  const [data, names] = await Promise.all([
    apiRequest<ApiWorkRequest>(`${REQUESTS_PATH}/${encodeURIComponent(id)}`),
    getNurseNameMap(),
  ]);
  return mapWorkRequest(data, names);
}

// ym(YYYY-MM)은 이번 달 ~ REQUEST_MONTHS_AHEAD달 뒤 안에서만 연다. 없거나 범위 밖이면 이번 달.
export async function getRequestFormOptions(ym?: string): Promise<RequestFormOptions> {
  const now = todayKst();
  const last = shiftMonth(now.yearMonth, REQUEST_MONTHS_AHEAD);
  const yearMonth = ym && /^\d{4}-(0[1-9]|1[0-2])$/.test(ym) && ym >= now.yearMonth && ym <= last ? ym : now.yearMonth;
  const isThisMonth = yearMonth === now.yearMonth;
  return {
    year: Number(yearMonth.slice(0, 4)),
    month: Number(yearMonth.slice(5)),
    prevYearMonth: isThisMonth ? null : shiftMonth(yearMonth, -1),
    nextYearMonth: yearMonth === last ? null : shiftMonth(yearMonth, 1),
    today: isThisMonth ? now.day : 0,
    initialSelectedDay: isThisMonth ? now.day : 1,
    holidays: await getHolidayDays(yearMonth),
    reasons: REQUEST_REASONS,
  };
}

// 달력 공휴일 표시용. RULE-04는 수간호사 전용이라 간호사는 403 → 표시 없이 비워 둔다.
// TODO: 간호사도 공휴일을 받을 수 있게 되면 그대로 표시된다 (백엔드 확정 후 결정)
async function getHolidayDays(yearMonth: string): Promise<Record<number, string>> {
  try {
    const list = await getHolidays(yearMonth);
    return Object.fromEntries(list.filter((h) => h.isHoliday).map((h) => [Number(h.date.slice(8)), h.name || "공휴일"]));
  } catch {
    return {};
  }
}

// REQ-01 (Idempotency-Key)
export async function createRequest(body: WorkRequestCreate): Promise<RequestItem> {
  const data = await apiRequest<ApiWorkRequest>(REQUESTS_PATH, {
    method: "POST",
    body,
    idempotencyKey: idempotencyKey(),
  });
  return mapWorkRequest(data);
}

// REQ-05 (Idempotency-Key). 응답은 { request, scheduleImpact }
export async function approveRequest(id: string): Promise<RequestItem> {
  const { request: data } = await apiRequest<{ request: ApiWorkRequest }>(`${REQUESTS_PATH}/${encodeURIComponent(id)}/approve`, {
    method: "POST",
    idempotencyKey: idempotencyKey(),
  });
  return mapWorkRequest(data);
}

// REQ-06 반려 사유 필수
export async function rejectRequest(id: string, reason: string): Promise<RequestItem> {
  const data = await apiRequest<ApiWorkRequest>(`${REQUESTS_PATH}/${encodeURIComponent(id)}/reject`, {
    method: "POST",
    body: { reason },
  });
  return mapWorkRequest(data);
}

// REQ-07 신청자 본인만
export async function cancelRequest(id: string): Promise<RequestItem> {
  const data = await apiRequest<ApiWorkRequest>(`${REQUESTS_PATH}/${encodeURIComponent(id)}/cancel`, {
    method: "POST",
  });
  return mapWorkRequest(data);
}
