// docs/API.md 근무표·자동 생성 모델. 명세에 모양이 없는 필드는 unknown으로 두고 TODO로 남긴다.
import type { PageMeta } from "./api.type";

// TODO(🔶 ED 교육): ED 코드는 미확정. 타입에서만 받아 주고 입력 UI는 만들지 않는다.
export type ApiDutyCode = "D" | "E" | "N" | "O" | "AL" | "ED";
export type ScheduleStatus = "DRAFT" | "GENERATING" | "CONFIRMED" | "ARCHIVED";

export type ApiScheduleNurse = {
  id: string;
  name: string;
  // 그 밖의 Nurse 필드(숙련도·경력 등)는 역할별로 다르다. 받은 것만 표시한다.
  [key: string]: unknown;
};

export type ApiScheduleCell = {
  nurseId: string;
  date: string; // YYYY-MM-DD
  dutyCode: ApiDutyCode | null;
  editable: boolean;
};

export type ApiCoverageStatus = "UNDER" | "MET" | "OVER";

export type ApiCoverage = {
  date: string;
  dutyCode: ApiDutyCode;
  actualCount: number;
  requiredCount: number;
  status: ApiCoverageStatus;
};

export type ApiViolation = {
  id: string;
  severity: "HARD" | "SOFT";
  ruleId: string;
  nurseId: string | null; // TODO: 병동 단위 위반(커버리지 등)에 null이 오는지 명세 없음
  date: string | null;
  currentValue: unknown; // TODO: 백엔드 확정 후 결정
  message: string;
};

export type ApiSchedule = {
  id: string;
  yearMonth: string; // YYYY-MM
  status: ScheduleStatus;
  version: number;
  nurses: ApiScheduleNurse[];
  cells: ApiScheduleCell[];
  coverage: ApiCoverage[];
  statistics?: unknown; // TODO: 백엔드 확정 후 결정 (명세에 통계 API 없음)
  confirmedAt: string | null;
};

// SCH-04
export type ApiCellChange = { nurseId: string; date: string; dutyCode: ApiDutyCode | null };
// AL 직접 입력은 금지다 (docs/API.md). 호출부에서 막는다.
export type ApiCellBulkPatch = { baseVersion: number; changes: ApiCellChange[] };
export type ApiCellBulkPatchResult = {
  changedCells: ApiScheduleCell[];
  version: number;
  coverage: ApiCoverage[];
  violations: ApiViolation[];
};

export type ApiViolationQuery = {
  severity?: "HARD" | "SOFT";
  nurseId?: string;
  ruleId?: string;
  page?: number;
  size?: number;
};
export type ApiViolationList = { data: ApiViolation[]; meta: PageMeta };

// SCH-07 / SCH-08
export type ApiConfirmRequest = { acknowledgedSoftViolationIds: string[] };
export type ApiConfirmCancelRequest = { reason: string };

// GEN
export type GenerationJobStatus = "QUEUED" | "RUNNING" | "SUCCEEDED" | "STOPPED" | "NO_SOLUTION" | "FAILED";

export type ApiGenerationJob = {
  id: string;
  scheduleId: string;
  status: GenerationJobStatus;
  stage: unknown; // TODO: 백엔드 확정 후 결정 (단계 이름/번호 형식)
  elapsedSeconds: number;
  progress: number; // TODO: 0~1인지 0~100인지 명세 없음
  hardViolationCount: number;
  metrics: unknown; // TODO: 백엔드 확정 후 결정
  conflicts: unknown; // TODO: 백엔드 확정 후 결정
  relaxations: unknown; // TODO: 백엔드 확정 후 결정 (relaxationIds로 쓰이는 항목의 모양)
};

export type ApiGenerationStart = {
  fixedCells: ApiCellChange[]; // TODO: fixedCells 원소 모양은 명세에 없음. 셀 변경과 같다고 가정(추측)
  maxSeconds: number;
};
export type ApiGenerationStop = { applyBestResult: boolean };
export type ApiGenerationRelaxations = { relaxationIds: string[] };
export type ApiGenerationPartialApply = { baseVersion: number };
export type ApiScheduleWithViolations = ApiSchedule & { violations: ApiViolation[] }; // GEN-05 (추측: 병합 형태)
