"use client";

import { useState } from "react";
import RnFilterChip, { RnFilterDivider } from "@/components/ui/RnFilterChip";
import type { DutyRole, Nurse } from "@/types/nurses.type";
import { DUTY_ROLE_LABEL } from "@/constants/nurses.constants";
import { compareNurses, type NurseSortKey } from "@/lib/nurseSort";
import NursesTable from "./NursesTable";

type RoleFilter = DutyRole | "ALL";

const SORTS: { value: NurseSortKey; label: string }[] = [
  { value: "name", label: "이름순" },
  { value: "dutyRole", label: "직급순" },
  { value: "career", label: "경력순" },
  { value: "skill", label: "숙련도순" },
];

const ROLE_FILTERS: { value: RoleFilter; label: string }[] = [
  { value: "ALL", label: "전체 역할" },
  { value: "CHARGE", label: DUTY_ROLE_LABEL.CHARGE },
  { value: "PRECEPTOR", label: DUTY_ROLE_LABEL.PRECEPTOR },
  { value: "NEW", label: DUTY_ROLE_LABEL.NEW },
];

const sortFields = (n: Nurse) => ({
  ...n,
  careerMonths: n.careerYears === undefined ? undefined : n.careerYears * 12 + (n.careerMonths ?? 0),
});

export default function NursesBoard({ items }: { items: Nurse[] }) {
  const [sort, setSort] = useState<NurseSortKey>("name");
  const [role, setRole] = useState<RoleFilter>("ALL");
  const [includeRetired, setIncludeRetired] = useState(false);

  const visible = items
    .filter((n) => (includeRetired || n.status !== "RETIRED") && (role === "ALL" || n.dutyRole === role))
    .sort((a, b) => compareNurses(sort, sortFields(a), sortFields(b)));

  return (
    <>
      <div className="flex w-full flex-wrap items-center gap-3">
        {SORTS.map((s) => (
          <RnFilterChip key={s.value} selected={sort === s.value} onClick={() => setSort(s.value)}>
            {s.label}
          </RnFilterChip>
        ))}
        <RnFilterDivider />
        {ROLE_FILTERS.map((f) => (
          <RnFilterChip key={f.value} selected={role === f.value} onClick={() => setRole(f.value)}>
            {f.label}
          </RnFilterChip>
        ))}
        <RnFilterDivider />
        <RnFilterChip selected={includeRetired} onClick={() => setIncludeRetired((v) => !v)}>
          퇴사자 포함
        </RnFilterChip>
      </div>
      <NursesTable items={visible} />
    </>
  );
}
