import GenerateFailed from "@/components/schedule/GenerateFailed";
import ScheduleErrorState from "@/components/schedule/ScheduleErrorState";
import { getGenerationFailure } from "@/services/generationApi";
import type { GenerationFailure } from "@/types/schedule.type";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ScheduleGenerateFailedPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const jobId = Array.isArray(sp.jobId) ? sp.jobId[0] : sp.jobId;
  let data: GenerationFailure | null = null;
  try {
    data = await getGenerationFailure(jobId);
  } catch {
    data = null;
  }
  return (
    <div className="flex flex-col gap-8 px-12 pt-12 pb-10">
      {data ? <GenerateFailed data={data} /> : <ScheduleErrorState retryHref="/schedule/generate/failed" />}
    </div>
  );
}
