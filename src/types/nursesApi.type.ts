// docs/API.md NUR-01~05 모델. 일반 간호사 응답에는 숙련도·경력·상태 등이 없을 수 있어 optional로 둔다.
export type ApiNurseRole = "HEAD_NURSE" | "NURSE";
export type ApiDutyRole = "CHARGE" | "PRECEPTOR" | "NEW" | "GENERAL";
export type ApiNurseStatus = "ACTIVE" | "PREGNANT" | "ON_LEAVE" | "RETIRED";

// TODO: 백엔드 확정 후 결정 — id 타입, 역할별로 어떤 필드가 빠지는지
export type ApiNurse = {
  id: string;
  name: string;
  role: ApiNurseRole;
  dutyRole?: ApiDutyRole;
  status?: ApiNurseStatus;
  joinedAt?: string;
  careerMonths?: number;
  skillLevel?: number;
  affiliationStart?: string;
  affiliationEnd?: string | null;
  preceptorOf?: string | null;
  version?: number;
};

// NUR-01 본문. role은 보내지 않는다(권한 부여는 WARD-09).
export type NurseCreate = {
  name: string;
  dutyRole: ApiDutyRole;
  status: ApiNurseStatus;
  joinedAt: string;
  careerMonths: number;
  skillLevel: number;
  affiliationStart: string;
  affiliationEnd?: string | null;
  /** 같은 병동의 NEW 간호사만 */
  preceptorOf?: string | null;
};

// NUR-04 본문. role 제외.
// TODO: 백엔드 확정 후 결정 — VERSION_CONFLICT 검사를 위해 version을 본문에 담는지 헤더인지
export type NursePatch = Partial<NurseCreate> & { version?: number };

// NUR-02 쿼리
export type NurseListQuery = {
  q?: string;
  role?: ApiNurseRole;
  dutyRole?: ApiDutyRole;
  status?: ApiNurseStatus;
  includeRetired?: boolean;
  /** 예: "name,asc" */
  sort?: string;
  page?: number;
  size?: number;
};

// TODO: 백엔드 확정 후 결정 — NUR-04/05의 "Nurse+Violation[]" 응답 래핑 형태는 명세에 없다.
