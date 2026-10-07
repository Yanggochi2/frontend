// 🔶 미확정 규칙 값 모음. 확정되면 서버 응답으로 대체한다.
// TODO(🔶 RULE-02) 연속 나이트 최대 일수 (임시 3일)
export const MAX_CONSECUTIVE_NIGHT_DAYS = 3;
// TODO(🔶 RULE-04) OFF 목표 계산식 (주휴일 포함 여부에 따라 4~5일 차이, 임시: 공휴일 수 + 1)
export const OFF_TARGET_FORMULA_LABEL = "공휴일 수 + 1";
// TODO(🔶 SCH-10) 통계 표의 OFF 목표 개수 (임시 12)
export const OFF_TARGET_DAYS = 12;
// TODO(🔶 RULE-01) 하루 필요 인원 (평일/주말/공휴일 구분 미확정, 임시 단일 값)
export const REQUIRED_STAFF_PER_DAY = { D: 4, E: 3, N: 2 } as const;
// TODO(🔶 SCH-10) 통계에서 빨강으로 강조하는 OFF 부족 일수 기준 (Figma 샘플: 2일 부족은 강조, 1일 부족은 일반 표시)
export const OFF_SHORTAGE_WARN_DAYS = 2;
