// mock: 백엔드 연동 전 임시 데이터. 응답 필드는 백엔드 확정 후 결정 (TODO)
import { OFF_TARGET_DAYS } from "@/constants/rules.constants";
import type { StatsData } from "@/types/stats.type";

const t = OFF_TARGET_DAYS;
export const statsMock: StatsData = {
  periodLabel: "2026년 10월",
  rows: [
    { id: "n1", name: "정은서", dayCount: 18, eveningCount: 0, nightCount: 0, offCount: 12, offTarget: t, weekendCount: 4, holidayCount: 1 },
    { id: "n2", name: "박지우", dayCount: 6, eveningCount: 8, nightCount: 6, offCount: 10, offTarget: t, weekendCount: 5, holidayCount: 2 },
    { id: "n3", name: "김도현", dayCount: 7, eveningCount: 7, nightCount: 6, offCount: 11, offTarget: t, weekendCount: 4, holidayCount: 1 },
    { id: "n4", name: "이수아", dayCount: 10, eveningCount: 10, nightCount: 0, offCount: 10, offTarget: t, weekendCount: 3, holidayCount: 1 },
    { id: "n5", name: "최민준", dayCount: 8, eveningCount: 6, nightCount: 6, offCount: 11, offTarget: t, weekendCount: 4, holidayCount: 1 },
    { id: "n6", name: "강서윤", dayCount: 9, eveningCount: 7, nightCount: 5, offCount: 10, offTarget: t, weekendCount: 3, holidayCount: 0 },
  ],
};
