export type NurseRole = "HEAD_NURSE" | "NURSE";
export type DutyRole = "GENERAL" | "CHARGE" | "PRECEPTOR" | "NEW";
export type NurseStatus = "ACTIVE" | "PREGNANT" | "ON_LEAVE" | "RETIRED";

// TODO: 응답 필드는 백엔드 확정 후 결정. 일반 간호사 응답에는 숙련도·경력·상태가 없을 수 있다(서버 규칙).
export type Nurse = {
  id: string;
  name: string;
  role: NurseRole;
  /** 아래 필드는 받은 것만 표시한다 (일반 간호사 응답에는 없을 수 있음) */
  dutyRole?: DutyRole;
  status?: NurseStatus;
  careerYears?: number;
  careerMonths?: number;
  skill?: number;
  periodLabel?: string;
};

export type NurseListResult = {
  items: Nurse[];
  activeCount: number;
};
