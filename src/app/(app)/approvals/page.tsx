import ApprovalsTable from "@/components/approvals/ApprovalsTable";
import AdminButton from "@/components/ui/AdminButton";
import AdminEmptyState from "@/components/ui/AdminEmptyState";
import AdminNotice from "@/components/ui/AdminNotice";
import AdminPageHeader from "@/components/ui/AdminPageHeader";
import { AdminErrorState } from "@/components/ui/AdminStatus";
import { getApprovals } from "@/services/approvalsApi";
import type { ApprovalsData } from "@/types/approvals.type";

export default async function ApprovalsPage() {
  let data: ApprovalsData | null = null;
  try {
    data = await getApprovals();
  } catch {
    data = null;
  }
  const isEmpty = data !== null && data.requests.length === 0;

  return (
    <div className="flex min-w-0 flex-col gap-8 px-12 pt-12 pb-10">
      <AdminPageHeader
        title="가입 승인"
        subtitle={
          data && !isEmpty
            ? `병동 코드로 가입을 신청한 ${data.requests.length}명이 기다리고 있어요`
            : "기다리는 가입 신청 0건"
        }
      />
      {!data ? (
        <AdminErrorState />
      ) : isEmpty ? (
        <AdminEmptyState
          icon="✓"
          title="기다리는 가입 신청이 없어요"
          description="병동 코드를 알려 주면 간호사가 가입을 신청할 수 있어요."
          action={
            <AdminButton variant="primary" size="lg" href="/ward-settings">
              병동 코드 보기
            </AdminButton>
          }
        />
      ) : (
        <>
          <AdminNotice>
            승인하면 ‘일반 간호사’로 들어와요. 수간호사 권한은 병동 설정에서만 줄 수 있어요.
          </AdminNotice>
          <ApprovalsTable requests={data.requests} />
        </>
      )}
    </div>
  );
}
