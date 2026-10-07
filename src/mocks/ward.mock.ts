// mock: 백엔드 연동 전 임시 데이터. 응답 필드는 백엔드 확정 후 결정 (TODO)
import { REQUIRED_STAFF_PER_DAY } from "@/constants/rules.constants";
import type { WardSettingsData } from "@/types/ward.type";

export const wardSettingsMock: WardSettingsData = {
  hospitalName: "샘플병원",
  wardName: "내과 3병동",
  nurseCount: 8,
  dailyRequired: { ...REQUIRED_STAFF_PER_DAY },
  ruleStartLabel: "일반 병동 기본값",
  wardCode: "AB12CD34",
  headNurses: [{ id: "h1", name: "정은서", isMe: true }],
};
