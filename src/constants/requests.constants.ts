import type { RequestKind } from "@/types/requests.type";

// 🔶 미확정 값 모음. 확정되면 서버 값으로 교체한다.

// TODO(🔶 REQ-01) 사유 코드 목록 미확정. 화면 임시 값. 코드 값(value)도 백엔드 확정 전 임시다.
// 명세상 확정인 것은 ETC(reasonDetail 필수)뿐이다.
export const REQUEST_REASON_ETC = "ETC";
export const REQUEST_REASONS = [
  { value: "PERSONAL", label: "개인사정" },
  { value: "FAMILY_EVENT", label: "가족행사" },
  { value: "HEALTH", label: "건강" },
  { value: "STUDY", label: "학업" },
  { value: REQUEST_REASON_ETC, label: "기타" },
];

// TODO(🔶 REQ-01) 월 신청 건수 제한 미확정. 값이 정해지면 폼에서 안내/검증에 쓴다.
export const MONTHLY_REQUEST_LIMIT: number | null = null;

// TODO: PREFERRED_SHIFT(희망 근무)는 시안에 선택 UI가 없어 폼 옵션에서 제외. 추가 시 preferredDuty(D/E/N) 입력이 필요하다.
export const REQUEST_KIND_OPTIONS = [
  { value: "ANNUAL_LEAVE", label: "연차", description: "승인되면 꼭 쉬게 돼요" },
  { value: "PREFERRED_OFF", label: "희망 오프", description: "가능하면 맞춰 드려요" },
] as const;

export const REQUEST_KIND_LABEL: Record<RequestKind, string> = {
  ANNUAL_LEAVE: "연차",
  PREFERRED_OFF: "희망 오프",
  PREFERRED_SHIFT: "희망 근무",
};
