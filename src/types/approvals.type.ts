import type { Nurse } from "@/types/nurses.type";

export type JoinRequest = {
  id: string;
  name: string;
  email: string;
  requestedAt: string;
  /** 이름이 같고 계정이 없는 등록 간호사 id. 연결 후보로 먼저 보여 준다 */
  candidateIds: string[];
  // TODO: 승인 권한은 일반 간호사 고정 (AUTH-06). 표시용 문자열
  grantedRoleLabel: string;
};

export type ApprovalsData = {
  requests: JoinRequest[];
  /** 승인 때 연결할 수 있는 계정 없는 재직 간호사 */
  unlinkedNurses: Nurse[];
};
