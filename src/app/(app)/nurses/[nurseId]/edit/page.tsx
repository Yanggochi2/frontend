import NurseForm from "@/components/nurses/NurseForm";
import RnErrorState from "@/components/ui/RnErrorState";
import RnPageHeader from "@/components/ui/RnPageHeader";
import { getNurse } from "@/services/nursesApi";

export default async function EditNursePage({ params }: PageProps<"/nurses/[nurseId]/edit">) {
  const { nurseId } = await params;
  const nurse = await getNurse(nurseId).catch(() => null);

  if (!nurse) {
    return (
      <div className="flex flex-col gap-8 px-12 pt-12 pb-10">
        <RnPageHeader title="간호사 정보 수정" subtitle="간호사 정보를 불러오지 못했어요" />
        <RnErrorState message="간호사 정보를 불러오지 못했어요." retryHref={`/nurses/${nurseId}/edit`} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 px-12 pt-12 pb-10">
      <RnPageHeader title="간호사 정보 수정" subtitle={`${nurse.name}님의 근무 배정 정보를 수정해요`} />
      <NurseForm nurse={nurse} />
    </div>
  );
}
