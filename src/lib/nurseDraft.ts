import { LEGACY_SKILL_LEVEL } from "@/constants/nurses.constants";
import type { NurseCreate, NurseProfileExtra } from "@/types/nursesApi.type";
import type { DutyRole, NurseDraft, NurseStatus } from "@/types/nurses.type";

export function emptyNurseDraft(name = ""): NurseDraft {
  return {
    name,
    hireDate: "",
    careerYears: "0",
    careerMonths: "0",
    wardYears: "0",
    wardMonths: "0",
    restriction: "NONE",
    skillGroup: null,
    isPreceptor: false,
    history: "",
    periodStart: "",
  };
}

const months = (years: string, rest: string) => Number(years || 0) * 12 + Number(rest || 0);

export function draftCareerMonths(d: NurseDraft) {
  return { total: months(d.careerYears, d.careerMonths), ward: months(d.wardYears, d.wardMonths) };
}

// 제출 전 확인. 문제가 있으면 화면에 보여 줄 문구를 돌려준다.
export function nurseDraftError(d: NurseDraft): string | null {
  if (!d.skillGroup) return "숙련 그룹을 골라 주세요.";
  const { total, ward } = draftCareerMonths(d);
  if (ward > total) return "병동 경력은 총경력보다 길 수 없어요.";
  return null;
}

// 지금 백엔드가 필수로 받는 듀티 역할·상태로 바꾼다. 차지는 따로 지정한다(차지 지정 API).
// TODO: 백엔드가 새 필드를 받으면 이 변환은 지운다.
function legacyDutyRole(d: NurseDraft): DutyRole {
  if (d.isPreceptor) return "PRECEPTOR";
  return d.skillGroup === "신규" ? "NEW" : "GENERAL";
}

function legacyStatus(d: NurseDraft): NurseStatus {
  return d.restriction === "PREGNANT" || d.restriction === "ON_LEAVE" ? d.restriction : "ACTIVE";
}

// 권한(role)은 담지 않는다. 새로 등록하는 간호사는 항상 일반 간호사다.
// 부르기 전에 nurseDraftError로 확인한다 (skillGroup이 있어야 한다).
export function toNurseCreate(d: NurseDraft): NurseCreate & NurseProfileExtra {
  const group = d.skillGroup ?? "중간";
  return {
    name: d.name.trim(),
    joinedAt: d.hireDate,
    careerMonths: draftCareerMonths(d).total,
    affiliationStart: d.periodStart,
    dutyRole: legacyDutyRole(d),
    status: legacyStatus(d),
    skillLevel: LEGACY_SKILL_LEVEL[group],
    wardCareerMonths: draftCareerMonths(d).ward,
    restriction: d.restriction,
    skillGroup: group,
    isPreceptor: d.isPreceptor,
    history: d.history.trim() || undefined,
  };
}
