import { apiRequest, apiRequestList, isApiConfigured } from "@/lib/apiClient";
import { nurseActiveCountMock, nurseItemsMock } from "@/mocks/nurses.mock";
import type { PreviewState } from "@/types/requests.type";
import type { DutyRole, Nurse, NurseListResult, NurseStatus } from "@/types/nurses.type";
import type {
  ApiNurse,
  NurseCreate,
  NurseListQuery,
  NursePatch,
} from "@/types/nursesApi.type";

const NURSES_PATH = "/wards/me/nurses";
const idempotencyKey = () => crypto.randomUUID();

// "2014-03-01" -> "2014.03"
const ym = (date: string) => `${date.slice(0, 4)}.${date.slice(5, 7)}`;

function periodLabel(n: ApiNurse): string | undefined {
  if (!n.affiliationStart) return undefined;
  return `${ym(n.affiliationStart)} ~ ${n.affiliationEnd ? ym(n.affiliationEnd) : "재직"}`;
}

// 받은 필드만 옮긴다. 없는 필드를 채워 넣지 않는다.
export function mapNurse(n: ApiNurse): Nurse {
  return {
    id: n.id,
    name: n.name,
    role: n.role,
    dutyRole: n.dutyRole as DutyRole | undefined,
    status: n.status as NurseStatus | undefined,
    careerYears: n.careerMonths === undefined ? undefined : Math.floor(n.careerMonths / 12),
    careerMonths: n.careerMonths === undefined ? undefined : n.careerMonths % 12,
    skill: n.skillLevel,
    periodLabel: periodLabel(n),
  };
}

// NUR-02. state는 화면 상태 미리보기용(개발 확인용). 백엔드 연결 시 제거한다.
// 화면의 정렬·역할 필터·퇴사자 토글은 클라이언트에서 처리하므로 기본값으로 퇴사자까지 받는다.
export async function getNurses(
  state?: PreviewState,
  query: NurseListQuery = {},
): Promise<NurseListResult> {
  if (!isApiConfigured) {
    if (state === "error") throw new Error("간호사 명단을 불러오지 못했어요");
    if (state === "empty") return { items: [], activeCount: 0 };
    return { items: nurseItemsMock, activeCount: nurseActiveCountMock };
  }
  // TODO: 100명을 넘으면 페이지 이동 UI가 필요하다 (meta.totalPages)
  const list = await apiRequestList<ApiNurse>(NURSES_PATH, {
    query: { includeRetired: true, size: 100, ...query },
  });
  const items = list.data.map(mapNurse);
  return { items, activeCount: items.filter((n) => n.status !== "RETIRED").length };
}

// 신청 목록의 신청자 이름 표시용. 실패해도 신청 목록은 보여준다(applicantId로 대체).
export async function getNurseNameMap(): Promise<Map<string, string>> {
  try {
    const list = await apiRequestList<ApiNurse>(NURSES_PATH, {
      query: { includeRetired: true, size: 100 },
    });
    return new Map(list.data.map((n) => [n.id, n.name]));
  } catch {
    return new Map();
  }
}

// NUR-03
export async function getNurse(id: string): Promise<Nurse | null> {
  if (!isApiConfigured) return nurseItemsMock.find((n) => n.id === id) ?? null;
  return mapNurse(await apiRequest<ApiNurse>(`${NURSES_PATH}/${encodeURIComponent(id)}`));
}

// 아래 변경 요청은 API 미설정이면 null을 돌려준다(화면만 동작, 호출하지 않음).

// NUR-01 (Idempotency-Key). role은 보내지 않는다.
export async function createNurse(body: NurseCreate): Promise<Nurse | null> {
  if (!isApiConfigured) return null;
  const data = await apiRequest<ApiNurse>(NURSES_PATH, {
    method: "POST",
    body,
    idempotencyKey: idempotencyKey(),
  });
  return mapNurse(data);
}

// NUR-04. role은 보내지 않는다. TODO: 응답의 Violation[] 처리는 백엔드 확정 후 결정
export async function updateNurse(id: string, patch: NursePatch): Promise<Nurse | null> {
  if (!isApiConfigured) return null;
  const data = await apiRequest<ApiNurse>(`${NURSES_PATH}/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: patch,
  });
  return mapNurse(data);
}

// NUR-05. affiliationEnd는 YYYY-MM-DD. TODO: 응답의 Violation[] 처리는 백엔드 확정 후 결정
export async function retireNurse(id: string, affiliationEnd: string): Promise<Nurse | null> {
  if (!isApiConfigured) return null;
  const data = await apiRequest<ApiNurse>(`${NURSES_PATH}/${encodeURIComponent(id)}/retire`, {
    method: "POST",
    body: { affiliationEnd },
  });
  return mapNurse(data);
}
