// mock: 백엔드 연동 전 임시 데이터. 응답 필드는 백엔드 확정 후 결정 (TODO)
import type {
  CreateWardDefaults,
  PendingInfo,
  SelectWardInfo,
} from "@/types/onboarding.type";

export const selectWardInfoMock: SelectWardInfo = {
  codePlaceholder: "코드를 입력해요 (예: AB12CD34)",
};

export const pendingInfoMock: PendingInfo = {
  hospitalName: "샘플병원",
  wardName: "내과 3병동",
  requestedAt: "10/06 09:30",
};

export const createWardDefaultsMock: CreateWardDefaults = {
  requiredStaff: { D: 4, E: 3, N: 2 },
  presets: [
    { id: "general", label: "일반 병동 기본값" },
    { id: "required-only", label: "필수 규칙만" },
  ],
  defaultPresetId: "general",
};
