"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ScheduleButton from "@/components/ui/ScheduleButton";
import { useSubmit } from "@/hooks/useSubmit";
import { generationHref, startRelaxedGeneration } from "@/services/generationApi";

// GEN-04. 고른 규칙을 완화해 새 생성 작업을 시작하고, 결과 화면으로 간다.
export default function GenerateRelaxButton({
  jobId,
  relaxationId,
  yearMonth,
  primary,
}: {
  jobId: string;
  relaxationId: string;
  yearMonth: string;
  primary: boolean;
}) {
  const router = useRouter();
  const [key] = useState(() => crypto.randomUUID());
  const { submit, loading, error } = useSubmit();

  async function run() {
    let href = "";
    const ok = await submit(async () => {
      href = generationHref(await startRelaxedGeneration(jobId, { relaxationIds: [relaxationId] }, key), yearMonth);
    });
    if (ok) {
      router.replace(href);
      router.refresh();
    }
  }

  return (
    <>
      <ScheduleButton variant={primary ? "brand" : "neutral"} size="xs" onClick={run} disabled={loading || jobId === ""}>
        {loading ? "다시 만드는 중…" : "이 방법으로 다시 만들기"}
      </ScheduleButton>
      {error ? (
        <p role="alert" className="text-[15px] font-bold text-danger">
          {error}
        </p>
      ) : null}
    </>
  );
}
