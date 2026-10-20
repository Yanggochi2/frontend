export type NurseRole = "HEAD_NURSE" | "NURSE";
export type DutyRole = "GENERAL" | "CHARGE" | "PRECEPTOR" | "NEW";
export type NurseStatus = "ACTIVE" | "PREGNANT" | "ON_LEAVE" | "RETIRED";
// 근무 제한 유형 (비즈니스 로직 10-19, 2장). 휴직은 지금 상태(status) 값을 그대로 쓴다.
// TODO: 백엔드 확정 후 결정 (값 이름)
export type NurseRestriction = "NONE" | "PREGNANT" | "POSTPARTUM_RETURN" | "NIGHT_KEEP" | "ON_LEAVE";
// TODO(🔶 숙련 그룹 단계·이름): 숙련도 3단계로 바뀐다는 것만 정해짐
export type SkillGroup = "숙련" | "중간" | "신규";

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
// 비즈니스 로직(10-19, 2장): 듀티 역할·숙련도·상태 대신 근무 제한, 숙련 그룹, 프리셉터 여부를 받는다.
export type NurseDraft = {
  name: string;
  hireDate: string;
  careerYears: string;
  careerMonths: string;
  wardYears: string; // 병동 경력
  wardMonths: string;
  restriction: NurseRestriction;
  skillGroup: SkillGroup | null; // 수간호사가 고른다. 고르기 전에는 null
  isPreceptor: boolean;
  history: string; // 비고: 이전 근무 병동, 전입·복귀 이력 등
  periodStart: string;
};

export type NurseListResult = {
  items: Nurse[];
  activeCount: number;
};
