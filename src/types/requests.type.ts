import type { PreferredDuty } from "@/types/requestsApi.type";

export type RequestKind = "ANNUAL_LEAVE" | "PREFERRED_OFF" | "PREFERRED_SHIFT";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type { PreferredDuty };

// TODO: 응답 필드는 백엔드 확정 후 결정
export type RequestItem = {
  id: string;
  nurseName: string;
  kind: RequestKind;
  /** 화면 표시용 문자열 (예: "10/14 (수)", "10/20 ~ 10/22") */
  targetDateLabel: string;
  reason: string;
  /** TODO: 백엔드 확정 후 결정 — 명세 WorkRequest에 신청 시각 필드가 없다 */
  requestedAtLabel?: string;
  status: RequestStatus;
  /** 승인/반려된 건의 처리일 (예: "10/01") */
  processedAtLabel?: string;
};

export type RequestListResult = {
  items: RequestItem[];
  pendingCount: number;
  monthLabel: string;
};

export type RequestFormOptions = {
  year: number;
  month: number;
  /** 오늘 날짜(일). 이전 날짜는 선택할 수 없다. */
  today: number;
  initialSelectedDay: number;
  reasons: { value: string; label: string }[];
};

export type PreviewState = "empty" | "error";
