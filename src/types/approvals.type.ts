export type JoinRequest = {
  id: string;
  name: string;
  requestedAt: string;
  wardCode: string;
  // TODO: 승인 권한은 일반 간호사 고정 (AUTH-06). 표시용 문자열
  grantedRoleLabel: string;
};

export type ApprovalsData = {
  requests: JoinRequest[];
};
