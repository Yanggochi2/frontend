import RequestForm from "@/components/requests/RequestForm";
import RnPageHeader from "@/components/ui/RnPageHeader";
import { getRequestFormOptions } from "@/services/requestsApi";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

// 달 이동은 /requests/new?ym=YYYY-MM 으로 한다 (router.md 참고).
export default async function NewRequestPage({ searchParams }: { searchParams: SearchParams }) {
  const { ym } = await searchParams;
  const options = await getRequestFormOptions(Array.isArray(ym) ? ym[0] : ym);

  return (
    <div className="flex flex-col gap-8 px-12 pt-12 pb-10">
      <RnPageHeader
        title="새 신청"
        subtitle="연차나 희망 오프를 신청해요 · 근무표가 확정되기 전까지 취소할 수 있어요"
      />
      <RequestForm key={`${options.year}-${options.month}`} options={options} />
    </div>
  );
}
