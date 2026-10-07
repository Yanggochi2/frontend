// mock: 백엔드 연동 전 임시 데이터. 행위 목록·필드는 백엔드 확정 후 결정 (TODO)
import type { AuditLogData } from "@/types/audit.type";

export const auditMock: AuditLogData = {
  filters: [
    { key: "period", label: "최근 7일", active: true },
    { key: "actor", label: "전체 행위자" },
    { key: "action", label: "전체 행위", active: true },
    { key: "excel", label: "엑셀 내보내기", groupStart: true },
    { key: "confirm", label: "근무표 확정" },
    { key: "transfer", label: "권한 이관" },
  ],
  entries: [
    { id: "l1", occurredAt: "10/06 13:02", actorName: "정은서", actionLabel: "엑셀 내보내기", actionTone: "red", targetText: "2026년 10월 근무표", detailText: "파일 1건 다운로드" },
    { id: "l2", occurredAt: "10/06 11:40", actorName: "정은서", actionLabel: "근무표 확정", actionTone: "gray", targetText: "2026년 10월 근무표", detailText: "DRAFT → CONFIRMED · 소프트 위반 2건 확인" },
    { id: "l3", occurredAt: "10/05 17:20", actorName: "정은서", actionLabel: "확정 취소", actionTone: "gray", targetText: "2026년 9월 근무표", detailText: "CONFIRMED → DRAFT · 사유: 인원 조정" },
    { id: "l4", occurredAt: "10/05 09:12", actorName: "정은서", actionLabel: "가입 승인", actionTone: "blue", targetText: "최민준", detailText: "승인 대기 → 간호사" },
    { id: "l5", occurredAt: "10/03 15:48", actorName: "정은서", actionLabel: "코드 재발급", actionTone: "gray", targetText: "병동 코드", detailText: "이전 코드 비활성화" },
    { id: "l6", occurredAt: "10/02 10:05", actorName: "박지우", actionLabel: "로그인", actionTone: "gray", targetText: "-", detailText: "-" },
  ],
};
