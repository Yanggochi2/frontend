"use client";

import { useEffect, useState } from "react";
import { toErrorMessage } from "@/lib/apiErrorMessage";
import { getHolidayItems } from "@/services/rulesApi";
import type { HolidayItem } from "@/types/rules.type";

type Result = { key: string; items: HolidayItem[]; error: string | null };

// 공휴일 탭의 월별 목록. 달이 바뀌거나 reload를 부르면 다시 불러온다.
export function useHolidays(yearMonth: string) {
  const [round, setRound] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const key = `${yearMonth}#${round}`;

  useEffect(() => {
    let cancelled = false;
    getHolidayItems(yearMonth).then(
      (items) => !cancelled && setResult({ key, items, error: null }),
      (e) => !cancelled && setResult({ key, items: [], error: toErrorMessage(e, "공휴일을 불러오지 못했어요.") }),
    );
    return () => {
      cancelled = true;
    };
  }, [yearMonth, key]);

  const current = result?.key === key ? result : null;
  return {
    items: current?.items ?? [],
    loading: current === null,
    error: current?.error ?? null,
    reload: () => setRound((r) => r + 1),
  };
}
