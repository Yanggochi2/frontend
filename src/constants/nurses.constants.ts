import type { DutyRole, NurseRole, NurseStatus } from "@/types/nurses.type";

export const NURSE_ROLE_LABEL: Record<NurseRole, string> = {
  HEAD_NURSE: "수간호사",
  NURSE: "간호사",
};

export const DUTY_ROLE_LABEL: Record<DutyRole, string> = {
  GENERAL: "일반",
  CHARGE: "차지",
  PRECEPTOR: "프리셉터",
  NEWBIE: "신입",
};

// TODO(🔶 NUR-01) 상태 값 목록(퇴사 외 임신/휴직 등) 미확정. 화면 임시 값. 퇴사는 등록 불가(COM-02).
export const NURSE_STATUS_LABEL: Record<NurseStatus, string> = {
  ACTIVE: "재직",
  PREGNANT: "임신",
  LEAVE: "휴직",
  RETIRED: "퇴사",
};

export const REGISTRABLE_STATUSES: NurseStatus[] = ["ACTIVE", "PREGNANT", "LEAVE"];

// TODO(🔶 NUR-01) 숙련도 범위(1~5) 미확정. 화면 임시 값.
export const SKILL_LEVELS = [1, 2, 3, 4, 5];
