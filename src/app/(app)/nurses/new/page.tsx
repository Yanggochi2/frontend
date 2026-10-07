import NurseForm from "@/components/nurses/NurseForm";
import RnPageHeader from "@/components/ui/RnPageHeader";

export default function NewNursePage() {
  return (
    <div className="flex flex-col gap-8 px-12 pt-12 pb-10">
      <RnPageHeader
        title="간호사 등록"
        subtitle="병동에 새 간호사를 추가해요 · 등록한 내용은 나중에 모두 고칠 수 있어요"
      />
      <NurseForm />
    </div>
  );
}
