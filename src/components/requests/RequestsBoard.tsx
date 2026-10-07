"use client";

import { useState } from "react";
import RnFilterChip, { RnFilterDivider } from "@/components/ui/RnFilterChip";
import type { RequestItem, RequestKind, RequestStatus } from "@/types/requests.type";
import RequestsTable from "./RequestsTable";

const STATUS_FILTERS: { value: RequestStatus; label: string }[] = [
  { value: "PENDING", label: "대기" },
  { value: "APPROVED", label: "승인" },
  { value: "REJECTED", label: "반려" },
];

const KIND_FILTERS: { value: RequestKind | "ALL"; label: string }[] = [
  { value: "ALL", label: "전체 종류" },
  { value: "ANNUAL_LEAVE", label: "연차" },
  { value: "PREFERRED_OFF", label: "희망 오프" },
  // TODO: 희망 근무(PREFERRED_SHIFT) 필터 칩은 시안에 없음
];

export default function RequestsBoard({
  items,
  monthLabel,
}: {
  items: RequestItem[];
  monthLabel: string;
}) {
  const [status, setStatus] = useState<RequestStatus>("PENDING");
  const [kind, setKind] = useState<RequestKind | "ALL">("ALL");

  const visible = items.filter(
    (i) => i.status === status && (kind === "ALL" || i.kind === kind),
  );

  return (
    <>
      <div className="flex w-full flex-wrap items-center gap-3">
        {STATUS_FILTERS.map((f) => (
          <RnFilterChip key={f.value} selected={status === f.value} onClick={() => setStatus(f.value)}>
            {f.label}
          </RnFilterChip>
        ))}
        <RnFilterDivider />
        {KIND_FILTERS.map((f) => (
          <RnFilterChip key={f.value} selected={kind === f.value} onClick={() => setKind(f.value)}>
            {f.label}
          </RnFilterChip>
        ))}
        <RnFilterDivider />
        {/* TODO: 월 선택 UI는 시안에 없음. 지금은 표시만 한다. */}
        <RnFilterChip selected={false}>{monthLabel}</RnFilterChip>
      </div>
      <RequestsTable items={visible} />
    </>
  );
}
