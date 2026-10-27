import type { RuleFilter } from "@/types/rules.type";

// 🔶 미확정 규칙 값 모음. 확정되면 서버 응답으로 대체한다.
// TODO(🔶 RULE-02) 연속 나이트 최대 일수 (임시 3일)
export const MAX_CONSECUTIVE_NIGHT_DAYS = 3;
// OFF 목표 계산식 (백엔드 자동 계산). 확정된 지난달에 못 쓴 오프는 간호사별로 이월된다
export const OFF_TARGET_FORMULA_LABEL = "주말 + 공휴일 + 1";
// TODO(🔶 SCH-10) 통계 표의 OFF 목표 개수 (임시 12)
export const OFF_TARGET_DAYS = 12;
// TODO(🔶 RULE-01) 하루 필요 인원 (평일/주말/공휴일 구분 미확정, 임시 단일 값)
export const REQUIRED_STAFF_PER_DAY = { D: 7, E: 5, N: 5 } as const;
// TODO(🔶 SCH-10) 통계에서 빨강으로 강조하는 OFF 부족 일수 기준 (Figma 샘플: 2일 부족은 강조, 1일 부족은 일반 표시)
export const OFF_SHORTAGE_WARN_DAYS = 2;

// 규칙 화면 필터 칩 (config). 월 휴무 목표는 규칙(OFF_TARGET)으로 다룬다.
export const RULE_FILTER_CHIPS: RuleFilter[] = [
  { key: "ALL", label: "전체" },
  { key: "REQUIRED", label: "필수 규칙" },
  { key: "RECOMMENDED", label: "권장 규칙" },
  { key: "HOLIDAY", label: "공휴일" },
];
