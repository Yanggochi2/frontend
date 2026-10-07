import type { AuditFilterChip } from "@/types/audit.type";

// TODO: 감사 로그 필터 칩의 종류와 동작은 백엔드 확정 후 결정 (SEC-01 쿼리 파라미터 기준). 지금은 표시만 한다.
export const AUDIT_FILTER_CHIPS: AuditFilterChip[] = [
  { key: "period", label: "기간" },
  { key: "actor", label: "행위자" },
  { key: "action", label: "행위" },
];
