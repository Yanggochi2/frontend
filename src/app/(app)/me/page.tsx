import MyAccountCard from "@/components/me/MyAccountCard";
import MyDutyStatsCard from "@/components/me/MyDutyStatsCard";
import MyProfileCard from "@/components/me/MyProfileCard";
import MyRequestsCard from "@/components/me/MyRequestsCard";
import NotificationToggles from "@/components/me/NotificationToggles";
import AdminPageHeader from "@/components/ui/AdminPageHeader";
import { AdminErrorState } from "@/components/ui/AdminStatus";
import { getMyPage } from "@/services/meApi";
import { toPreviewState } from "@/types/adminCommon.type";
import type { MyPageData } from "@/types/me.type";

export default async function MyPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; role?: string }>;
}) {
  const params = await searchParams;
  // TODO: 역할은 서버가 세션에서 판정한다. ?role=nurse는 미리보기용 임시 스위치 (백엔드 연결 시 제거)
  const previewRole = params.role === "nurse" ? "NURSE" : "HEAD_NURSE";
  let data: MyPageData | null = null;
  try {
    data = await getMyPage(previewRole, toPreviewState(params.state));
  } catch {
    data = null;
  }

  return (
    <div className="flex min-w-0 flex-col gap-8 px-12 pt-12 pb-10">
      <AdminPageHeader title="마이페이지" subtitle="내 정보와 신청 내역을 한곳에서 봐요" />
      {!data ? (
        <AdminErrorState />
      ) : (
        <div className="grid w-full items-start gap-6 grid-cols-[minmax(0,640fr)_minmax(0,680fr)]">
          <div className="flex min-w-0 flex-col gap-6">
            <MyProfileCard profile={data.profile} />
            <NotificationToggles items={data.notifications} />
          </div>
          <div className="flex min-w-0 flex-col gap-6">
            <MyDutyStatsCard stats={data.stats} />
            <MyRequestsCard requests={data.requests} />
            <MyAccountCard />
          </div>
        </div>
      )}
    </div>
  );
}
