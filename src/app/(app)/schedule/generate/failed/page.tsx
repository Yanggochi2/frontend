import GenerateFailed from "@/components/schedule/GenerateFailed";
import ApiOfflineBanner from "@/components/ui/ApiOfflineBanner";
import { getEmptyGenerationFailure, getGenerationFailure } from "@/services/generationApi";
import type { GenerationFailure } from "@/types/schedule.type";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ScheduleGenerateFailedPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const jobId = Array.isArray(sp.jobId) ? sp.jobId[0] : sp.jobId;
  let data: GenerationFailure;
  let offline = false;
  try {
    data = await getGenerationFailure(jobId);
  } catch {
    data = getEmptyGenerationFailure();
    offline = true;
  }
  return (
    <div className="flex flex-col gap-8 px-12 pt-12 pb-10">
      {offline ? <ApiOfflineBanner retryHref="/schedule/generate/failed" /> : null}
      <GenerateFailed data={data} />
    </div>
  );
}
