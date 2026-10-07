import type { AdminChipTone } from "@/components/ui/AdminChip";

export type MyPageRole = "HEAD_NURSE" | "NURSE";

export type MyProfile = {
  name: string;
  email: string;
  wardLabel: string;
  roleLabel: string;
  roleTone: AdminChipTone;
  // 응답에 없으면 행을 숨긴다 (/me에는 듀티 역할이 없다)
  dutyRoleLabel?: string;
  dutyRoleTone?: AdminChipTone;
  // 일반 간호사 응답에는 없는 필드: 있을 때만 표시 (AGENTS 6.1)
  careerText?: string;
  skillLevel?: number;
  joinedAt: string;
  editHint: string;
};

export type MyDutyStats = {
  periodLabel: string;
  d: number;
  e: number;
  n: number;
  off: number;
  offTargetLabel: string;
  offTargetTone: AdminChipTone;
};

export type MyRequest = {
  id: string;
  typeLabel: string;
  dateLabel: string;
  statusLabel: string;
  statusTone: AdminChipTone;
  cancellable: boolean;
};

export type NotificationSetting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

export type MyPageData = {
  role: MyPageRole;
  profile: MyProfile;
  // 응답에 없으면 카드를 숨긴다 (내 통계 API는 명세에 없음)
  stats?: MyDutyStats;
  requests: MyRequest[];
  notifications: NotificationSetting[];
};
