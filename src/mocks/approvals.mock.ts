// mock: 백엔드 연동 전 임시 데이터. 응답 필드는 백엔드 확정 후 결정 (TODO)
import type { ApprovalsData } from "@/types/approvals.type";

export const approvalsMock: ApprovalsData = {
  requests: [
    { id: "a1", name: "오하늘", requestedAt: "10/06 09:30", wardCode: "AB12CD34", grantedRoleLabel: "일반 간호사" },
    { id: "a2", name: "한지민", requestedAt: "10/05 18:11", wardCode: "AB12CD34", grantedRoleLabel: "일반 간호사" },
    { id: "a3", name: "송예린", requestedAt: "10/05 14:02", wardCode: "AB12CD34", grantedRoleLabel: "일반 간호사" },
  ],
};
