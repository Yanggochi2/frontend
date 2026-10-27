import type { CreateWardDefaults, SelectWardInfo } from "@/types/onboarding.type";

// 화면 안내 문구와 폼 기본값. 서버 데이터가 아니다.
// TODO(🔶 RULE-01): 기본 필요 인원과 규칙 프리셋 목록은 미확정. 확정되면 서버 응답으로 대체한다.
export const SELECT_WARD_INFO: SelectWardInfo = {
  codePlaceholder: "코드를 입력해요 (예: AB12CD34)",
};

export const CREATE_WARD_DEFAULTS: CreateWardDefaults = {
  requiredStaff: { D: 7, E: 5, N: 5 },
  presets: [
    // id는 백엔드 Preset 값 (STANDARD | MINIMAL)
    { id: "STANDARD", label: "일반 병동 기본값" },
    { id: "MINIMAL", label: "필수 규칙만" },
  ],
  defaultPresetId: "STANDARD",
};
