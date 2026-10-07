export type RuleCategory = "REQUIRED" | "RECOMMENDED" | "HOLIDAY" | "OFF_TARGET";

export type RuleItem = {
  id: string;
  name: string;
  category: RuleCategory;
  // 강도 칩: 필수 / 권장
  strength: "REQUIRED" | "RECOMMENDED";
  valueText: string;
  targetText: string;
  // API 연동 시에만 채워진다 (RULE-01)
  code?: string;
  enabled?: boolean;
  version?: number;
};

export type RuleFilter = { key: RuleCategory; label: string };

export type RulesData = {
  filters: RuleFilter[];
  rules: RuleItem[];
};
