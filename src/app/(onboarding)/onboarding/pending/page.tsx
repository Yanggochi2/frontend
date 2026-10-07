import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import PendingCard from "@/components/onboarding/PendingCard";
import RnErrorState from "@/components/ui/RnErrorState";
import { getPendingInfo } from "@/services/onboardingApi";
import type { PendingInfo } from "@/types/onboarding.type";

export default async function PendingPage() {
  let info: PendingInfo | null = null;
  try {
    info = await getPendingInfo();
  } catch {
    info = null;
  }
  return (
    <div className="flex min-h-screen-ui flex-col">
      <OnboardingTopBar />
      <div className="flex flex-1 items-center justify-center px-6 py-6">
        {info ? (
          <PendingCard info={info} />
        ) : (
          <div className="w-full max-w-[640px]">
            <RnErrorState message="가입 신청 정보를 불러오지 못했어요" retryHref="/onboarding/pending" />
          </div>
        )}
      </div>
    </div>
  );
}
