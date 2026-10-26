import type { DutyRole, NurseRole } from "@/types/nurses.type";

// 간호사 목록과 근무표 행이 같이 쓰는 정렬 기준. 값이 없는 사람은 맨 뒤, 같으면 이름순.
// TODO: 숙련 그룹이 명세에 들어오면 숙련도순 기준을 그룹으로 바꾼다
export type NurseSortKey = "default" | "name" | "dutyRole" | "career" | "skill";

export type NurseSortFields = {
  name: string;
  role?: NurseRole;
  dutyRole?: DutyRole;
  careerMonths?: number; // 총경력(개월)
  skill?: number; // 숙련도 1~5 (API skillLevel)
};

// 역할순: 차지 → 프리셉터 → 일반 → 신입
const DUTY_ROLE_ORDER: DutyRole[] = ["CHARGE", "PRECEPTOR", "GENERAL", "NEW"];

const rank = (value?: DutyRole) => {
  const i = value === undefined ? -1 : DUTY_ROLE_ORDER.indexOf(value);
  return i < 0 ? DUTY_ROLE_ORDER.length : i;
};

// 큰 값이 앞. 값이 없으면 맨 뒤
const desc = (a?: number, b?: number) => (b ?? -1) - (a ?? -1);

const headFirst = (a: NurseSortFields, b: NurseSortFields) =>
  Number(b.role === "HEAD_NURSE") - Number(a.role === "HEAD_NURSE");

export function compareNurses(key: NurseSortKey, a: NurseSortFields, b: NurseSortFields): number {
  const byName = a.name.localeCompare(b.name, "ko");
  // 기본: 수간호사 → 역할 → 경력 (주간 회의 결정)
  if (key === "default")
    return headFirst(a, b) || rank(a.dutyRole) - rank(b.dutyRole) || desc(a.careerMonths, b.careerMonths) || byName;
  if (key === "dutyRole") return rank(a.dutyRole) - rank(b.dutyRole) || byName;
  if (key === "career") return desc(a.careerMonths, b.careerMonths) || byName;
  if (key === "skill") return desc(a.skill, b.skill) || byName;
  return byName;
}
