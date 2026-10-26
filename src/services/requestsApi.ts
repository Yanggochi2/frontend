import { ApiError, apiRequest, apiRequestList } from "@/lib/apiClient";
import { REQUEST_REASON_ETC, REQUEST_REASONS } from "@/constants/requests.constants";
import { getNurseNameMap } from "@/services/nursesApi";
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

// REQ-02 내 신청 목록
export async function getMyRequests(query: WorkRequestQuery = {}): Promise<RequestItem[]> {
  const list = await apiRequestList<ApiWorkRequest>(`${REQUESTS_PATH}/me`, { query });
  return list.data.map((r) => mapWorkRequest(r));
}

// REQ-02 간호사 본인 신청 목록을 신청 화면 타입으로 돌려준다. getRequests와 같이 전체 기간 기준이다
// (신청은 대개 다음 달 이후라 이번 달만 보면 대기 건이 빠진다).
export async function getMyRequestList(): Promise<RequestListResult> {
  const items = await getMyRequests({ size: 100 });
  return {
    items,
    pendingCount: items.filter((i) => i.status === "PENDING").length,
    monthLabel: "전체 기간",
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

export async function getRequestFormOptions(): Promise<RequestFormOptions> {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    today: now.getDate(),
    initialSelectedDay: now.getDate(),
    reasons: REQUEST_REASONS,
  };
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
