// mock: 백엔드 연동 전 임시 데이터. 규칙 값은 🔶 미확정(TODO RULE-01~05)
import { MAX_CONSECUTIVE_NIGHT_DAYS, OFF_TARGET_FORMULA_LABEL } from "@/constants/rules.constants";
import type { RulesData } from "@/types/rules.type";

export const rulesMock: RulesData = {
  filters: [
    { key: "REQUIRED", label: "필수 규칙" },
    { key: "RECOMMENDED", label: "권장 규칙" },
    { key: "HOLIDAY", label: "공휴일" },
    { key: "OFF_TARGET", label: "OFF 목표" },
  ],
  rules: [
    { id: "r1", name: "차지는 데이 근무만", category: "REQUIRED", strength: "REQUIRED", valueText: "D 고정", targetText: "차지" },
    { id: "r2", name: "신입은 나이트 단독 금지", category: "REQUIRED", strength: "REQUIRED", valueText: "같은 날 비신입 1명 이상", targetText: "신입" },
    { id: "r3", name: "임신 상태는 나이트 불가", category: "REQUIRED", strength: "REQUIRED", valueText: "N 배정 금지", targetText: "해당자" },
    { id: "r4", name: "연속 나이트 제한", category: "REQUIRED", strength: "REQUIRED", valueText: `최대 ${MAX_CONSECUTIVE_NIGHT_DAYS}일`, targetText: "전체" },
    { id: "r5", name: "프리셉터와 신입은 같은 듀티", category: "RECOMMENDED", strength: "RECOMMENDED", valueText: "가능하면 맞추기", targetText: "프리셉터·신입" },
    { id: "r6", name: "OFF 목표 채우기", category: "RECOMMENDED", strength: "RECOMMENDED", valueText: OFF_TARGET_FORMULA_LABEL, targetText: "전체" },
  ],
};
