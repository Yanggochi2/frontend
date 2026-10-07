"use client";

import { useState } from "react";
import RnFilterChip, { RnFilterDivider } from "@/components/ui/RnFilterChip";
import type { DutyRole, Nurse } from "@/types/nurses.type";
import { DUTY_ROLE_LABEL } from "@/constants/nurses.constants";
import NursesTable from "./NursesTable";

type Sort = "name" | "career";
type RoleFilter = DutyRole | "ALL";

const ROLE_FILTERS: { value: RoleFilter; label: string }[] = [
  { value: "ALL", label: "전체 역할" },
  { value: "CHARGE", label: DUTY_ROLE_LABEL.CHARGE },
  { value: "PRECEPTOR", label: DUTY_ROLE_LABEL.PRECEPTOR },
  { value: "NEW", label: DUTY_ROLE_LABEL.NEW },
];

const careerMonths = (n: Nurse) => (n.careerYears ?? 0) * 12 + (n.careerMonths ?? 0);

export default function NursesBoard({ items }: { items: Nurse[] }) {
  const [sort, setSort] = useState<Sort>("name");
  const [role, setRole] = useState<RoleFilter>("ALL");
  const [includeRetired, setIncludeRetired] = useState(false);

  const visible = items
    .filter((n) => (includeRetired || n.status !== "RETIRED") && (role === "ALL" || n.dutyRole === role))
    .sort((a, b) =>
      sort === "name" ? a.name.localeCompare(b.name, "ko") : careerMonths(b) - careerMonths(a),
    );

  return (
    <>
      <div className="flex w-full flex-wrap items-center gap-3">
        <RnFilterChip selected={sort === "name"} onClick={() => setSort("name")}>이름순</RnFilterChip>
        <RnFilterChip selected={sort === "career"} onClick={() => setSort("career")}>경력순</RnFilterChip>
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
