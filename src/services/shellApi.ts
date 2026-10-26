import { cache } from "react";
import { apiRequest, apiRequestList } from "@/lib/apiClient";
import type { Role, ShellInfo } from "@/types/shell.type";
import type { MeResponse } from "@/types/wardApi.type";

async function pendingTotal(path: string): Promise<number> {
  try {
    const { meta } = await apiRequestList<unknown>(path, { query: { status: "PENDING", size: 1 } });
    return meta.totalElements;
  } catch {
    return 0;
  }
}

// 레이아웃과 페이지가 한 요청 안에서 /me를 한 번만 부르도록 묶는다.
const getMe = cache(() => apiRequest<MeResponse>("/me"));

// GET /me → ShellInfo. 소속이 없으면 null (호출한 쪽에서 소속 선택으로 보낸다).
// TODO: 사이드바 배지 건수 전용 API는 명세에 없다. 수간호사에게만 목록 meta.totalElements로 대신 센다 (WARD-04, REQ-03).
export async function getShellInfo(): Promise<ShellInfo | null> {
  const me = await getMe();
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

// 화면 문구와 버튼을 역할별로 나눌 때 쓴다. 역할 판정은 서버(GET /me)이고, 못 불러오면 null이다.
// null이면 수간호사 화면을 그대로 둔다 (서버에 닿지 못한 틀 화면과 같은 기준).
export const getMyRole = cache(async (): Promise<Role | null> => {
  try {
    const me = await getMe();
    return me.membership?.role ?? null;
  } catch {
    return null;
  }
});
