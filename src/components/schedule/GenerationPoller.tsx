"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GENERATION_POLL_MS } from "@/constants/schedule.constants";
import { generationHref, getGenerationJob } from "@/services/generationApi";

// 진행 화면에서 작업 상태를 주기적으로 확인한다. 끝나면 결과 화면으로 옮기고,
// 진행 중이면 서버 컴포넌트를 다시 불러와 단계·지표를 갱신한다. 화면에는 아무것도 그리지 않는다.
export default function GenerationPoller({ jobId, yearMonth }: { jobId: string; yearMonth: string }) {
  const router = useRouter();

  useEffect(() => {
    let stopped = false;
    const timer = setInterval(async () => {
      try {
        const job = await getGenerationJob(jobId);
        if (stopped) return;
        const href = generationHref(job, yearMonth);
        if (href.startsWith("/schedule/generate?")) router.refresh();
        else router.replace(href);
      } catch {
        // 잠깐 연결이 끊겨도 다음 주기에 다시 확인한다.
      }
    }, GENERATION_POLL_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [jobId, yearMonth, router]);

  return null;
}
