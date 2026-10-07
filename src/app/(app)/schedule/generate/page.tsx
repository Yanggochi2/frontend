import GenerateProgress from "@/components/schedule/GenerateProgress";
import ScheduleErrorState from "@/components/schedule/ScheduleErrorState";
import { getGenerationProgress } from "@/services/generationApi";
import type { GenerationProgress } from "@/types/schedule.type";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ScheduleGeneratePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const jobId = Array.isArray(sp.jobId) ? sp.jobId[0] : sp.jobId;
  let data: GenerationProgress | null = null;
  try {
    data = await getGenerationProgress(jobId);
  } catch {
    data = null;
  }
  return (
    <div className="flex flex-col gap-8 px-12 pt-12 pb-10">
      {data ? <GenerateProgress data={data} /> : <ScheduleErrorState retryHref="/schedule/generate" />}
    </div>
  );
}
