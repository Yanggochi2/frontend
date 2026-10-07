// 🔶 미확정 값 모음. 확정되면 서버 값으로 교체한다.

// TODO(🔶 REQ-01) 사유 코드 목록 미확정. 화면 임시 값.
export const REQUEST_REASONS = ["개인사정", "가족행사", "건강", "학업", "기타"];

// TODO(🔶 REQ-01) 월 신청 건수 제한 미확정. 값이 정해지면 폼에서 안내/검증에 쓴다.
export const MONTHLY_REQUEST_LIMIT: number | null = null;

export const REQUEST_KIND_OPTIONS = [
  { value: "ANNUAL", label: "연차", description: "승인되면 꼭 쉬게 돼요" },
  { value: "WISH_OFF", label: "희망 오프", description: "가능하면 맞춰 드려요" },
] as const;
