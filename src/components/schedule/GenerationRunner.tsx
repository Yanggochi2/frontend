"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GenerateProgress from "@/components/schedule/GenerateProgress";
import ScheduleButton from "@/components/ui/ScheduleButton";
import SchedulePageHeader from "@/components/ui/SchedulePageHeader";
import { toErrorMessage } from "@/lib/apiErrorMessage";
import { getGenerationJob, startGeneration } from "@/services/generationApi";
import { getScheduleById, getScheduleByYearMonth } from "@/services/scheduleApi";
import type { ApiGenerationJob } from "@/types/scheduleApi.type";
import type { GenerationProgress } from "@/types/schedule.type";

type Props = { initialJobId?: string; initialScheduleId?: string; initialYearMonth: string };

function progressOf(job: ApiGenerationJob, yearMonth: string): GenerationProgress {
  const [year, month] = yearMonth.split("-");
  const stage = typeof job.stage === "string" ? job.stage : "생성 중";
  return {
    periodLabel: `${year}년 ${Number(month)}월`,
    steps: [{ order: 1, title: stage === "COMPLETED" ? "근무표 생성 완료" : stage, status: stage === "COMPLETED" ? "done" : "active" }],
    metrics: [
      { label: "경과 시간", value: `${String(Math.floor(job.elapsedSeconds / 60)).padStart(2, "0")}:${String(job.elapsedSeconds % 60).padStart(2, "0")}`, tone: "default" },
      { label: "남은 하드 위반", value: `${job.hardViolationCount}건`, tone: job.hardViolationCount > 0 ? "danger" : "default" },
    ],
  };
}

export default function GenerationRunner({ initialJobId, initialScheduleId, initialYearMonth }: Props) {
  const router = useRouter();
  const [jobId, setJobId] = useState(initialJobId);
  const [scheduleId, setScheduleId] = useState(initialScheduleId);
  const [yearMonth, setYearMonth] = useState(initialYearMonth);
  const [job, setJob] = useState<ApiGenerationJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    async function start() {
      if (jobId) return;
      try {
        const schedule = initialScheduleId ? await getScheduleById(initialScheduleId) : await getScheduleByYearMonth(initialYearMonth);
        if (cancelled) return;
        const storageKey = `generation-attempt:${schedule.id}`;
        let idempotencyKey = sessionStorage.getItem(storageKey);
        if (!idempotencyKey) {
          const unique = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
          idempotencyKey = `generation-${schedule.id}-${unique}`;
          sessionStorage.setItem(storageKey, idempotencyKey);
        }
        const created = await startGeneration(schedule.id, { fixedCells: [], maxSeconds: 30 }, idempotencyKey);
        if (cancelled) return;
        sessionStorage.removeItem(storageKey);
        setScheduleId(schedule.id);
        setYearMonth(schedule.yearMonth);
        setJob(created);
        setJobId(created.id);
        router.replace(`/schedule/generate?jobId=${encodeURIComponent(created.id)}&ym=${encodeURIComponent(schedule.yearMonth)}`);
      } catch (e) {
        if (!cancelled) setError(toErrorMessage(e, "자동 생성을 시작하지 못했어요."));
      }
    }
    void start();
    return () => { cancelled = true; };
  }, [initialScheduleId, initialYearMonth, jobId, router]);

  useEffect(() => {
    if (!jobId) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    async function poll() {
      try {
        const next = await getGenerationJob(jobId!);
        if (cancelled) return;
        setJob(next);
        let resolvedMonth = yearMonth;
        if (!scheduleId) {
          const schedule = await getScheduleById(next.scheduleId);
          if (cancelled) return;
          setScheduleId(schedule.id);
          setYearMonth(schedule.yearMonth);
          resolvedMonth = schedule.yearMonth;
        }
        if (next.status === "SUCCEEDED") {
          router.replace(`/schedule?view=month&ym=${encodeURIComponent(resolvedMonth)}`);
          return;
        }
        if (next.status === "FAILED" || next.status === "NO_SOLUTION") {
          router.replace(`/schedule/generate/failed?jobId=${encodeURIComponent(next.id)}`);
          return;
        }
        timer = setTimeout(poll, 1000);
      } catch (e) {
        if (!cancelled) setError(toErrorMessage(e, "자동 생성 상태를 확인하지 못했어요."));
      }
    }
    void poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [jobId, router, scheduleId, yearMonth]);

  if (error) {
    return (
      <>
        <SchedulePageHeader title="자동 생성을 시작하지 못했어요" subtitle={error} />
        <div><ScheduleButton href={`/schedule?view=month&ym=${encodeURIComponent(yearMonth)}`} variant="primary" size="md">근무표로 돌아가기</ScheduleButton></div>
      </>
    );
  }

  if (!job) {
    const [year, month] = yearMonth.split("-");
    return <GenerateProgress data={{ periodLabel: `${year}년 ${Number(month)}월`, steps: [{ order: 1, title: "자동 생성 요청 중", status: "active" }], metrics: [{ label: "경과 시간", value: "00:00", tone: "default" }, { label: "남은 하드 위반", value: "-", tone: "default" }] }} />;
  }

  return <GenerateProgress data={progressOf(job, yearMonth)} />;
}
