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
  /** 수간호사 응답에만. 로그인 계정이 연결된 간호사인지 */
  hasAccount?: boolean;
  /** 유효한 개인 초대 코드가 나가 있는지 */
  inviteActive?: boolean;
};

// 간호사 등록 폼의 입력값. 날짜는 YYYY-MM-DD 문자열, 숫자는 입력 그대로 문자열.
export type NurseDraft = {
  name: string;
  hireDate: string;
  dutyRole: DutyRole;
  careerYears: string;
  careerMonths: string;
  skill: number;
  status: NurseStatus;
  periodStart: string;
};

export type NurseListResult = {
  items: Nurse[];
  activeCount: number;
};
