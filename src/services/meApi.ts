import { apiRequest, apiRequestList } from "@/lib/apiClient";
import { NOTIFICATION_SETTING_COPY } from "@/constants/notifications.constants";
import type { ApiListResult } from "@/types/api.type";
import type { MyPageData } from "@/types/me.type";
import type { ApiNotification, MeResponse, NotificationSettings } from "@/types/wardApi.type";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

// GET /me + GET /me/notification-settings. 역할은 서버가 세션에서 판정한다.
// 받은 필드만 채운다: 경력·숙련도·듀티 역할은 /me에 없으므로 비운다.
// TODO: 내 근무 통계(stats)와 내 신청 내역(requests)은 이 서비스가 주지 않는다.
//   통계는 명세에 API가 없고, 신청 내역은 REQ-02(requestsApi 소관)에 연결한다. 백엔드 확정 후 결정.
export async function getMyPage(): Promise<MyPageData> {

  const [me, settings] = await Promise.all([
    apiRequest<MeResponse>("/me"),
    apiRequest<NotificationSettings>("/me/notification-settings"),
  ]);
  if (!me.membership || !me.ward) throw new Error("no membership");

  const isHead = me.membership.role === "HEAD_NURSE";
  return {
    role: me.membership.role,
    profile: {
      name: me.user.name,
      email: me.user.email,
      wardLabel: `${me.ward.hospitalName} · ${me.ward.wardName}`,
      roleLabel: isHead ? "수간호사" : "간호사",
      roleTone: isHead ? "blue" : "gray",
      joinedAt: formatDate(me.membership.joinedAt),
      editHint: isHead ? "정보를 바꾸려면 간호사 명단에서 고쳐요" : "정보를 바꾸려면 수간호사에게 요청해요",
    },
    stats: undefined,
    requests: [],
    notifications: NOTIFICATION_SETTING_COPY.map((c) => ({
      id: c.key,
      title: c.title,
      description: c.description,
      enabled: settings[c.key],
    })),
  };
}

// NOTI-04. 바꾼 항목만 보낸다.
export async function updateNotificationSetting(key: string, enabled: boolean): Promise<void> {
  await apiRequest<NotificationSettings>("/me/notification-settings", {
    method: "PATCH",
    body: { [key]: enabled },
  });
}

// NOTI-01 (P2). TODO: 알림 목록 화면이 Figma에 없어 연결하지 않았다.
export async function listNotifications(
  query: { unreadOnly?: boolean; type?: string; page?: number; size?: number } = {},
): Promise<ApiListResult<ApiNotification>> {
  return apiRequestList<ApiNotification>("/me/notifications", { query });
}

// NOTI-02 (P2)
export async function markNotificationRead(id: string, read = true): Promise<ApiNotification> {
  return apiRequest<ApiNotification>(`/me/notifications/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: { read },
  });
}

// 서버에 연결하지 못했을 때 화면 틀만 보여 주기 위한 빈 값. 가짜 정보는 넣지 않는다.
export function getEmptyMyPage(): MyPageData {
  return {
    role: "NURSE",
    profile: {
      name: "-",
      email: "-",
      wardLabel: "-",
      roleLabel: "-",
      roleTone: "gray",
      joinedAt: "-",
      editHint: "",
    },
    stats: undefined,
    requests: [],
    notifications: NOTIFICATION_SETTING_COPY.map((c) => ({
      id: c.key,
      title: c.title,
      description: c.description,
      enabled: false,
    })),
  };
}
