import RulesBoard from "@/components/rules/RulesBoard";
import ApiOfflineBanner from "@/components/ui/ApiOfflineBanner";
import AdminButton from "@/components/ui/AdminButton";
import AdminPageHeader from "@/components/ui/AdminPageHeader";
import { RULE_FILTER_CHIPS } from "@/constants/rules.constants";
import { getRules } from "@/services/rulesApi";
import type { RulesData } from "@/types/rules.type";

export default async function RulesPage() {
  let data: RulesData | null = null;
  try {
    data = await getRules();
  } catch {
    data = null;
  }

  return (
    <div className="flex min-w-0 flex-col gap-8 px-12 pt-12 pb-10">
      <AdminPageHeader
        title="규칙 설정"
        subtitle="병동에 맞게 규칙을 더하고 고칠 수 있어요 · 필수는 어기면 확정할 수 없어요"
        // TODO: 프리셋 다시 적용(RULE-03) 동작은 아직 연결하지 않았다
        action={<AdminButton>프리셋 다시 적용</AdminButton>}
      />
      {data ? (
        <RulesBoard filters={data.filters} rules={data.rules} />
      ) : (
        <>
          <ApiOfflineBanner retryHref="/rules" />
          <RulesBoard filters={RULE_FILTER_CHIPS} rules={[]} />
        </>
      )}
    </div>
  );
}
