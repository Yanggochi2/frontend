// docs/API.md REQ-01~07 모델. 명세에 없는 필드는 만들지 않는다.
export type WorkRequestType = "ANNUAL_LEAVE" | "PREFERRED_OFF" | "PREFERRED_SHIFT";
export type WorkRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type PreferredDuty = "D" | "E" | "N";

// TODO: 백엔드 확정 후 결정 — id 타입, 신청 시각(createdAt)·신청자 이름 필드는 명세에 없다.
export type ApiWorkRequest = {
  id: string;
  applicantId: string;
  type: WorkRequestType;
  /** YYYY-MM-DD 목록 */
  targetDates: string[];
  reasonCode: string;
  /** 일반 간호사 응답에는 없을 수 있다 */
  reasonDetail?: string | null;
  preferredDuty?: PreferredDuty | null;
  status: WorkRequestStatus;
  processorId?: string | null;
  /** UTC ISO 8601 */
  processedAt?: string | null;
  rejectionReason?: string | null;
};

// REQ-01 본문. role/병동 ID는 담지 않는다.
export type WorkRequestCreate = {
  type: WorkRequestType;
  targetDates: string[];
  reasonCode: string;
  /** reasonCode가 ETC일 때 필수 */
  reasonDetail?: string;
  /** type이 PREFERRED_SHIFT일 때만 */
  preferredDuty?: PreferredDuty;
};

// REQ-02 / REQ-03 쿼리
export type WorkRequestQuery = {
  /** REQ-03(수간호사)만 */
  applicantId?: string;
  yearMonth?: string;
  type?: WorkRequestType;
  status?: WorkRequestStatus;
  page?: number;
  size?: number;
};

// TODO: 백엔드 확정 후 결정 — REQ-05 scheduleImpact 응답 구조는 명세에 없다.
