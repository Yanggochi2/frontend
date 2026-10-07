import RulesTable from "@/components/rules/RulesTable";
import AdminButton from "@/components/ui/AdminButton";
import AdminPageHeader from "@/components/ui/AdminPageHeader";
import { AdminErrorState } from "@/components/ui/AdminStatus";
import { getRules } from "@/services/rulesApi";
import { toPreviewState } from "@/types/adminCommon.type";
import type { RulesData } from "@/types/rules.type";

export default async function RulesPage({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const state = toPreviewState((await searchParams).state);
  let data: RulesData | null = null;
  try {
    data = await getRules(state);
  } catch {
    data = null;
  }

  return (
    <div className="flex min-w-0 flex-col gap-8 px-12 pt-12 pb-10">
      <AdminPageHeader
        title="규칙 설정"
        subtitle="프리셋으로 시작한 뒤 하나씩 고칠 수 있어요"
        action={<AdminButton>프리셋 다시 적용</AdminButton>}
      />
      {data ? <RulesTable filters={data.filters} rules={data.rules} /> : <AdminErrorState />}
    </div>
  );
}
