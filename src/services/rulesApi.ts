import { OFF_TARGET_FORMULA_LABEL, RULE_FILTER_CHIPS } from "@/constants/rules.constants";
import { apiRequest } from "@/lib/apiClient";
import type { RuleItem, RulesData } from "@/types/rules.type";
import type {
  ApiHoliday,
  ApiHolidayPutBody,
  ApiOffTarget,
  ApiOffTargetPatchBody,
  ApiRule,
  ApiRulePatchBody,
  ApiRulePatchResult,
} from "@/types/rulesApi.type";

const RULE_COPY: Record<string, { description: string; target: string }> = {
  MIN_COVERAGE: { description: "D·E·N 각 근무에 병동에서 정한 최소 인원을 배정해요.", target: "모든 근무일" },
  CHARGE_DAY_ONLY: { description: "차지 간호사는 데이 근무에만 배정해요.", target: "차지 간호사" },
  PREGNANT_NO_NIGHT: { description: "임신 상태인 간호사는 나이트 근무에서 제외해요.", target: "임신 간호사" },
  NEW_NIGHT_SUPPORT: { description: "신입 간호사의 나이트 배정을 줄이고 경력자를 우선 배정해요.", target: "신입 간호사" },
  MAX_CONSECUTIVE_NIGHTS: { description: "나이트가 연속으로 너무 길어지지 않게 막아요.", target: "나이트 근무자" },
};

function toValueText(parameters: ApiRule["parameters"]): string {
  const entries = Object.entries(parameters ?? {});
  if (parameters?.source === "ward.requiredStaff") return "병동 설정의 D·E·N 필요 인원";
  if (typeof parameters?.max === "number") return `최대 ${parameters.max}일 연속`;
  if (entries.length === 0) return "자동 적용";
  return entries.map(([k, v]) => `${k}: ${String(v)}`).join(", ");
}

export function toRuleItem(rule: ApiRule): RuleItem {
  const strength = rule.severity === "HARD" ? "REQUIRED" : "RECOMMENDED";
  return {
    id: rule.id,
    code: rule.code,
    name: rule.name,
    description: RULE_COPY[rule.code]?.description ?? "자동 편성에 적용되는 병동 기준이에요.",
    category: strength,
    strength,
    valueText: toValueText(rule.parameters),
    // TODO: 백엔드 확정 후 결정 (적용 대상 필드가 Rule에 없다)
    targetText: RULE_COPY[rule.code]?.target ?? "모든 간호사",
    enabled: rule.enabled,
    version: rule.version,
  };
}

export async function getRules(): Promise<RulesData> {
  // RULE-01
  const rules = await apiRequest<ApiRule[]>("/wards/me/rules");
  return { filters: RULE_FILTER_CHIPS, rules: rules.map(toRuleItem) };
}

// RULE-02.
export async function patchRule(ruleId: string, body: ApiRulePatchBody): Promise<RuleItem> {
  const result = await apiRequest<ApiRulePatchResult>(`/wards/me/rules/${encodeURIComponent(ruleId)}`, {
    method: "PATCH",
    body,
  });
  return toRuleItem(result);
}

// RULE-03
export async function applyRulePreset(presetId: string): Promise<RuleItem[]> {
  const rules = await apiRequest<ApiRule[]>(`/wards/me/rule-presets/${encodeURIComponent(presetId)}/apply`, {
    method: "POST",
  });
  return rules.map(toRuleItem);
}

// RULE-04
export async function getHolidays(yearMonth: string): Promise<ApiHoliday[]> {
  // TODO: 공휴일 화면이 아직 없다.
  return apiRequest<ApiHoliday[]>("/wards/me/holidays", { query: { yearMonth } });
}

// RULE-05
export async function putHoliday(date: string, body: ApiHolidayPutBody): Promise<ApiHoliday> {
  return apiRequest<ApiHoliday>(`/wards/me/holidays/${date}`, { method: "PUT", body });
}

// RULE-06/07 (🔶 결정 필요). 계산식은 constants에 둔다: OFF_TARGET_FORMULA_LABEL
export const OFF_TARGET_FORMULA = OFF_TARGET_FORMULA_LABEL;

export async function getOffTarget(yearMonth: string): Promise<ApiOffTarget> {
  return apiRequest<ApiOffTarget>(`/wards/me/off-targets/${yearMonth}`);
}

export async function patchOffTarget(yearMonth: string, body: ApiOffTargetPatchBody): Promise<ApiOffTarget> {
  return apiRequest<ApiOffTarget>(`/wards/me/off-targets/${yearMonth}`, { method: "PATCH", body });
}
