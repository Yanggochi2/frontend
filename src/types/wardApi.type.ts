// docs/API.md 병동·소속·알림 모델. 명세에 필드가 없는 응답은 TODO로 표시한다.
import type { UserSummary } from "./authApi.type";

export type MembershipRole = "HEAD_NURSE" | "NURSE";

export type Membership = {
  id: string;
  wardId: string;
  userId: string;
  role: MembershipRole;
  // TODO: 백엔드 확정 후 결정 (status 열거값. 승인 대기 상태 표기 포함)
  status: string;
  joinedAt: string;
};

export type ApiWard = {
  id: string;
  hospitalName: string;
  wardName: string;
  requiredStaff: { D: number; E: number; N: number };
  createdAt: string;
};

// AUTH-05. membership / ward는 소속이 없으면 null
export type MeResponse = {
  user: UserSummary;
  membership: Membership | null;
  ward: ApiWard | null;
};

// WARD-01. role/병동 ID를 본문에 담지 않는다.
export type CreateWardRequest = {
  hospitalName: string;
  wardName: string;
  requiredStaff: { D: number; E: number; N: number };
  // TODO: 백엔드 확정 후 결정 (rulePreset 값 형식과 목록)
  rulePreset: string;
};

// 명세: "Ward+Membership+joinCode" (정확한 모양은 명세에 없음)
export type CreateWardResponse = {
  ward: ApiWard;
  membership: Membership;
  // TODO: 백엔드 확정 후 결정 (joinCode 위치/모양)
  joinCode?: string;
};

// WARD-03
export type JoinWardRequest = { joinCode: string };

// WARD-03~06 MembershipRequest. 데이터 모델 절에 필드가 없다.
export type MembershipRequest = {
  id: string;
  // TODO: 백엔드 확정 후 결정 (status 열거값)
  status: string;
  // TODO: 백엔드 확정 후 결정 (아래 필드 이름과 존재 여부)
  applicantName?: string;
  requestedAt?: string;
  rejectionReason?: string;
};

// WARD-07/08 JoinCode. 모델이 명세에 없다.
export type JoinCode = {
  // TODO: 백엔드 확정 후 결정 (필드 이름)
  code: string;
};

// WARD-10. 응답 모양이 명세에 없다.
export type TransferResult = unknown; // TODO: 백엔드 확정 후 결정

// NOTI-03/04. 필드는 NOTI-04 입력 목록 기준 (값 타입은 추측: boolean)
export type NotificationSettings = {
  scheduleConfirmed: boolean;
  scheduleCancelled: boolean;
  requestResult: boolean;
  dutyReminder: boolean;
  webPush: boolean;
};

// NOTI-01/02
export type ApiNotification = {
  id: string;
  type: string; // TODO: 백엔드 확정 후 결정 (열거값)
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  resourceType: string;
  resourceId: string;
};
