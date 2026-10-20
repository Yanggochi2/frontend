import GenerationRunner from "@/components/schedule/GenerationRunner";
import { todayKst } from "@/lib/schedulePeriod";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ScheduleGeneratePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const jobId = Array.isArray(sp.jobId) ? sp.jobId[0] : sp.jobId;
  const scheduleId = Array.isArray(sp.scheduleId) ? sp.scheduleId[0] : sp.scheduleId;
  const askedMonth = Array.isArray(sp.ym) ? sp.ym[0] : sp.ym;
  const yearMonth = /^\d{4}-(0[1-9]|1[0-2])$/.test(askedMonth ?? "") ? askedMonth! : todayKst().yearMonth;
  return (
    <div className="flex flex-col gap-8 px-12 pt-12 pb-10">
      <GenerationRunner initialJobId={jobId} initialScheduleId={scheduleId} initialYearMonth={yearMonth} />
    </div>
  );
}
