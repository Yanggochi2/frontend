import { apiRequest } from "@/lib/apiClient";
import { CREATE_WARD_DEFAULTS, SELECT_WARD_INFO } from "@/constants/onboarding.constants";
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
  return SELECT_WARD_INFO;
}

// 승인 대기 중에는 membership/ward가 null이고, 신청 정보는 GET /me의 membershipRequest에 온다.
export async function getPendingInfo(): Promise<PendingInfo> {
  const { membershipRequest: r } = await apiRequest<MeResponse>("/me");
  return {
    hospitalName: r?.hospitalName ?? "-",
    wardName: r?.wardName ?? "-",
    requestedAt: r?.createdAt ? new Date(r.createdAt).toLocaleString("ko-KR") : "-",
  };
}

// TODO: 규칙 프리셋 목록과 기본 인원 API는 명세에 없다. 화면 기본값은 constants를 쓴다.
export async function getCreateWardDefaults(): Promise<CreateWardDefaults> {
  return CREATE_WARD_DEFAULTS;
}

// WARD-03. 오류 코드 JOIN_CODE_NOT_FOUND, REQUEST_ALREADY_EXISTS, RATE_LIMITED는 호출한 쪽이 ApiError로 받는다.
export async function requestWardJoin(joinCode: string): Promise<void> {
  const body: JoinWardRequest = { joinCode };
  await apiRequest<MembershipRequest>("/ward-membership-requests", {
    method: "POST",
    body,
    idempotencyKey: crypto.randomUUID(),
  });
}

// WARD-01. role/병동 ID는 본문에 없다.
export async function createWard(input: CreateWardInput): Promise<void> {
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
