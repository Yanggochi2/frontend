// mock: 백엔드 연동 전 임시 데이터. 응답 필드는 백엔드 확정 후 결정 (TODO)
import type { Nurse } from "@/types/nurses.type";

export const nurseItemsMock: Nurse[] = [
  { id: "n1", name: "정은서", role: "HEAD_NURSE", dutyRole: "CHARGE", status: "ACTIVE", careerYears: 12, careerMonths: 4, skill: 5, periodLabel: "2014.03 ~ 재직" },
  { id: "n2", name: "박지우", role: "NURSE", dutyRole: "PRECEPTOR", status: "ACTIVE", careerYears: 7, careerMonths: 2, skill: 4, periodLabel: "2019.05 ~ 재직" },
  { id: "n3", name: "김도현", role: "NURSE", dutyRole: "GENERAL", status: "ACTIVE", careerYears: 4, careerMonths: 9, skill: 3, periodLabel: "2021.11 ~ 재직" },
  { id: "n4", name: "이수아", role: "NURSE", dutyRole: "GENERAL", status: "PREGNANT", careerYears: 5, careerMonths: 1, skill: 3, periodLabel: "2020.08 ~ 재직" },
  { id: "n5", name: "최민준", role: "NURSE", dutyRole: "NEW", status: "ACTIVE", careerYears: 0, careerMonths: 7, skill: 1, periodLabel: "2026.03 ~ 재직" },
  { id: "n6", name: "강서윤", role: "NURSE", dutyRole: "GENERAL", status: "ACTIVE", careerYears: 3, careerMonths: 0, skill: 2, periodLabel: "2023.09 ~ 재직" },
  { id: "n7", name: "한지민", role: "NURSE", dutyRole: "GENERAL", status: "RETIRED", careerYears: 6, careerMonths: 0, skill: 3, periodLabel: "2018.02 ~ 2025.12" },
];

// 화면 시안 헤더 문구("재직 8명")를 따른 임시 값. 목록 행 수와 다르다.
export const nurseActiveCountMock = 8;
