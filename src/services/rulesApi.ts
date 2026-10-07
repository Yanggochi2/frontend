import { rulesMock } from "@/mocks/rules.mock";
import type { PreviewState } from "@/types/adminCommon.type";
import type { RulesData } from "@/types/rules.type";

// TODO: 백엔드 확정 후 실제 요청으로 교체 (주소는 환경 변수로 분리)
export async function getRules(state?: PreviewState): Promise<RulesData> {
  if (state === "error") throw new Error("rules load failed");
  if (state === "empty") return { ...rulesMock, rules: [] };
  return rulesMock;
}
