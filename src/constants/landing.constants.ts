// 랜딩(/) 화면 문구. 패널 안의 근무표·신청·기록 예시는 서비스를 설명하기 위한 예시 문구다.

export const LANDING_NAV = [
  { href: "#auto", label: "자동 생성" },
  { href: "#rules", label: "규칙 검사" },
  { href: "#request", label: "근무 신청" },
  { href: "#stats", label: "통계" },
  { href: "#audit", label: "감사 로그" },
] as const;

export const LANDING_DUTY_LEGEND = [
  { label: "D 주간", swatch: "bg-landing-d" },
  { label: "E 저녁", swatch: "bg-landing-e" },
  { label: "N 야간", swatch: "bg-landing-n" },
  { label: "O 휴무", swatch: "bg-landing-o" },
] as const;

export type LandingRow = { title: string; sub: string; tag?: { label: string; tone: "bad" | "ok" | "plain" }; time?: string };

export const LANDING_RULE_ROWS: LandingRow[] = [
  { title: "야간 직후 주간", sub: "간호사 3 · 6일", tag: { label: "위반", tone: "bad" } },
  { title: "연속 야간 상한", sub: "전원", tag: { label: "통과", tone: "plain" } },
  { title: "시간대별 최소 인원", sub: "30일 전체", tag: { label: "통과", tone: "plain" } },
];

export const LANDING_REQUEST_ROWS: LandingRow[] = [
  { title: "12일 휴무 희망", sub: "간호사 5", tag: { label: "승인", tone: "ok" } },
  { title: "20–21일 야간 희망", sub: "간호사 2", tag: { label: "검토 중", tone: "plain" } },
  { title: "3일 주간 희망", sub: "간호사 4", tag: { label: "승인", tone: "ok" } },
];

export const LANDING_AUDIT_ROWS: LandingRow[] = [
  { title: "간호사 3 · 6일 D → O", sub: "수간호사", time: "14:02" },
  { title: "11월 근무표 자동 생성", sub: "시스템", time: "13:55" },
  { title: "간호사 5 · 12일 휴무 승인", sub: "수간호사", time: "09:30" },
];

// 3D 배경이 따라가는 섹션 순서. 섹션 id와 같아야 한다.
export const LANDING_SECTION_IDS = ["hero", "auto", "rules", "request", "stats", "audit", "cta"] as const;
