import MyAccountCard from "@/components/me/MyAccountCard";
import MyDutyStatsCard from "@/components/me/MyDutyStatsCard";
import MyProfileCard from "@/components/me/MyProfileCard";
import MyRequestsCard from "@/components/me/MyRequestsCard";
import NotificationToggles from "@/components/me/NotificationToggles";
import AdminPageHeader from "@/components/ui/AdminPageHeader";
import ApiOfflineBanner from "@/components/ui/ApiOfflineBanner";
import { getEmptyMyPage, getMyPage } from "@/services/meApi";
import type { MyPageData } from "@/types/me.type";

export default async function MyPage() {
  let data: MyPageData;
  let offline = false;
  try {
    data = await getMyPage();
  } catch {
    data = getEmptyMyPage();
    offline = true;
  }

  return (
    <div className="flex min-w-0 flex-col gap-8 px-12 pt-12 pb-10">
      <AdminPageHeader
        title="마이페이지"
        subtitle="내 정보와 신청 내역을 한곳에서 봐요"
      />
      {offline ? <ApiOfflineBanner retryHref="/me" /> : null}
      <div className="grid w-full items-start gap-6 grid-cols-[minmax(0,640fr)_minmax(0,680fr)]">
        <div className="flex min-w-0 flex-col gap-6">
          <MyProfileCard profile={data.profile} />
          <NotificationToggles items={data.notifications} />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          {data.stats ? <MyDutyStatsCard stats={data.stats} /> : null}
          <MyRequestsCard requests={data.requests} />
          <MyAccountCard />
        </div>
      </div>
    </div>
  );
}
