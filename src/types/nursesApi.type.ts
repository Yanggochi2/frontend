// docs/API.md NUR-01~05 모델. 일반 간호사 응답에는 숙련도·경력·상태 등이 없을 수 있어 optional로 둔다.
export type ApiNurseRole = "HEAD_NURSE" | "NURSE";
export type ApiDutyRole = "CHARGE" | "PRECEPTOR" | "NEW" | "GENERAL" | "NIGHT_ONLY";
export type ApiNurseStatus = "ACTIVE" | "PREGNANT" | "ON_LEAVE" | "RETIRED";

// TODO: 백엔드 확정 후 결정 — id 타입, 역할별로 어떤 필드가 빠지는지
export type ApiNurse = {
  id: string;
  name: string;
  role: ApiNurseRole;
  dutyRole?: ApiDutyRole;
  status?: ApiNurseStatus | null;
  joinedAt?: string;
  careerMonths?: number | null;
  skillLevel?: number | null;
  affiliationStart?: string;
  affiliationEnd?: string | null;
  preceptorOf?: string[] | null; // 담당 신입 간호사 id 목록
  version?: number;
  /** 수간호사 응답에만. 이 간호사 행에 로그인 계정이 연결돼 있는지 */
  hasAccount?: boolean;
  /** 수간호사 응답에만. 유효한 개인 초대 코드가 나가 있으면 만료 시각 */
  inviteExpiresAt?: string | null;
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
  preceptorOf?: string[] | null; // 담당 신입 간호사 id 목록
};

// NUR-04 본문. role 제외. version은 낙관적 잠금 검사용으로 본문에 담는다.
export type NursePatch = Partial<NurseCreate> & { version?: number };

export type ApiNurseMutationResult = {
  nurse: ApiNurse;
  violations: unknown[];
  warnings: string[];
};

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
