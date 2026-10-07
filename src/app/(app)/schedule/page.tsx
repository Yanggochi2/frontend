import ScheduleEmptyState from "@/components/schedule/ScheduleEmptyState";
import ScheduleNurseUnpublished from "@/components/schedule/ScheduleNurseUnpublished";
import ScheduleSheet from "@/components/schedule/ScheduleSheet";
import ApiOfflineBanner from "@/components/ui/ApiOfflineBanner";
import SchedulePageHeader from "@/components/ui/SchedulePageHeader";
import { getOfflineSheet, getSchedulePage } from "@/services/scheduleApi";
import type { SchedulePageData } from "@/types/schedule.type";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

// 월별 보기는 /schedule?view=month 로 둔다 (router.md 참고).
export default async function SchedulePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  let data: SchedulePageData | null = null;
  try {
    data = await getSchedulePage({ view: first(sp.view) });
  } catch {
    data = null;
  }

  if (!data) {
    // 서버에 연결하지 못해도 근무표 틀(날짜 열, 도구 모음, 버튼)은 그대로 보여 준다.
    return (
      <div className="mx-auto flex h-full w-full max-w-[1400px] flex-col gap-3 px-6 py-4">
        <ApiOfflineBanner retryHref="/schedule" />
        <ScheduleSheet key={`offline-${sp.view ?? ""}`} sheet={getOfflineSheet(first(sp.view))} />
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
