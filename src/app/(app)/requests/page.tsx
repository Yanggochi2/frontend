import RequestsBoard from "@/components/requests/RequestsBoard";
import RnButton from "@/components/ui/RnButton";
import RnEmptyState from "@/components/ui/RnEmptyState";
import RnErrorState from "@/components/ui/RnErrorState";
import RnPageHeader from "@/components/ui/RnPageHeader";
import { getRequests } from "@/services/requestsApi";
import type { PreviewState, RequestListResult } from "@/types/requests.type";

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;
  const preview = state === "empty" || state === "error" ? (state as PreviewState) : undefined;

  let result: RequestListResult | null = null;
  try {
    result = await getRequests(preview);
  } catch {
    result = null;
  }

  return (
    <div className="flex flex-col gap-8 px-12 pt-12 pb-10">
      {result === null ? (
        <>
          <RnPageHeader title="신청 관리" subtitle="신청 목록을 불러오지 못했어요" />
          <RnErrorState message="신청 목록을 불러오지 못했어요" retryHref="/requests" />
        </>
      ) : result.items.length === 0 ? (
        <>
          <RnPageHeader title="신청 관리" subtitle="대기 중인 신청 0건" />
          <RnEmptyState
            icon="✓"
            title="받은 신청이 없어요"
            description="간호사가 연차나 희망 오프를 신청하면 여기에 모여요."
            action={
              <RnButton variant="secondary" size="lg" href="/requests/new">
                새 신청
              </RnButton>
            }
          />
        </>
      ) : (
        <>
          <RnPageHeader
            title="신청 관리"
            subtitle={`대기 중인 신청 ${result.pendingCount}건 · 승인하면 자동 생성에 반영돼요`}
            action={
              <RnButton variant="primary" href="/requests/new" className="px-6 text-[18px]">
                새 신청
              </RnButton>
            }
          />
          <RequestsBoard items={result.items} monthLabel={result.monthLabel} />
        </>
      )}
    </div>
  );
}
