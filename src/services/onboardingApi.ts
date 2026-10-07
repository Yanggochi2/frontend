import { apiRequest, isApiConfigured } from "@/lib/apiClient";
import {
  createWardDefaultsMock,
  pendingInfoMock,
  selectWardInfoMock,
} from "@/mocks/onboarding.mock";
import type {
  CreateWardDefaults,
  CreateWardInput,
  PendingInfo,
  SelectWardInfo,
} from "@/types/onboarding.type";
import type {
  CreateWardRequest,
  CreateWardResponse,
  JoinWardRequest,
  MeResponse,
  MembershipRequest,
} from "@/types/wardApi.type";

// 화면 안내 문구용 값이라 API가 없다.
export async function getSelectWardInfo(): Promise<SelectWardInfo> {
  return selectWardInfoMock;
}

// TODO: 내 가입 신청을 조회하는 API가 명세에 없다. GET /me의 ward/membership으로 대신하며,
// 신청 시각(requestedAt)의 출처와 승인 대기 중 ward 노출 여부는 백엔드 확정 후 결정한다.
export async function getPendingInfo(): Promise<PendingInfo> {
  if (!isApiConfigured) return pendingInfoMock;
  const me = await apiRequest<MeResponse>("/me");
  return {
    hospitalName: me.ward?.hospitalName ?? "-",
    wardName: me.ward?.wardName ?? "-",
    requestedAt: me.membership?.joinedAt ?? "-",
  };
}

// TODO: 규칙 프리셋 목록과 기본 인원 API는 명세에 없다. 화면 기본값은 mock을 그대로 쓴다.
export async function getCreateWardDefaults(): Promise<CreateWardDefaults> {
  return createWardDefaultsMock;
}

// WARD-03. 오류 코드 JOIN_CODE_NOT_FOUND, REQUEST_ALREADY_EXISTS, RATE_LIMITED는 호출한 쪽이 ApiError로 받는다.
export async function requestWardJoin(joinCode: string): Promise<void> {
  if (!isApiConfigured) return;
  const body: JoinWardRequest = { joinCode };
  await apiRequest<MembershipRequest>("/ward-membership-requests", {
    method: "POST",
    body,
    idempotencyKey: crypto.randomUUID(),
  });
}

// WARD-01. role/병동 ID는 본문에 없다.
export async function createWard(input: CreateWardInput): Promise<void> {
  if (!isApiConfigured) return;
  const body: CreateWardRequest = {
    hospitalName: input.hospitalName,
    wardName: input.wardName,
    requiredStaff: input.requiredStaff,
    rulePreset: input.rulePreset,
  };
  await apiRequest<CreateWardResponse>("/wards", {
    method: "POST",
    body,
    idempotencyKey: crypto.randomUUID(),
  });
}
