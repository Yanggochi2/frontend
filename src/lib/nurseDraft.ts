import type { NurseCreate } from "@/types/nursesApi.type";
import type { NurseDetail, NurseDraft } from "@/types/nurses.type";

export function emptyNurseDraft(name = ""): NurseDraft {
  return {
    name,
    hireYear: "",
    dutyRole: "GENERAL",
    careerYears: "0",
    careerMonths: "0",
    skill: 3,
    status: "ACTIVE",
    periodStart: "",
  };
}

// 권한(role)은 담지 않는다. 새로 등록하는 간호사는 항상 일반 간호사다.
export function toNurseCreate(d: NurseDraft): NurseCreate {
  return {
    name: d.name.trim(),
    dutyRole: d.dutyRole,
    status: d.status,
    // 명세서의 joinedAt은 날짜라서 입사년도를 그 해 1월 1일로 보낸다
    joinedAt: `${d.hireYear}-01-01`,
    careerMonths: Number(d.careerYears || 0) * 12 + Number(d.careerMonths || 0),
    skillLevel: d.skill,
    affiliationStart: d.periodStart,
  };
}

// 받지 못한 필드는 폼에 기본값으로 채워지므로, 수정할 때는 처음 값에서 바뀐 필드만 보낸다.
// 그래야 건드리지 않은 칸의 기본값이 서버 값을 덮어쓰지 않는다.
export function toNursePatch(initial: NurseDraft, current: NurseDraft): Partial<NurseCreate> {
  const before = toNurseCreate(initial);
  const after = toNurseCreate(current);
  const patch: Partial<NurseCreate> = {};
  (Object.keys(after) as (keyof NurseCreate)[]).forEach((key) => {
    if (after[key] !== before[key]) Object.assign(patch, { [key]: after[key] });
  });
  return patch;
}

export function toNurseDraft(nurse: NurseDetail): NurseDraft {
  return {
    name: nurse.name,
    hireYear: nurse.joinedAt.slice(0, 4),
    dutyRole: nurse.dutyRole ?? "GENERAL",
    careerYears: String(nurse.careerYears ?? 0),
    careerMonths: String(nurse.careerMonths ?? 0),
    skill: nurse.skill ?? 3,
    status: nurse.status ?? "ACTIVE",
    periodStart: nurse.affiliationStart,
  };
}
