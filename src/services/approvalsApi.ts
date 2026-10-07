import { apiRequest, apiRequestList } from "@/lib/apiClient";
import type { ApprovalsData, JoinRequest } from "@/types/approvals.type";
import type { Membership, MembershipRequest } from "@/types/wardApi.type";

const BASE = "/wards/me/membership-requests";

function formatRequestedAt(iso?: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// MembershipRequest 필드는 명세에 없다 (types/wardApi.type.ts TODO). 없는 값은 "-"로 둔다.
function toJoinRequest(r: MembershipRequest): JoinRequest {
  return {
    id: r.id,
    name: r.applicantName ?? "-",
    requestedAt: formatRequestedAt(r.requestedAt),
    // TODO: 백엔드 확정 후 결정 (신청에 쓰인 병동 코드를 응답이 주는지)
    wardCode: "-",
    grantedRoleLabel: "일반 간호사",
  };
}

// WARD-04 (수간호사만). 승인 대기 건만 가져온다.
export async function getApprovals(): Promise<ApprovalsData> {
  const { data } = await apiRequestList<MembershipRequest>(BASE, {
    query: { status: "PENDING", size: 100 },
  });
  return { requests: data.map(toJoinRequest) };
}

// WARD-05
export async function approveJoinRequest(id: string): Promise<void> {
  await apiRequest<Membership>(`${BASE}/${encodeURIComponent(id)}/approve`, {
    method: "POST",
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
