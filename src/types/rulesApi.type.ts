// docs/API.md RULE-01~07 응답/요청 모양. 명세에 없는 필드는 만들지 않는다.
export type ApiRuleSeverity = "HARD" | "SOFT";

export type ApiRule = {
  id: string;
  code: string;
  name: string;
  severity: ApiRuleSeverity;
  enabled: boolean;
  // TODO: 백엔드 확정 후 결정 (parameters 내부 모양이 명세에 없다)
  parameters: Record<string, unknown>;
  version: number;
};

// RULE-02 요청. role/병동 ID는 담지 않는다.
export type ApiRulePatchBody = {
  enabled?: boolean;
  severity?: ApiRuleSeverity;
  parameters?: Record<string, unknown>;
  reason?: string;
};

// RULE-02 응답: Rule + ViolationSummary[]
// TODO: 백엔드 확정 후 결정 (ViolationSummary 모양이 명세에 없다)
export type ApiRulePatchResult = ApiRule & { violationSummary?: unknown[] };

// RULE-04
export type ApiHoliday = {
  date: string; // YYYY-MM-DD
  // TODO: 백엔드 확정 후 결정 (Holiday 필드는 RULE-05 요청 기준으로만 추정: isHoliday, name)
  isHoliday?: boolean;
  name?: string;
};

// RULE-05 요청
export type ApiHolidayPutBody = { isHoliday: boolean; name?: string; reason?: string };

// RULE-06/07 (🔶 결정 필요)
// TODO: 백엔드 확정 후 결정 (OffTarget 응답 모양 없음)
export type ApiOffTarget = { yearMonth?: string; targetCount?: number };
export type ApiOffTargetPatchBody = { targetCount: number; reason?: string };
