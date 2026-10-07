import OnboardingTopBar from "@/components/onboarding/OnboardingTopBar";
import PendingCard from "@/components/onboarding/PendingCard";
import { getPendingInfo } from "@/services/onboardingApi";

export default async function PendingPage() {
  const info = await getPendingInfo();
  return (
    <div className="flex min-h-screen-ui flex-col">
      <OnboardingTopBar />
      <div className="flex flex-1 items-center justify-center px-6 py-6">
        <PendingCard info={info} />
      </div>
    </div>
  );
}
