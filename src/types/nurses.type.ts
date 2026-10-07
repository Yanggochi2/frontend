export type NurseRole = "HEAD_NURSE" | "NURSE";
export type DutyRole = "GENERAL" | "CHARGE" | "PRECEPTOR" | "NEWBIE";
export type NurseStatus = "ACTIVE" | "PREGNANT" | "LEAVE" | "RETIRED";

// TODO: 응답 필드는 백엔드 확정 후 결정. 일반 간호사 응답에는 숙련도·경력·상태가 없을 수 있다(서버 규칙).
export type Nurse = {
  id: string;
  name: string;
  role: NurseRole;
  dutyRole: DutyRole;
  status: NurseStatus;
  careerYears: number;
  careerMonths: number;
  skill: number;
  periodLabel: string;
};

export type NurseListResult = {
  items: Nurse[];
  activeCount: number;
};
