import RequestsBoard from "@/components/requests/RequestsBoard";
import RnButton from "@/components/ui/RnButton";
import RnEmptyState from "@/components/ui/RnEmptyState";
import ApiOfflineBanner from "@/components/ui/ApiOfflineBanner";
import RnPageHeader from "@/components/ui/RnPageHeader";
import { getMyRequestList, getRequests } from "@/services/requestsApi";
import { getMyRole } from "@/services/shellApi";
import { todayKst } from "@/lib/schedulePeriod";
import type { RequestListResult } from "@/types/requests.type";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const YEAR_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;

// 수간호사는 병동 전체 신청을 승인·반려하고(신청 관리), 간호사는 본인 신청을 보고 취소한다(내 신청).
// ?ym=YYYY-MM 이면 그 달 신청만, 없으면 전체 기간 (router.md 참고).
export default async function RequestsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const rawYm = Array.isArray(sp.ym) ? sp.ym[0] : sp.ym;
  const yearMonth = rawYm && YEAR_MONTH.test(rawYm) ? rawYm : null;
  const thisMonth = todayKst().yearMonth;
  const mine = (await getMyRole()) === "NURSE";
  const title = mine ? "내 신청" : "신청 관리";

  let result: RequestListResult | null = null;
  try {
    const ym = yearMonth ?? undefined;
    result = await (mine ? getMyRequestList(ym) : getRequests({ yearMonth: ym }));
  } catch {
    result = null;
  }

  return (
    <div className="flex flex-col gap-8 px-12 pt-12 pb-10">
      {result === null ? (
        <>
          <RnPageHeader
            title={title}
            subtitle="대기 중인 신청 0건"
            action={
              <RnButton variant="primary" href="/requests/new" className="px-6 text-[18px]">
                새 신청
              </RnButton>
            }
          />
          <ApiOfflineBanner retryHref="/requests" />
          <RequestsBoard items={[]} yearMonth={yearMonth} thisMonth={thisMonth} mine={mine} />
        </>
      ) : result.items.length === 0 && yearMonth === null ? (
        <>
          <RnPageHeader title={title} subtitle="대기 중인 신청 0건" />
          <RnEmptyState
            icon="✓"
            title={mine ? "신청한 내역이 없어요" : "받은 신청이 없어요"}
            description={
              mine
                ? "연차나 희망 오프를 신청하면 여기에서 처리 상태를 볼 수 있어요."
                : "간호사가 연차나 희망 오프를 신청하면 여기에 모여요."
            }
            action={
              <RnButton variant={mine ? "primary" : "secondary"} size="lg" href="/requests/new">
                새 신청
              </RnButton>
            }
          />
        </>
      ) : (
        <>
          <RnPageHeader
            title={title}
            subtitle={
              mine
                ? `대기 중인 신청 ${result.pendingCount}건 · 근무표가 확정되기 전까지 취소할 수 있어요`
                : `대기 중인 신청 ${result.pendingCount}건 · 승인하면 자동 생성에 반영돼요`
            }
            action={
              <RnButton variant="primary" href="/requests/new" className="px-6 text-[18px]">
                새 신청
              </RnButton>
            }
          />
          <RequestsBoard items={result.items} yearMonth={yearMonth} thisMonth={thisMonth} mine={mine} />
        </>
      )}
    </div>
  );
}
