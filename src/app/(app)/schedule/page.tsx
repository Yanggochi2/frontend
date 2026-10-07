import ScheduleEmptyState from "@/components/schedule/ScheduleEmptyState";
import ScheduleErrorState from "@/components/schedule/ScheduleErrorState";
import ScheduleNurseUnpublished from "@/components/schedule/ScheduleNurseUnpublished";
import ScheduleSheet from "@/components/schedule/ScheduleSheet";
import SchedulePageHeader from "@/components/ui/SchedulePageHeader";
import { getSchedulePage } from "@/services/scheduleApi";
import type { SchedulePageData } from "@/types/schedule.type";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

// 월별 보기는 /schedule?view=month 로 둔다 (router.md 참고).
// TODO: role/state 쿼리는 화면 미리보기용 임시 값. 역할은 서버가 판정하고, 백엔드 연결 시 제거한다.
export default async function SchedulePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  let data: SchedulePageData | null = null;
  try {
    data = await getSchedulePage({ state: first(sp.state), role: first(sp.role), view: first(sp.view) });
  } catch {
    data = null;
  }

  if (!data) {
    return (
      <div className="flex flex-col gap-8 px-12 pt-12 pb-10">
        <SchedulePageHeader title="근무표" />
        <ScheduleErrorState retryHref="/schedule" />
      </div>
    );
  }

  if (data.kind === "sheet") {
    return (
      <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col px-6 py-4">
        <ScheduleSheet key={`${data.sheet.view}-${data.sheet.unassigned}`} sheet={data.sheet} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 px-12 pt-12 pb-10">
      <SchedulePageHeader title="근무표" subtitle={data.periodLabel} />
      {data.kind === "no-nurses" ? <ScheduleEmptyState /> : <ScheduleNurseUnpublished />}
    </div>
  );
}
