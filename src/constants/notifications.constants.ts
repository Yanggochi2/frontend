import type { NotificationSettings } from "@/types/wardApi.type";

// 알림 설정 표시 문구. 키는 NOTI-03/04 필드명이다.
// TODO(🔶 알림 종류·웹 푸시 방식 미확정): webPush 토글 UI는 Figma에 없어 목록에 넣지 않았다.
export const NOTIFICATION_SETTING_COPY: {
  key: Exclude<keyof NotificationSettings, "webPush">;
  title: string;
  description: string;
}[] = [
  { key: "scheduleConfirmed", title: "근무표 확정 공지", description: "수간호사가 근무표를 확정하면 알려요" },
  { key: "requestResult", title: "신청 승인·반려 결과", description: "내가 낸 신청이 처리되면 알려요" },
  { key: "dutyReminder", title: "근무 전날 알림", description: "내일 근무를 하루 전에 알려요" },
  { key: "scheduleCancelled", title: "확정 취소 공지", description: "확정된 근무표가 취소되면 알려요" },
];
