// mock: 백엔드 연동 전 임시 데이터. 응답 필드는 백엔드 확정 후 결정 (TODO)
import type { RequestFormOptions, RequestItem } from "@/types/requests.type";
import { REQUEST_REASONS } from "@/constants/requests.constants";

export const requestItemsMock: RequestItem[] = [
  { id: "r1", nurseName: "정은서", kind: "PREFERRED_OFF", targetDateLabel: "10/14 (수)", reason: "개인사정", requestedAtLabel: "10/01", status: "PENDING" },
  { id: "r2", nurseName: "박지우", kind: "ANNUAL_LEAVE", targetDateLabel: "10/20 ~ 10/22", reason: "가족행사", requestedAtLabel: "10/02", status: "PENDING" },
  { id: "r3", nurseName: "김도현", kind: "PREFERRED_OFF", targetDateLabel: "10/09 (금)", reason: "건강", requestedAtLabel: "10/02", status: "PENDING" },
  { id: "r4", nurseName: "이수아", kind: "PREFERRED_OFF", targetDateLabel: "10/24 (토)", reason: "학업", requestedAtLabel: "10/03", status: "PENDING" },
  { id: "r5", nurseName: "최민준", kind: "ANNUAL_LEAVE", targetDateLabel: "10/27", reason: "개인사정", requestedAtLabel: "10/04", status: "PENDING" },
  { id: "r6", nurseName: "강서윤", kind: "PREFERRED_OFF", targetDateLabel: "10/05 (월)", reason: "가족행사", requestedAtLabel: "09/28", status: "APPROVED", processedAtLabel: "10/01" },
];

export const requestFormOptionsMock: RequestFormOptions = {
  year: 2026,
  month: 10,
  today: 6,
  initialSelectedDay: 14,
  reasons: REQUEST_REASONS,
};
