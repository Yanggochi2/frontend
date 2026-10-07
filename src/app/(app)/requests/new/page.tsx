import RequestForm from "@/components/requests/RequestForm";
import RnPageHeader from "@/components/ui/RnPageHeader";
import { getRequestFormOptions } from "@/services/requestsApi";

export default async function NewRequestPage() {
  const options = await getRequestFormOptions();

  return (
    <div className="flex flex-col gap-8 px-12 pt-12 pb-10">
      <RnPageHeader
        title="새 신청"
        subtitle="연차나 희망 오프를 신청해요 · 근무표가 확정되기 전까지 취소할 수 있어요"
      />
      <RequestForm options={options} />
    </div>
  );
}
