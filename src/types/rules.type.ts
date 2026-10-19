// 규칙 화면 탭. 공휴일 탭은 규칙 목록 대신 공휴일 관리를 보여 준다.
export type RuleFilterKey = "ALL" | "REQUIRED" | "RECOMMENDED" | "HOLIDAY";

export type RuleStrength = "REQUIRED" | "RECOMMENDED";

export type RuleItem = {
  id: string;
  code: string;
  name: string;
  strength: RuleStrength; // 필수(HARD) / 권장(SOFT)
  sentence: string; // 템플릿으로 만든 읽을 수 있는 문장
  parameters: Record<string, unknown>;
  enabled: boolean;
  builtIn: boolean; // 기본 규칙은 지울 수 없고 끄기만 된다
  version: number;
};

export type RuleFilter = { key: RuleFilterKey; label: string };

export type RulesData = {
  filters: RuleFilter[];
  rules: RuleItem[];
};

export type HolidayItem = { date: string; name: string };
