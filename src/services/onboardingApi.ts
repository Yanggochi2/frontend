import {
  createWardDefaultsMock,
  pendingInfoMock,
  selectWardInfoMock,
} from "@/mocks/onboarding.mock";
import type {
  CreateWardDefaults,
  PendingInfo,
  SelectWardInfo,
} from "@/types/onboarding.type";

// TODO: 백엔드 확정 후 실제 요청으로 교체 (주소는 환경 변수로 분리)
export async function getSelectWardInfo(): Promise<SelectWardInfo> {
  return selectWardInfoMock;
}

export async function getPendingInfo(): Promise<PendingInfo> {
  return pendingInfoMock;
}

export async function getCreateWardDefaults(): Promise<CreateWardDefaults> {
  return createWardDefaultsMock;
}
