import type { NurseCreate } from "@/types/nursesApi.type";
import type { NurseDraft } from "@/types/nurses.type";

export function emptyNurseDraft(name = ""): NurseDraft {
  return {
    name,
    hireDate: "",
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
    joinedAt: d.hireDate,
    careerMonths: Number(d.careerYears || 0) * 12 + Number(d.careerMonths || 0),
    skillLevel: d.skill,
    affiliationStart: d.periodStart,
  };
}
