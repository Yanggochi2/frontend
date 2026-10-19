// 규칙 템플릿: "조건 + 결과" 문장에 값을 채우는 방식 (비즈니스 로직 10-19, 4장).
// 규칙 code와 parameters 키는 백엔드 기준이다. 백엔드에 아직 없는 템플릿은 TODO로 표시한다.

export type RuleParamField = {
  key: string;
  unit: string;
  min: number;
  max: number;
  defaultValue: number;
};

export type RuleTemplate = {
  code: string;
  name: string;
  // 문장 조각. 문자열은 그대로, 필드는 "값+단위"로 이어 붙인다.
  parts: (string | RuleParamField)[];
  // 규칙 추가 목록에 보이는지. 백엔드 기본 규칙은 이미 있어 추가하지 않는다.
  addable: boolean;
  defaultStrength: "REQUIRED" | "RECOMMENDED";
};

export const RULE_TEMPLATES: RuleTemplate[] = [
  // TODO(🔶 백엔드 code·parameters 키): 아래 3개는 규칙 추가 API가 생기면 이름을 맞춘다.
  {
    code: "NIGHT_OFF_AFTER",
    name: "나이트 후 휴무",
    parts: [
      "나이트",
      // TODO(🔶 나이트 후 휴무 적용 조건): 나이트 몇 회 후인지 10-20 확인. 기본값은 임시
      { key: "nightDays", unit: "일", min: 1, max: 7, defaultValue: 1 },
      "연속 근무 후 오프",
      { key: "offDays", unit: "일", min: 1, max: 5, defaultValue: 1 },
      "이상",
    ],
    addable: true,
    defaultStrength: "REQUIRED",
  },
  {
    code: "MAX_CONSECUTIVE_WORK",
    name: "최대 연속 근무",
    parts: ["연속 근무 최대", { key: "max", unit: "일", min: 1, max: 14, defaultValue: 5 }],
    addable: true,
    defaultStrength: "REQUIRED",
  },
  {
    code: "MONTHLY_OFF",
    name: "월 휴무 수",
    parts: [
      "월 휴무 = 주휴",
      { key: "weeklyOffs", unit: "회", min: 0, max: 6, defaultValue: 4 },
      "+ 그 달 공휴일 수 +",
      { key: "extraDays", unit: "일", min: 0, max: 5, defaultValue: 1 },
    ],
    addable: true,
    defaultStrength: "REQUIRED",
  },
  // 백엔드 기본 규칙 (features.py DEFAULT_RULES)
  {
    code: "MAX_CONSECUTIVE_NIGHTS",
    name: "연속 나이트 제한",
    parts: ["연속 나이트 최대", { key: "max", unit: "일", min: 1, max: 7, defaultValue: 3 }],
    addable: false,
    defaultStrength: "REQUIRED",
  },
  {
    code: "MIN_COVERAGE",
    name: "듀티별 최소 인원",
    parts: ["근무별 최소 인원은 병동 설정의 필요 인원을 따라요"],
    addable: false,
    defaultStrength: "REQUIRED",
  },
  {
    code: "CHARGE_DAY_ONLY",
    name: "차지 간호사 데이 근무",
    parts: ["차지 간호사는 데이 근무만"],
    addable: false,
    defaultStrength: "REQUIRED",
  },
  {
    code: "PREGNANT_NO_NIGHT",
    name: "임신 간호사 나이트 제외",
    parts: ["임신 간호사는 나이트 제외"],
    addable: false,
    defaultStrength: "REQUIRED",
  },
  {
    code: "NEW_NIGHT_SUPPORT",
    name: "신입 나이트 지원 인력",
    parts: ["신입 간호사 나이트에는 지원 인력을 함께 배치"],
    addable: false,
    defaultStrength: "REQUIRED",
  },
];

// 법에서 정한 공통 규칙처럼 병동이 지울 수 없는 기본 규칙.
// TODO: 백엔드 확정 후 결정 (Rule 응답에 구분 필드가 생기면 그 값을 쓴다). 지금은 백엔드 기본 규칙 code로 판단
export const BUILT_IN_RULE_CODES = RULE_TEMPLATES.filter((t) => !t.addable).map((t) => t.code);

export function findRuleTemplate(code: string): RuleTemplate | undefined {
  return RULE_TEMPLATES.find((t) => t.code === code);
}

export function isParamField(part: string | RuleParamField): part is RuleParamField {
  return typeof part !== "string";
}

export function defaultParameters(template: RuleTemplate): Record<string, number> {
  return Object.fromEntries(template.parts.filter(isParamField).map((f) => [f.key, f.defaultValue]));
}

// 템플릿 문장에 값을 채운다. 값이 없으면 기본값을 쓴다.
export function ruleSentence(template: RuleTemplate, parameters: Record<string, unknown>): string {
  return template.parts
    .map((p) => (isParamField(p) ? `${String(parameters[p.key] ?? p.defaultValue)}${p.unit}` : p))
    .join(" ");
}
