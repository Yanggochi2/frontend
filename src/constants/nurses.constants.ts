import type { DutyRole, NurseRestriction, NurseRole, NurseStatus, SkillGroup } from "@/types/nurses.type";

export const NURSE_ROLE_LABEL: Record<NurseRole, string> = {
  HEAD_NURSE: "수간호사",
  NURSE: "간호사",
};

export const DUTY_ROLE_LABEL: Record<DutyRole, string> = {
  GENERAL: "일반",
  CHARGE: "차지",
  PRECEPTOR: "프리셉터",
  NEW: "신입",
};

// 상태 값은 API 명세(ACTIVE|PREGNANT|ON_LEAVE|RETIRED). 퇴사는 등록 불가(COM-02, NUR-05로 처리).
export const NURSE_STATUS_LABEL: Record<NurseStatus, string> = {
  ACTIVE: "재직",
  PREGNANT: "임신",
  ON_LEAVE: "휴직",
  RETIRED: "퇴사",
};

export const REGISTRABLE_STATUSES: NurseStatus[] = ["ACTIVE", "PREGNANT", "ON_LEAVE"];

// 숙련도 1~5 (API 명세 NurseCreate.skillLevel)
export const SKILL_LEVELS = [1, 2, 3, 4, 5];

export const NURSE_RESTRICTIONS: NurseRestriction[] = ["NONE", "PREGNANT", "POSTPARTUM_RETURN", "NIGHT_KEEP", "ON_LEAVE"];

export const NURSE_RESTRICTION_LABEL: Record<NurseRestriction, string> = {
  NONE: "일반",
  PREGNANT: "임신",
  POSTPARTUM_RETURN: "출산 후 복귀",
  NIGHT_KEEP: "나이트 킵",
  ON_LEAVE: "휴직",
};

export const NURSE_RESTRICTION_HINT: Record<NurseRestriction, string> = {
  NONE: "",
  PREGNANT: "나이트에서 빠져요",
  POSTPARTUM_RETURN: "신규로 보지 않고 1인분으로 배치해요",
  NIGHT_KEEP: "나이트 전담 지원자예요",
  ON_LEAVE: "근무를 배정하지 않아요",
};

// TODO(🔶 숙련 그룹 단계·이름): 3단계 이름은 임시
export const SKILL_GROUPS: SkillGroup[] = ["숙련", "중간", "신규"];

// 숙련 그룹 추천 기준 (비즈니스 로직 10-19: 총경력 30% + 병동 경력 70%). 참고용이고 지정은 수간호사가 한다.
export const SKILL_WEIGHT = { total: 0.3, ward: 0.7 } as const;
// TODO(🔶 숙련 그룹 경계): 가중 경력(년)이 이 값 이상이면 그 그룹. 임시 값
export const SKILL_GROUP_THRESHOLD_YEARS: { group: SkillGroup; minYears: number }[] = [
  { group: "숙련", minYears: 5 },
  { group: "중간", minYears: 2 },
  { group: "신규", minYears: 0 },
];

// 지금 백엔드가 필수로 받는 숙련도(skillLevel)로 바꾸는 값. TODO: 백엔드가 숙련 그룹을 받으면 지운다
export const LEGACY_SKILL_LEVEL: Record<SkillGroup, number> = { 숙련: 5, 중간: 3, 신규: 1 };
