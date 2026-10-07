import { apiRequest, apiRequestList, isApiConfigured } from "@/lib/apiClient";
import { shellInfoMock } from "@/mocks/shell.mock";
import type { ShellInfo } from "@/types/shell.type";
import type { MeResponse } from "@/types/wardApi.type";

async function pendingTotal(path: string): Promise<number> {
  try {
    const { meta } = await apiRequestList<unknown>(path, { query: { status: "PENDING", size: 1 } });
    return meta.totalElements;
  } catch {
    return 0;
  }
}

// GET /me → ShellInfo. 소속이 없으면 null (호출한 쪽에서 소속 선택으로 보낸다).
// TODO: 사이드바 배지 건수 전용 API는 명세에 없다. 수간호사에게만 목록 meta.totalElements로 대신 센다 (WARD-04, REQ-03).
export async function getShellInfo(): Promise<ShellInfo | null> {
  if (!isApiConfigured) return shellInfoMock;

  const me = await apiRequest<MeResponse>("/me");
  if (!me.membership || !me.ward) return null;

  const role = me.membership.role;
  const [pendingApprovalCount, pendingRequestCount] =
    role === "HEAD_NURSE"
      ? await Promise.all([
          pendingTotal("/wards/me/membership-requests"),
          pendingTotal("/wards/me/requests"),
        ])
      : [0, 0];

  return {
    hospitalName: me.ward.hospitalName,
    wardName: me.ward.wardName,
    userName: me.user.name,
    role,
    pendingRequestCount,
    pendingApprovalCount,
  };
}
