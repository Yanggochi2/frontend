import { rulesMock } from "@/mocks/rules.mock";
import { OFF_TARGET_FORMULA_LABEL } from "@/constants/rules.constants";
import { apiRequest, isApiConfigured } from "@/lib/apiClient";
import type { PreviewState } from "@/types/adminCommon.type";
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

function toValueText(parameters: ApiRule["parameters"]): string {
  const entries = Object.entries(parameters ?? {});
  if (entries.length === 0) return "-";
  // TODO: 백엔드 확정 후 결정 (parameters 키 의미/단위를 몰라 key: value 그대로 표시)
  return entries.map(([k, v]) => `${k}: ${String(v)}`).join(", ");
}

export function toRuleItem(rule: ApiRule): RuleItem {
  const strength = rule.severity === "HARD" ? "REQUIRED" : "RECOMMENDED";
  return {
    id: rule.id,
    code: rule.code,
    name: rule.name,
    category: strength,
    strength,
    valueText: toValueText(rule.parameters),
    // TODO: 백엔드 확정 후 결정 (적용 대상 필드가 Rule에 없다)
    targetText: "-",
    enabled: rule.enabled,
    version: rule.version,
  };
}

export async function getRules(state?: PreviewState): Promise<RulesData> {
  if (!isApiConfigured) {
    if (state === "error") throw new Error("rules load failed");
    if (state === "empty") return { ...rulesMock, rules: [] };
    return rulesMock;
  }
  // RULE-01
  const rules = await apiRequest<ApiRule[]>("/wards/me/rules");
  return { filters: rulesMock.filters, rules: rules.map(toRuleItem) };
}

// RULE-02. 연결 전에는 호출자가 로컬 상태만 바꾸도록 null을 돌려준다.
export async function patchRule(ruleId: string, body: ApiRulePatchBody): Promise<RuleItem | null> {
  if (!isApiConfigured) return null;
  const result = await apiRequest<ApiRulePatchResult>(`/wards/me/rules/${encodeURIComponent(ruleId)}`, {
    method: "PATCH",
    body,
  });
  return toRuleItem(result);
}

// RULE-03
export async function applyRulePreset(presetId: string): Promise<RuleItem[] | null> {
  if (!isApiConfigured) return null;
  const rules = await apiRequest<ApiRule[]>(`/wards/me/rule-presets/${encodeURIComponent(presetId)}/apply`, {
    method: "POST",
  });
  return rules.map(toRuleItem);
}

// RULE-04
export async function getHolidays(yearMonth: string): Promise<ApiHoliday[]> {
  // TODO: 공휴일 화면이 아직 없다. mock도 없으므로 연결 전에는 빈 목록
  if (!isApiConfigured) return [];
  return apiRequest<ApiHoliday[]>("/wards/me/holidays", { query: { yearMonth } });
}

// RULE-05
export async function putHoliday(date: string, body: ApiHolidayPutBody): Promise<ApiHoliday | null> {
  if (!isApiConfigured) return null;
  return apiRequest<ApiHoliday>(`/wards/me/holidays/${date}`, { method: "PUT", body });
}

// RULE-06/07 (🔶 결정 필요). 계산식은 constants에 둔다: OFF_TARGET_FORMULA_LABEL
export const OFF_TARGET_FORMULA = OFF_TARGET_FORMULA_LABEL;

export async function getOffTarget(yearMonth: string): Promise<ApiOffTarget | null> {
  if (!isApiConfigured) return null;
  return apiRequest<ApiOffTarget>(`/wards/me/off-targets/${yearMonth}`);
}

export async function patchOffTarget(yearMonth: string, body: ApiOffTargetPatchBody): Promise<ApiOffTarget | null> {
  if (!isApiConfigured) return null;
  return apiRequest<ApiOffTarget>(`/wards/me/off-targets/${yearMonth}`, { method: "PATCH", body });
}
