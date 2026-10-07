import AuditLogView from "@/components/audit/AuditLogView";
import AdminEmptyState from "@/components/ui/AdminEmptyState";
import AdminPageHeader from "@/components/ui/AdminPageHeader";
import { AdminErrorState } from "@/components/ui/AdminStatus";
import { getAuditLog } from "@/services/auditApi";
import { toPreviewState } from "@/types/adminCommon.type";
import type { AuditLogData } from "@/types/audit.type";

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const state = toPreviewState((await searchParams).state);
  let data: AuditLogData | null = null;
  try {
    data = await getAuditLog(state);
  } catch {
    data = null;
  }
  const isEmpty = data !== null && data.entries.length === 0;

  return (
    <div className="flex min-w-0 flex-col gap-8 px-12 pt-12 pb-10">
      <AdminPageHeader
        title="감사 로그"
        subtitle={
          isEmpty || !data
            ? "우리 병동의 활동 기록이에요"
            : "우리 병동의 활동 기록이에요 · 보기만 가능하고 지우거나 고칠 수 없어요"
        }
      />
      {!data ? (
        <AdminErrorState />
      ) : isEmpty ? (
        <AdminEmptyState
          icon="—"
          title="아직 기록이 없어요"
          description="병동에서 일어난 일이 여기에 차곡차곡 쌓여요. 기록은 보기만 할 수 있어요."
        />
      ) : (
        <AuditLogView filters={data.filters} entries={data.entries} />
      )}
    </div>
  );
}
