// mock: 백엔드 연동 전 임시 데이터. 응답 필드는 백엔드 확정 후 결정 (TODO)
import type { ShellInfo } from "@/types/shell.type";

export const shellInfoMock: ShellInfo = {
  hospitalName: "샘플병원",
  wardName: "내과 3병동",
  userName: "정은서",
  role: "HEAD_NURSE",
  pendingRequestCount: 5,
  pendingApprovalCount: 3,
};
