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
  requestedAtLabel?: string;
  status: RequestStatus;
  /** 승인/반려된 건의 처리일 (예: "10/01") */
  processedAtLabel?: string;
  /** false면 승인/반려 버튼을 숨긴다 (일반 간호사가 보는 내 신청) */
  decidable?: boolean;
};

export type RequestListResult = {
  items: RequestItem[];
  pendingCount: number;
  monthLabel: string;
};

export type RequestFormOptions = {
  year: number;
  month: number;
  /** 이전·다음 달로 갈 수 있으면 그 달(YYYY-MM). 범위 밖이면 null */
  prevYearMonth: string | null;
  nextYearMonth: string | null;
  /** 오늘 날짜(일). 이전 날짜는 선택할 수 없다. 이번 달이 아니면 0 */
  today: number;
  initialSelectedDay: number;
  /** 그 달 공휴일. 일 → 이름. 받지 못하면 비어 있다 */
  holidays: Record<number, string>;
  reasons: { value: string; label: string }[];
};
