// mock: 백엔드 연동 전 임시 데이터. 응답 필드는 백엔드 확정 후 결정 (TODO)
import type { MyPageData, NotificationSetting } from "@/types/me.type";

// TODO(🔶 알림 종류·웹 푸시 방식 미확정): 알림 항목은 임시
const notifications: NotificationSetting[] = [
  { id: "n1", title: "근무표 확정 공지", description: "수간호사가 근무표를 확정하면 알려요", enabled: true },
  { id: "n2", title: "신청 승인·반려 결과", description: "내가 낸 신청이 처리되면 알려요", enabled: true },
  { id: "n3", title: "근무 전날 알림", description: "내일 근무를 하루 전에 알려요", enabled: false },
  { id: "n4", title: "확정 취소 공지", description: "확정된 근무표가 취소되면 알려요", enabled: true },
];

export const headNurseMyPageMock: MyPageData = {
  role: "HEAD_NURSE",
  profile: {
    name: "정은서",
    email: "eunseo@example.com",
    wardLabel: "샘플병원 · 내과 3병동",
    roleLabel: "수간호사",
    roleTone: "blue",
    dutyRoleLabel: "차지",
    dutyRoleTone: "blue",
    careerText: "12년 4개월",
    skillLevel: 5,
    joinedAt: "2014.03.01",
    editHint: "정보를 바꾸려면 간호사 명단에서 고쳐요",
  },
  stats: { periodLabel: "2026년 10월", d: 18, e: 0, n: 0, off: 12, offTargetLabel: "12 / 12", offTargetTone: "gray" },
  requests: [
    { id: "q1", typeLabel: "희망 오프", dateLabel: "10/14 (수)", statusLabel: "대기", statusTone: "blue", cancellable: true },
    { id: "q2", typeLabel: "희망 오프", dateLabel: "09/18 (금)", statusLabel: "승인", statusTone: "gray", cancellable: false },
    { id: "q3", typeLabel: "연차", dateLabel: "09/02 ~ 09/03", statusLabel: "승인", statusTone: "gray", cancellable: false },
  ],
  notifications,
};

export const nurseMyPageMock: MyPageData = {
  role: "NURSE",
  profile: {
    name: "박지우",
    email: "jiwoo@example.com",
    wardLabel: "샘플병원 · 내과 3병동",
    roleLabel: "간호사",
    roleTone: "gray",
    dutyRoleLabel: "프리셉터",
    dutyRoleTone: "gray",
    joinedAt: "2019.05.01",
    editHint: "정보를 바꾸려면 수간호사에게 요청해요",
  },
  stats: { periodLabel: "2026년 10월", d: 6, e: 8, n: 6, off: 10, offTargetLabel: "10 / 12 · 2일 부족", offTargetTone: "red" },
  requests: [
    { id: "q1", typeLabel: "연차", dateLabel: "10/20 ~ 10/22", statusLabel: "대기", statusTone: "blue", cancellable: true },
    { id: "q2", typeLabel: "희망 오프", dateLabel: "09/25 (금)", statusLabel: "승인", statusTone: "gray", cancellable: false },
    { id: "q3", typeLabel: "희망 오프", dateLabel: "09/10 (목)", statusLabel: "반려", statusTone: "red", cancellable: false },
  ],
  notifications,
};
