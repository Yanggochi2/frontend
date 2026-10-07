import { apiRequest, apiRequestList, isApiConfigured } from "@/lib/apiClient";
import { wardSettingsMock } from "@/mocks/ward.mock";
import type { PreviewState } from "@/types/adminCommon.type";
import type { WardSettingsData } from "@/types/ward.type";
import type { ApiWard, JoinCode, Membership, TransferResult } from "@/types/wardApi.type";

// 수간호사 목록 항목. Nurse 전체 모델은 nurses 도메인 소관이라 여기서는 필요한 필드만 쓴다.
type HeadNurseItem = { id: string; name: string };

// WARD-02 + WARD-07 (+ NUR-02로 인원/수간호사 목록). 병동 설정은 수간호사 화면이다.
export async function getWardSettings(state?: PreviewState): Promise<WardSettingsData> {
  if (state === "error") throw new Error("ward settings load failed");
  if (!isApiConfigured) return wardSettingsMock;

  const [ward, joinCode, all, heads] = await Promise.all([
    apiRequest<ApiWard>("/wards/me"),
    apiRequest<JoinCode>("/wards/me/join-code"),
    apiRequestList<HeadNurseItem>("/wards/me/nurses", { query: { size: 1 } }),
    apiRequestList<HeadNurseItem>("/wards/me/nurses", { query: { role: "HEAD_NURSE", size: 100 } }),
  ]);

  return {
    hospitalName: ward.hospitalName,
    wardName: ward.wardName,
    nurseCount: all.meta.totalElements,
    dailyRequired: ward.requiredStaff,
    // TODO: 규칙 시작 방식(프리셋) 표시값은 응답에 없다. 백엔드 확정 후 결정 (RULE-01)
    ruleStartLabel: undefined,
    wardCode: joinCode.code,
    // TODO: 백엔드 확정 후 결정 (목록의 "나" 판별. Nurse에 userId가 없어 isMe를 알 수 없다)
    headNurses: heads.data.map((n) => ({ id: n.id, name: n.name, isMe: false })),
  };
}

// WARD-08. 새 코드를 돌려준다.
export async function rotateJoinCode(): Promise<string> {
  if (!isApiConfigured) return wardSettingsMock.wardCode;
  const res = await apiRequest<JoinCode>("/wards/me/join-code/rotate", {
    method: "POST",
    idempotencyKey: crypto.randomUUID(),
  });
  return res.code;
}

// WARD-09. TODO: 간호사를 고르는 화면이 Figma에 없어 연결하지 않았다.
export async function grantHeadNurse(nurseId: string): Promise<Membership> {
  return apiRequest<Membership>(`/wards/me/head-nurses/${encodeURIComponent(nurseId)}/grant`, {
    method: "POST",
    idempotencyKey: crypto.randomUUID(),
  });
}

// WARD-10. TODO: 대상을 고르는 화면이 Figma에 없어 연결하지 않았다.
export async function transferHeadNurse(targetNurseId: string): Promise<TransferResult> {
  return apiRequest<TransferResult>("/wards/me/head-nurse-transfer", {
    method: "POST",
    body: { targetNurseId },
    idempotencyKey: crypto.randomUUID(),
  });
}
