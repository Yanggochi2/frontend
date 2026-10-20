import RequestForm from "@/components/requests/RequestForm";
import RnPageHeader from "@/components/ui/RnPageHeader";
import { getRequestFormOptions } from "@/services/requestsApi";

export default async function NewRequestPage() {
  const options = await getRequestFormOptions();

  return (
    <div className="flex flex-col gap-8 px-12 pt-12 pb-10">
      <RnPageHeader
        title="새 신청"
        subtitle="근무표 확정 전에 신청해요 · 승인된 연차는 반드시 쉬고, 희망 휴무는 인원이 충분할 때 반영해요"
      />
      <RequestForm options={options} />
    </div>
  );
}
