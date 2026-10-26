import RequestsBoard from "@/components/requests/RequestsBoard";
import RnButton from "@/components/ui/RnButton";
import RnEmptyState from "@/components/ui/RnEmptyState";
import ApiOfflineBanner from "@/components/ui/ApiOfflineBanner";
import RnPageHeader from "@/components/ui/RnPageHeader";
import { getRequests } from "@/services/requestsApi";
import type { RequestListResult } from "@/types/requests.type";

const currentMonthLabel = () => {
  const now = new Date();
  return `${now.getFullYear()}년 ${now.getMonth() + 1}월`;
};

export default async function RequestsPage() {
  let result: RequestListResult | null = null;
  try {
    result = await getRequests();
  } catch {
    result = null;
  }

  return (
    <div className="flex flex-col gap-8 px-12 pt-12 pb-10">
      {result === null ? (
        <>
          <RnPageHeader
            title="신청 관리"
            subtitle="대기 중인 신청 0건"
            action={
              <RnButton variant="primary" href="/requests/new" className="px-6 text-[18px]">
                새 신청
              </RnButton>
            }
          />
          <ApiOfflineBanner retryHref="/requests" />
          <RequestsBoard items={[]} monthLabel={currentMonthLabel()} />
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
