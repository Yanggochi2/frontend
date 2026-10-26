"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RnFilterChip, { RnFilterDivider } from "@/components/ui/RnFilterChip";
import { shiftMonth } from "@/lib/schedulePeriod";
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

const monthLabel = (ym: string) => `${ym.slice(0, 4)}년 ${Number(ym.slice(5, 7))}월`;
const arrowCls = "flex size-11 shrink-0 items-center justify-center rounded-full bg-surface text-[20px] font-bold text-ink-sub";

// yearMonth: 거르는 달(YYYY-MM). null이면 전체 기간. 달은 URL(?ym=)로 바꾼다.
export default function RequestsBoard({
  items,
  yearMonth,
  thisMonth,
  mine = false,
}: {
  items: RequestItem[];
  yearMonth: string | null;
  thisMonth: string;
  mine?: boolean;
}) {
  const router = useRouter();
  const shown = yearMonth ?? thisMonth;
  const go = (ym: string | null) => router.push(ym ? `/requests?ym=${ym}` : "/requests");
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
        <RnFilterChip selected={yearMonth === null} onClick={() => go(null)}>
          전체 기간
        </RnFilterChip>
        <button type="button" aria-label="이전 달" onClick={() => go(shiftMonth(shown, -1))} className={arrowCls}>
          ‹
        </button>
        <RnFilterChip selected={yearMonth !== null} onClick={() => go(shown)}>
          {monthLabel(shown)}
        </RnFilterChip>
        <button type="button" aria-label="다음 달" onClick={() => go(shiftMonth(shown, 1))} className={arrowCls}>
          ›
        </button>
      </div>
      <RequestsTable items={visible} mine={mine} />
    </>
  );
}
