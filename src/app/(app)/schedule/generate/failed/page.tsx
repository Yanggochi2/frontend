import GenerateFailed from "@/components/schedule/GenerateFailed";
import ScheduleErrorState from "@/components/schedule/ScheduleErrorState";
import { getGenerationFailure } from "@/services/scheduleApi";
import type { GenerationFailure } from "@/types/schedule.type";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// TODO: state 쿼리는 화면 미리보기용 임시 값 (Architecture.md)
export default async function ScheduleGenerateFailedPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const state = Array.isArray(sp.state) ? sp.state[0] : sp.state;
  let data: GenerationFailure | null = null;
  try {
    data = await getGenerationFailure(state);
  } catch {
    data = null;
  }
  return (
    <div className="flex flex-col gap-8 px-12 pt-12 pb-10">
      {data ? <GenerateFailed data={data} /> : <ScheduleErrorState retryHref="/schedule/generate/failed" />}
    </div>
  );
}
