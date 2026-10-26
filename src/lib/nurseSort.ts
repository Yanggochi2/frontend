import type { DutyRole, NurseRole } from "@/types/nurses.type";

// 간호사 목록과 근무표 행이 같이 쓰는 정렬 기준 (5차 클라이언트 미팅: 숙련도순·이름순 2개)
// - 숙련도순(기본): 수간호사 → 차지 상단 고정, 나머지(프리셉터·일반·신입 구분 없이)는 총경력 긴 순, 같으면 이름순
// - 이름순: 직급 구분 없이 이름순
export type NurseSortKey = "skill" | "name";

export type NurseSortFields = {
  name: string;
  role?: NurseRole;
  dutyRole?: DutyRole;
  careerMonths?: number; // 총경력(개월). 값이 없으면 맨 뒤
};

// 수간호사 0, 차지 1, 나머지 2
const tier = (n: NurseSortFields) => (n.role === "HEAD_NURSE" ? 0 : n.dutyRole === "CHARGE" ? 1 : 2);

export function compareNurses(key: NurseSortKey, a: NurseSortFields, b: NurseSortFields): number {
  const byName = a.name.localeCompare(b.name, "ko");
  if (key === "name") return byName;
  return tier(a) - tier(b) || (b.careerMonths ?? -1) - (a.careerMonths ?? -1) || byName;
}
