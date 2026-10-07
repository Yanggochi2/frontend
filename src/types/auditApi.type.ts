// docs/API.md SEC-01 / AuditLog 모델
export type ApiAuditLog = {
  id: string;
  occurredAt: string; // UTC ISO 8601
  actorId: string; // 명세에 행위자 이름 필드가 없다
  actionType: string; // TODO: 백엔드 확정 후 결정 (actionType 값 목록 없음)
  targetType: string;
  targetId: string;
  // TODO: 백엔드 확정 후 결정 (before/after 내부 모양 없음)
  before: unknown;
  after: unknown;
};

export type AuditLogQuery = {
  from?: string;
  to?: string;
  actorId?: string;
  actionType?: string;
  page?: number;
  size?: number;
};
