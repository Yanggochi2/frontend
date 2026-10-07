import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import PendingCard from "@/components/onboarding/PendingCard";
import ApiOfflineBanner from "@/components/ui/ApiOfflineBanner";
import { getPendingInfo } from "@/services/onboardingApi";
import type { PendingInfo } from "@/types/onboarding.type";

export default async function PendingPage() {
  let info: PendingInfo;
  let offline = false;
  try {
    info = await getPendingInfo();
  } catch {
    // 불러오지 못하면 값 없이 화면 틀만 보여 준다.
    info = { hospitalName: "-", wardName: "-", requestedAt: "-" };
    offline = true;
  }
  return (
    <div className="flex min-h-screen-ui flex-col">
      <OnboardingTopBar />
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-6">
        {offline ? (
          <div className="w-full max-w-160">
            <ApiOfflineBanner retryHref="/onboarding/pending" />
          </div>
        ) : null}
        <PendingCard info={info} />
      </div>
    </div>
  );
}
