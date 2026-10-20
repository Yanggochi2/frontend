import { SKILL_GROUP_THRESHOLD_YEARS, SKILL_WEIGHT } from "@/constants/nurses.constants";
import type { SkillGroup } from "@/types/nurses.type";

// 총경력·병동 경력(개월)으로 숙련 그룹 추천값을 낸다. 화면에 참고로만 보여 준다.
export function recommendSkillGroup(totalMonths: number, wardMonths: number): { group: SkillGroup; years: number } {
  const years = (SKILL_WEIGHT.total * totalMonths + SKILL_WEIGHT.ward * wardMonths) / 12;
  const found = SKILL_GROUP_THRESHOLD_YEARS.find((t) => years >= t.minYears);
  return { group: found?.group ?? SKILL_GROUP_THRESHOLD_YEARS[SKILL_GROUP_THRESHOLD_YEARS.length - 1].group, years };
}
