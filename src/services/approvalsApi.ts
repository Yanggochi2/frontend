import { apiRequest, apiRequestList } from "@/lib/apiClient";
import { getUnlinkedNurses } from "@/services/nursesApi";
import type { ApprovalsData, JoinRequest } from "@/types/approvals.type";
import type { MembershipRequest } from "@/types/wardApi.type";

const BASE = "/wards/me/membership-requests";

function formatRequestedAt(iso?: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toJoinRequest(r: MembershipRequest): JoinRequest {
  return {
    id: r.id,
    name: r.name ?? "-",
    email: r.email ?? "-",
    requestedAt: formatRequestedAt(r.createdAt),
    candidateIds: r.candidates ?? [],
    grantedRoleLabel: "일반 간호사",
  };
}

// WARD-04 (수간호사만). 승인 대기 건과, 승인 때 계정을 연결할 수 있는 등록 간호사를 함께 가져온다.
export async function getApprovals(): Promise<ApprovalsData> {
  const { data } = await apiRequestList<MembershipRequest>(BASE, {
    query: { status: "PENDING", size: 100 },
  });
  // 간호사 목록을 못 받아도 신청 목록은 보여 준다 (새로 등록해서 승인할 수는 있다)
  const unlinkedNurses = data.length > 0 ? await getUnlinkedNurses().catch(() => []) : [];
  return { requests: data.map(toJoinRequest), unlinkedNurses };
}

// WARD-05. 승인하려면 이 계정이 어느 간호사 행인지(nurseId) 정해야 한다.
// 근무표·신청·통계가 간호사 행에 붙기 때문에, 등록된 간호사에 연결하거나 새로 등록한 뒤 그 id를 넘긴다.
export async function approveJoinRequest(id: string, nurseId: string): Promise<void> {
  await apiRequest<unknown>(`${BASE}/${encodeURIComponent(id)}/approve`, {
    method: "POST",
    body: { nurseId },
    idempotencyKey: crypto.randomUUID(),
  });
}

// WARD-06 (reason 필수)
export async function rejectJoinRequest(id: string, reason: string): Promise<void> {
  await apiRequest<MembershipRequest>(`${BASE}/${encodeURIComponent(id)}/reject`, {
    method: "POST",
    body: { reason },
  });
}
